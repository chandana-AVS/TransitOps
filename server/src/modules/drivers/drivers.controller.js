const driverService = require("./drivers.service");

async function list(req, res, next) {
  try {
    const result = await driverService.list(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const driver = await driverService.getById(parseInt(req.params.id));
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const driver = await driverService.create(req.validatedBody);
    res.status(201).json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const driver = await driverService.update(parseInt(req.params.id), req.validatedBody);
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
}

async function suspend(req, res, next) {
  try {
    const driver = await driverService.suspend(parseInt(req.params.id));
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, suspend };
