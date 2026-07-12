const prisma = require("../../config/db");

async function list(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.vehicleId) where.vehicleId = parseInt(filters.vehicleId);
  if (filters.driverId) where.driverId = parseInt(filters.driverId);

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 25;
  const skip = (page - 1) * limit;

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true } },
        driver: { select: { id: true, licenseNumber: true, user: { select: { name: true } } } },
        createdBy: { select: { id: true, name: true } },
      },
    }),
    prisma.trip.count({ where }),
  ]);

  return { trips, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getById(id) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: { select: { id: true, registrationNumber: true, name: true, maxLoadCapacity: true } },
      driver: { select: { id: true, licenseNumber: true, licenseExpiryDate: true, user: { select: { name: true } } } },
      createdBy: { select: { id: true, name: true } },
    },
  });
  if (!trip) {
    const err = new Error("Trip not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return trip;
}

async function create(data, userId) {
  return prisma.trip.create({
    data: {
      source: data.source,
      destination: data.destination,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      cargoWeight: data.cargoWeight,
      plannedDistance: data.plannedDistance,
      startOdometer: data.startOdometer,
      createdById: userId,
    },
    include: {
      vehicle: { select: { id: true, registrationNumber: true, name: true } },
      driver: { select: { id: true, licenseNumber: true, user: { select: { name: true } } } },
    },
  });
}

async function dispatchTrip(tripId) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true, maxLoadCapacity: true } },
        driver: { select: { id: true, licenseNumber: true, licenseExpiryDate: true, user: { select: { name: true } } } },
      },
    });

    if (!trip) {
      const err = new Error("Trip not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    // Rule: trip must be DRAFT
    if (trip.status !== "DRAFT") {
      const err = new Error(`Cannot dispatch trip in status '${trip.status}'. Only DRAFT trips can be dispatched`);
      err.status = 409;
      err.code = "INVALID_TRIP_STATUS";
      throw err;
    }

    const vehicle = await tx.vehicle.findUnique({ where: { id: trip.vehicleId } });

    // Rule: vehicle must be AVAILABLE (not IN_SHOP, RETIRED, or ON_TRIP)
    if (vehicle.status !== "AVAILABLE") {
      const err = new Error(`Vehicle '${vehicle.registrationNumber}' is currently '${vehicle.status}' and cannot be dispatched`);
      err.status = 409;
      err.code = "VEHICLE_NOT_AVAILABLE";
      throw err;
    }

    const driver = await tx.driver.findUnique({ where: { id: trip.driverId } });

    // Rule: driver must be AVAILABLE
    if (driver.status !== "AVAILABLE") {
      const err = new Error(`Driver is currently '${driver.status}' and cannot be assigned`);
      err.status = 409;
      err.code = "DRIVER_NOT_AVAILABLE";
      throw err;
    }

    // Rule: driver license must not be expired
    if (new Date(driver.licenseExpiryDate) < new Date()) {
      const err = new Error("Driver's license has expired. Cannot dispatch trip");
      err.status = 403;
      err.code = "LICENSE_EXPIRED";
      throw err;
    }

    // Rule: driver must not be SUSPENDED
    if (driver.status === "SUSPENDED") {
      const err = new Error("Driver is suspended and cannot be assigned to trips");
      err.status = 403;
      err.code = "DRIVER_SUSPENDED";
      throw err;
    }

    // Rule: cargo weight must not exceed vehicle capacity
    if (parseFloat(trip.cargoWeight) > parseFloat(vehicle.maxLoadCapacity)) {
      const err = new Error(`Cargo weight ${trip.cargoWeight}kg exceeds vehicle capacity ${vehicle.maxLoadCapacity}kg`);
      err.status = 400;
      err.code = "EXCEEDS_CAPACITY";
      throw err;
    }

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: { status: "DISPATCHED", dispatchedAt: new Date() },
    });

    await tx.vehicle.update({
      where: { id: vehicle.id },
      data: { status: "ON_TRIP" },
    });

    await tx.driver.update({
      where: { id: driver.id },
      data: { status: "ON_TRIP" },
    });

    return updatedTrip;
  });
}

async function completeTrip(tripId, endOdometer, fuelConsumed) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true, maxLoadCapacity: true, odometer: true } },
        driver: { select: { id: true, licenseNumber: true, licenseExpiryDate: true, user: { select: { name: true } } } },
      },
    });

    if (!trip) {
      const err = new Error("Trip not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    // Rule: trip must be DISPATCHED
    if (trip.status !== "DISPATCHED") {
      const err = new Error(`Cannot complete trip in status '${trip.status}'. Only DISPATCHED trips can be completed`);
      err.status = 409;
      err.code = "INVALID_TRIP_STATUS";
      throw err;
    }

    const startOdometer = parseFloat(trip.startOdometer || trip.vehicle.odometer);
    const actualDistance = endOdometer - startOdometer;

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        endOdometer,
        actualDistance: actualDistance > 0 ? actualDistance : 0,
      },
    });

    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { odometer: endOdometer, status: "AVAILABLE" },
    });

    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: "AVAILABLE" },
    });

    if (fuelConsumed !== undefined && fuelConsumed > 0) {
      await tx.fuelLog.create({
        data: {
          vehicleId: trip.vehicleId,
          tripId,
          liters: fuelConsumed,
          cost: 0,
          odometerReading: endOdometer,
          loggedDate: new Date(),
        },
      });
    }

    return updatedTrip;
  });
}

async function cancelTrip(tripId) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true } },
        driver: { select: { id: true, licenseNumber: true, user: { select: { name: true } } } },
      },
    });

    if (!trip) {
      const err = new Error("Trip not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    // Rule: trip must be DRAFT or DISPATCHED
    if (trip.status !== "DRAFT" && trip.status !== "DISPATCHED") {
      const err = new Error(`Cannot cancel trip in status '${trip.status}'. Only DRAFT or DISPATCHED trips can be cancelled`);
      err.status = 409;
      err.code = "INVALID_TRIP_STATUS";
      throw err;
    }

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    // Rule: if trip was DISPATCHED, restore vehicle and driver to AVAILABLE
    if (trip.status === "DISPATCHED") {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: "AVAILABLE" },
      });
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: "AVAILABLE" },
      });
    }

    return updatedTrip;
  });
}

module.exports = { list, getById, create, dispatchTrip, completeTrip, cancelTrip };
