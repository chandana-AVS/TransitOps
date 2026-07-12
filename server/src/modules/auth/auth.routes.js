const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const authenticate = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const { loginSchema } = require("./auth.schema.zod");
const controller = require("./auth.controller");

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, error: { code: "TOO_MANY_ATTEMPTS", message: "Too many login attempts. Try again in 1 minute." } },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, validate(loginSchema), controller.login);
router.get("/me", authenticate, controller.getMe);

module.exports = router;
