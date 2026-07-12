const fuelService = require("./fuel.service");

async function list(req, res, next) {
  try {
    const result = await fuelService.list(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const log = await fuelService.create(req.validatedBody);
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create };
