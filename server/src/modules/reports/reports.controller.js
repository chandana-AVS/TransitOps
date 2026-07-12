const reportService = require("./reports.service");

async function getKpis(req, res, next) {
  try {
    const kpis = await reportService.getKpis();
    res.json({ success: true, data: kpis });
  } catch (err) {
    next(err);
  }
}

async function getFuelEfficiency(req, res, next) {
  try {
    const data = await reportService.getFuelEfficiency();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getUtilization(req, res, next) {
  try {
    const data = await reportService.getUtilization();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getCost(req, res, next) {
  try {
    const data = await reportService.getCost();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getRoi(req, res, next) {
  try {
    const data = await reportService.getRoi();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function exportCsv(req, res, next) {
  try {
    const csv = await reportService.exportCsv();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transitops-export.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

module.exports = { getKpis, getFuelEfficiency, getUtilization, getCost, getRoi, exportCsv };
