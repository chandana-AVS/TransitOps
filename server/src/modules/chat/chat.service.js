const prisma = require("../../config/db");

async function listMessages(senderId, receiverId) {
  const where = receiverId
    ? { OR: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }] }
    : { receiverId: null };

  return prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, email: true, role: { select: { name: true } } } },
      receiver: { select: { id: true, name: true } }
    }
  });
}

async function createMessage(senderId, data) {
  const { message, receiverId } = data;

  const chatMessage = await prisma.chatMessage.create({
    data: {
      senderId,
      receiverId: receiverId ? parseInt(receiverId) : null,
      message,
    },
    include: {
      sender: { select: { name: true, email: true, role: { select: { name: true } } } }
    }
  });

  return chatMessage;
}

module.exports = { listMessages, createMessage };
