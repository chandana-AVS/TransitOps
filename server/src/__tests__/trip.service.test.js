const tripService = require("../modules/trips/trips.service");

const mockPrisma = {
  trip: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  vehicle: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn(), count: jest.fn() },
  driver: { findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  maintenanceLog: { findMany: jest.fn(), count: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  fuelLog: { create: jest.fn(), findMany: jest.fn(), groupBy: jest.fn() },
  expense: { create: jest.fn(), findMany: jest.fn(), aggregate: jest.fn() },
  user: { findUnique: jest.fn() },
};
mockPrisma.$transaction = jest.fn((fn) => fn(mockPrisma));

jest.mock("../config/db", () => {
  const m = {
    trip: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    vehicle: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn(), count: jest.fn() },
    driver: { findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    maintenanceLog: { findMany: jest.fn(), count: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    fuelLog: { create: jest.fn(), findMany: jest.fn(), groupBy: jest.fn() },
    expense: { create: jest.fn(), findMany: jest.fn(), aggregate: jest.fn() },
    user: { findUnique: jest.fn() },
  };
  m.$transaction = jest.fn((fn) => fn(m));
  return m;
});

// Reassign mockPrisma to the mocked module for assertions
beforeAll(() => {
  const db = require("../config/db");
  Object.assign(mockPrisma, db);
});

const mockTrip = (overrides = {}) => ({
  id: 1, source: "Warehouse A", destination: "Customer B", vehicleId: 1, driverId: 1,
  cargoWeight: 450, plannedDistance: 100, actualDistance: null, startOdometer: 10000, endOdometer: null,
  status: "DRAFT", dispatchedAt: null, completedAt: null, cancelledAt: null, createdById: 1,
  createdAt: new Date(), updatedAt: new Date(),
  vehicle: { id: 1, registrationNumber: "Van-05", maxLoadCapacity: 500 },
  driver: { id: 1, licenseNumber: "LIC-001", licenseExpiryDate: new Date("2027-12-31"), status: "AVAILABLE", user: { name: "Alex" } },
  ...overrides,
});

const mockVehicle = (overrides = {}) => ({
  id: 1, registrationNumber: "Van-05", name: "Test Van", status: "AVAILABLE", maxLoadCapacity: 500,
  odometer: 15000, acquisitionCost: 35000, type: "VAN", region: "Downtown", ...overrides,
});

const mockDriver = (overrides = {}) => ({
  id: 1, userId: 2, licenseNumber: "LIC-001", licenseCategory: "CLASS_C",
  licenseExpiryDate: new Date("2027-12-31"), contactNumber: "+1-555-0101", safetyScore: 9.5,
  status: "AVAILABLE", user: { name: "Alex" }, ...overrides,
});

let db;
beforeEach(() => {
  db = require("../config/db");
  jest.clearAllMocks();
});

describe("dispatchTrip", () => {
  it("rejects a non-DRAFT trip with 409", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip({ status: "DISPATCHED" }));
    await expect(tripService.dispatchTrip(1)).rejects.toMatchObject({ status: 409, code: "INVALID_TRIP_STATUS" });
  });

  it("rejects an IN_SHOP vehicle with 409", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip());
    db.vehicle.findUnique.mockResolvedValue(mockVehicle({ status: "IN_SHOP" }));
    await expect(tripService.dispatchTrip(1)).rejects.toMatchObject({ status: 409, code: "VEHICLE_NOT_AVAILABLE" });
  });

  it("rejects a RETIRED vehicle with 409", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip());
    db.vehicle.findUnique.mockResolvedValue(mockVehicle({ status: "RETIRED" }));
    await expect(tripService.dispatchTrip(1)).rejects.toMatchObject({ status: 409, code: "VEHICLE_NOT_AVAILABLE" });
  });

  it("rejects expired license driver with 403", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip());
    db.vehicle.findUnique.mockResolvedValue(mockVehicle());
    db.driver.findUnique.mockResolvedValue(mockDriver({ licenseExpiryDate: new Date("2024-01-01") }));
    await expect(tripService.dispatchTrip(1)).rejects.toMatchObject({ status: 403, code: "LICENSE_EXPIRED" });
  });

  it("rejects over-capacity cargo with 400", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip({ cargoWeight: 600 }));
    db.vehicle.findUnique.mockResolvedValue(mockVehicle({ maxLoadCapacity: 500 }));
    db.driver.findUnique.mockResolvedValue(mockDriver());
    await expect(tripService.dispatchTrip(1)).rejects.toMatchObject({ status: 400, code: "EXCEEDS_CAPACITY" });
  });

  it("transitions trip/vehicle/driver status correctly", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip());
    db.vehicle.findUnique.mockResolvedValue(mockVehicle());
    db.driver.findUnique.mockResolvedValue(mockDriver());
    db.trip.update.mockResolvedValue(mockTrip({ status: "DISPATCHED", dispatchedAt: new Date() }));
    db.vehicle.update.mockResolvedValue(mockVehicle({ status: "ON_TRIP" }));
    db.driver.update.mockResolvedValue(mockDriver({ status: "ON_TRIP" }));

    const result = await tripService.dispatchTrip(1);
    expect(result.status).toBe("DISPATCHED");
    expect(db.vehicle.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "ON_TRIP" } }));
    expect(db.driver.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "ON_TRIP" } }));
  });
});

