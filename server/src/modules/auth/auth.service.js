const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");
const env = require("../../config/env");

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      driver: { select: { status: true } },
    },
  });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role.name, name: user.name },
    env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      driverStatus: user.role.name === "DRIVER" ? user.driver?.status || null : null,
    },
  };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: { select: { name: true } },
      driver: { select: { status: true } },
    },
  });

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    driverStatus: user.role.name === "DRIVER" ? user.driver?.status || null : null,
  };
}

module.exports = { login, getMe };
