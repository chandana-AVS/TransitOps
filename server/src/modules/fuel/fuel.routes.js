const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/rbac");
const validate = require("../../middleware/validate");
const { createFuelLogSchema } = require("./fuel.schema.zod");
const controller = require("./fuel.controller");

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.post("/", authorize("FLEET_MANAGER", "DRIVER"), validate(createFuelLogSchema), controller.create);

module.exports = router;
