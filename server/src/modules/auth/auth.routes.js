const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const { loginSchema } = require("./auth.schema.zod");
const controller = require("./auth.controller");

const router = Router();

router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authenticate, controller.getMe);

module.exports = router;
