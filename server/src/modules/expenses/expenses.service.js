const prisma = require("../../config/db");

async function list(filters = {}) {
  const where = {};
  if (filters.vehicleId) where.vehicleId = parseInt(filters.vehicleId);
  if (filters.tripId) where.tripId = parseInt(filters.tripId);
  if (filters.type) where.type = filters.type;

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 25;
  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy: { expenseDate: "desc" },
      include: { vehicle: { select: { id: true, registrationNumber: true } } },
    }),
    prisma.expense.count({ where }),
  ]);

  return { expenses, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function create(data) {
  return prisma.expense.create({ data });
}

module.exports = { list, create };
