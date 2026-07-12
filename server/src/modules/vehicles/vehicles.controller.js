const vehicleService = require("./vehicles.service");

async function list(req, res, next) {
  try {
    const result = await vehicleService.list(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const vehicle = await vehicleService.getById(parseInt(req.params.id));
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const vehicle = await vehicleService.create(req.validatedBody);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const vehicle = await vehicleService.update(parseInt(req.params.id), req.validatedBody);
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
}

async function retire(req, res, next) {
  try {
    const vehicle = await vehicleService.retire(parseInt(req.params.id));
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, retire };
