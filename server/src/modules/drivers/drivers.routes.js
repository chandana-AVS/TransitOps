const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/rbac");
const validate = require("../../middleware/validate");
const { createDriverSchema, updateDriverSchema } = require("./drivers.schema.zod");
const controller = require("./drivers.controller");

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validate(createDriverSchema), controller.create);
router.put("/:id", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validate(updateDriverSchema), controller.update);
router.patch("/:id/suspend", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), controller.suspend);

module.exports = router;
