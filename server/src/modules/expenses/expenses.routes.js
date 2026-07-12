const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/rbac");
const validate = require("../../middleware/validate");
const { createExpenseSchema } = require("./expenses.schema.zod");
const controller = require("./expenses.controller");

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.post("/", authorize("FLEET_MANAGER", "FINANCIAL_ANALYST"), validate(createExpenseSchema), controller.create);

module.exports = router;
