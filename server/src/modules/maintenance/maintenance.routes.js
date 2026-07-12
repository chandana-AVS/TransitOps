const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/rbac");
const validate = require("../../middleware/validate");
const { createMaintenanceSchema } = require("./maintenance.schema.zod");
const controller = require("./maintenance.controller");

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.post("/", authorize("FLEET_MANAGER"), validate(createMaintenanceSchema), controller.create);
router.post("/:id/close", authorize("FLEET_MANAGER"), controller.close);

module.exports = router;
