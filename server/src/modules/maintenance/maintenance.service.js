const prisma = require("../../config/db");

async function list(filters = {}) {
  const where = {};
  if (filters.vehicleId) where.vehicleId = parseInt(filters.vehicleId);
  if (filters.status) where.status = filters.status;

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 25;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    prisma.maintenanceLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { vehicle: { select: { id: true, registrationNumber: true, name: true } } },
    }),
    prisma.maintenanceLog.count({ where }),
  ]);

  return { records, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function create(data) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  // Rule: vehicle must not be ON_TRIP
  if (vehicle.status === "ON_TRIP") {
    const err = new Error("Cannot open maintenance on a vehicle that is currently ON_TRIP");
    err.status = 409;
    err.code = "VEHICLE_ON_TRIP";
    throw err;
  }

  // TRANSACTION: create maintenance record and set vehicle to IN_SHOP
  return prisma.$transaction(async (tx) => {
    const record = await tx.maintenanceLog.create({
      data: { vehicleId: data.vehicleId, description: data.description, cost: data.cost },
    });

    await tx.vehicle.update({
      where: { id: data.vehicleId },
      data: { status: "IN_SHOP" },
    });

    return record;
  });
}

async function closeMaintenance(id) {
  const record = await prisma.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
  if (!record) {
    const err = new Error("Maintenance record not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  if (record.status === "CLOSED") {
    const err = new Error("Maintenance record is already closed");
    err.status = 409;
    err.code = "ALREADY_CLOSED";
    throw err;
  }

  // TRANSACTION: close maintenance and restore vehicle to AVAILABLE (unless retired)
  return prisma.$transaction(async (tx) => {
    const updated = await tx.maintenanceLog.update({
      where: { id },
      data: { status: "CLOSED", closedAt: new Date() },
    });

    if (record.vehicle.status !== "RETIRED") {
      await tx.vehicle.update({
        where: { id: record.vehicleId },
        data: { status: "AVAILABLE" },
      });
    }

    return updated;
  });
}

module.exports = { list, create, closeMaintenance };
