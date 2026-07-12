const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const env = require("./config/env");
const prisma = require("./config/db");

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL.split(","), credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    socket.join(`user-${user.id}`);

    if (user.role === "FLEET_MANAGER") socket.join("fm");
    socket.join(`role-${user.role}`);

    socket.on("join:dm", (targetUserId) => {
      const room = [user.id, targetUserId].sort().join("-");
      socket.join(`dm-${room}`);
    });

    socket.on("send:message", async ({ message, receiverId }) => {
      try {
        const ids = [user.id, receiverId].filter(Boolean).sort();
        const room = `dm-${ids.join("-")}`;

        const chatMessage = await prisma.chatMessage.create({
          data: {
            senderId: user.id,
            receiverId: receiverId || null,
            message,
          },
          include: {
            sender: { select: { id: true, name: true, email: true, role: { select: { name: true } } } },
          },
        });

        if (!receiverId) {
          io.emit("new:message", chatMessage);
        } else {
          io.to(`user-${user.id}`).to(`user-${receiverId}`).emit("new:message", chatMessage);
        }
      } catch (err) {
        socket.emit("error", err.message);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
}

module.exports = setupSocket;
