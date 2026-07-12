const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const controller = require("./chat.controller");

const router = Router();

router.use(authenticate);

router.get("/messages", controller.getMessages);
router.post("/messages", controller.postMessage);

module.exports = router;
