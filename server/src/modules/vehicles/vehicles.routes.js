const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/rbac");
const validate = require("../../middleware/validate");
const { createVehicleSchema, updateVehicleSchema } = require("./vehicles.schema.zod");
const controller = require("./vehicles.controller");

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("FLEET_MANAGER"), validate(createVehicleSchema), controller.create);
router.put("/:id", authorize("FLEET_MANAGER"), validate(updateVehicleSchema), controller.update);
router.patch("/:id/retire", authorize("FLEET_MANAGER"), controller.retire);

module.exports = router;
