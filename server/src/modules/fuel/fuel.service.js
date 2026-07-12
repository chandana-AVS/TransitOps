const prisma = require("../../config/db");

async function list(filters = {}) {
  const where = {};
  if (filters.vehicleId) where.vehicleId = parseInt(filters.vehicleId);
  if (filters.tripId) where.tripId = parseInt(filters.tripId);

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 25;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.fuelLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { loggedDate: "desc" },
      include: { vehicle: { select: { id: true, registrationNumber: true } } },
    }),
    prisma.fuelLog.count({ where }),
  ]);

  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function create(data) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return prisma.fuelLog.create({ data });
}

module.exports = { list, create };
