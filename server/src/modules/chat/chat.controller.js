const chatService = require("./chat.service");

async function getMessages(req, res, next) {
  try {
    const senderId = req.user.id;
    // Optional receiverId parameter to filter direct message threads
    const receiverId = req.query.receiverId ? parseInt(req.query.receiverId) : null;
    const messages = await chatService.listMessages(senderId, receiverId);
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

async function postMessage(req, res, next) {
  try {
    const senderId = req.user.id;
    const message = await chatService.createMessage(senderId, req.body);
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMessages, postMessage };
