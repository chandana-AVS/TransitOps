const maintenanceService = require("./maintenance.service");

async function list(req, res, next) {
  try {
    const result = await maintenanceService.list(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const record = await maintenanceService.create(req.validatedBody);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

async function close(req, res, next) {
  try {
    const record = await maintenanceService.closeMaintenance(parseInt(req.params.id));
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, close };
