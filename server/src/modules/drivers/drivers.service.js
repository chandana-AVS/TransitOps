const prisma = require("../../config/db");

async function list(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.licenseCategory) where.licenseCategory = filters.licenseCategory;

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 25;
  const skip = (page - 1) * limit;

  const [drivers, total] = await Promise.all([
    prisma.driver.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.driver.count({ where }),
  ]);

  return { drivers, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getById(id) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!driver) {
    const err = new Error("Driver not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return driver;
}

async function create(data) {
  const existing = await prisma.driver.findUnique({ where: { licenseNumber: data.licenseNumber } });
  if (existing) {
    const err = new Error("A driver with this license number already exists");
    err.status = 409;
    err.code = "DUPLICATE_LICENSE";
    throw err;
  }
  const userExists = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!userExists) {
    const err = new Error("Referenced user does not exist");
    err.status = 400;
    err.code = "INVALID_USER";
    throw err;
  }
  return prisma.driver.create({ data });
}

async function update(id, data) {
  await getById(id);
  if (data.licenseNumber) {
    const existing = await prisma.driver.findUnique({ where: { licenseNumber: data.licenseNumber } });
    if (existing && existing.id !== id) {
      const err = new Error("A driver with this license number already exists");
      err.status = 409;
      err.code = "DUPLICATE_LICENSE";
      throw err;
    }
  }
  return prisma.driver.update({ where: { id }, data });
}

async function suspend(id) {
  const driver = await getById(id);
  if (driver.status === "SUSPENDED") {
    const err = new Error("Driver is already suspended");
    err.status = 409;
    err.code = "ALREADY_SUSPENDED";
    throw err;
  }
  return prisma.driver.update({ where: { id }, data: { status: "SUSPENDED" } });
}

async function unsuspend(id) {
  const driver = await getById(id);
  if (driver.status !== "SUSPENDED") {
    const err = new Error("Driver is not suspended");
    err.status = 409;
    err.code = "NOT_SUSPENDED";
    throw err;
  }
  return prisma.driver.update({ where: { id }, data: { status: "AVAILABLE" } });
}

module.exports = { list, getById, create, update, suspend, unsuspend };
