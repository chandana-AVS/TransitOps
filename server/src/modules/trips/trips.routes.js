const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/rbac");
const validate = require("../../middleware/validate");
const { createTripSchema, completeTripSchema } = require("./trips.schema.zod");
const controller = require("./trips.controller");

const router = Router();

router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("DRIVER", "FLEET_MANAGER"), validate(createTripSchema), controller.create);
router.post("/:id/dispatch", authorize("DRIVER", "FLEET_MANAGER"), controller.dispatch);
router.post("/:id/complete", authorize("DRIVER", "FLEET_MANAGER"), validate(completeTripSchema), controller.complete);
router.post("/:id/cancel", authorize("DRIVER", "FLEET_MANAGER"), controller.cancel);

module.exports = router;
