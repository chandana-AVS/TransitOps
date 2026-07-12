const { Router } = require("express");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/rbac");
const controller = require("./reports.controller");

const router = Router();

router.use(authenticate);

router.get("/kpis", controller.getKpis);
router.get("/fuel-efficiency", authorize("FINANCIAL_ANALYST", "FLEET_MANAGER"), controller.getFuelEfficiency);
router.get("/utilization", authorize("FINANCIAL_ANALYST", "FLEET_MANAGER"), controller.getUtilization);
router.get("/cost", authorize("FINANCIAL_ANALYST", "FLEET_MANAGER"), controller.getCost);
router.get("/roi", authorize("FINANCIAL_ANALYST", "FLEET_MANAGER"), controller.getRoi);
router.get("/export.csv", authorize("FINANCIAL_ANALYST", "FLEET_MANAGER"), controller.exportCsv);

module.exports = router;
