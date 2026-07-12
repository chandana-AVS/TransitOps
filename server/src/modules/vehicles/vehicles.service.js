const prisma = require("../../config/db");

async function list(filters = {}) {
  const where = {};
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.region) where.region = { contains: filters.region, mode: "insensitive" };

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 25;
  const skip = (page - 1) * limit;

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.vehicle.count({ where }),
  ]);

  return { vehicles, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getById(id) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return vehicle;
}

async function create(data) {
  const existing = await prisma.vehicle.findUnique({ where: { registrationNumber: data.registrationNumber } });
  if (existing) {
    const err = new Error("A vehicle with this registration number already exists");
    err.status = 409;
    err.code = "DUPLICATE_REGISTRATION";
    throw err;
  }
  return prisma.vehicle.create({ data });
}

async function update(id, data) {
  await getById(id);
  if (data.registrationNumber) {
    const existing = await prisma.vehicle.findUnique({ where: { registrationNumber: data.registrationNumber } });
    if (existing && existing.id !== id) {
      const err = new Error("A vehicle with this registration number already exists");
      err.status = 409;
      err.code = "DUPLICATE_REGISTRATION";
      throw err;
    }
  }
  return prisma.vehicle.update({ where: { id }, data });
}

async function retire(id) {
  const vehicle = await getById(id);
  if (vehicle.status === "RETIRED") {
    const err = new Error("Vehicle is already retired");
    err.status = 409;
    err.code = "ALREADY_RETIRED";
    throw err;
  }
  return prisma.vehicle.update({ where: { id }, data: { status: "RETIRED" } });
}

module.exports = { list, getById, create, update, retire };