describe("completeTrip", () => {
  it("rejects a non-DISPATCHED trip with 409", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip({ status: "DRAFT" }));
    await expect(tripService.completeTrip(1, 10120, 15)).rejects.toMatchObject({ status: 409, code: "INVALID_TRIP_STATUS" });
  });

  it("computes actual_distance from odometer diff", async () => {
    const trip = mockTrip({ status: "DISPATCHED", startOdometer: 10000, vehicle: { id: 1, registrationNumber: "Van-05", maxLoadCapacity: 500, odometer: 10000 } });
    db.trip.findUnique.mockResolvedValue(trip);
    db.trip.update.mockResolvedValue({ ...trip, status: "COMPLETED", actualDistance: 120, endOdometer: 10120 });
    db.vehicle.update.mockResolvedValue({});
    db.driver.update.mockResolvedValue({});
    db.fuelLog.create.mockResolvedValue({});

    await tripService.completeTrip(1, 10120, 15);
    expect(db.trip.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ actualDistance: 120 }) }));
  });

  it("restores vehicle and driver to AVAILABLE", async () => {
    const trip = mockTrip({ status: "DISPATCHED", vehicle: { id: 1, odometer: 10000 }, startOdometer: 10000 });
    db.trip.findUnique.mockResolvedValue(trip);
    db.trip.update.mockResolvedValue({ ...trip, status: "COMPLETED" });
    db.vehicle.update.mockResolvedValue({});
    db.driver.update.mockResolvedValue({});

    await tripService.completeTrip(1, 10120, 15);
    expect(db.vehicle.update).toHaveBeenCalledWith(expect.objectContaining({ data: { odometer: 10120, status: "AVAILABLE" } }));
    expect(db.driver.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "AVAILABLE" } }));
  });
});

describe("cancelTrip", () => {
  it("rejects a COMPLETED trip with 409", async () => {
    db.trip.findUnique.mockResolvedValue(mockTrip({ status: "COMPLETED" }));
    await expect(tripService.cancelTrip(1)).rejects.toMatchObject({ status: 409, code: "INVALID_TRIP_STATUS" });
  });

  it("restores vehicle/driver when cancelling DISPATCHED trip", async () => {
    const trip = mockTrip({ status: "DISPATCHED" });
    db.trip.findUnique.mockResolvedValue(trip);
    db.trip.update.mockResolvedValue({ ...trip, status: "CANCELLED" });

    await tripService.cancelTrip(1);
    expect(db.vehicle.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "AVAILABLE" } }));
    expect(db.driver.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "AVAILABLE" } }));
  });

  it("does NOT restore vehicle/driver when cancelling DRAFT trip", async () => {
    const trip = mockTrip({ status: "DRAFT" });
    db.trip.findUnique.mockResolvedValue(trip);
    db.trip.update.mockResolvedValue({ ...trip, status: "CANCELLED" });

    await tripService.cancelTrip(1);
    expect(db.vehicle.update).not.toHaveBeenCalled();
    expect(db.driver.update).not.toHaveBeenCalled();
  });
});
