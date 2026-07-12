const tripService = require("./trips.service");
const prisma = require("../../config/db");

async function list(req, res, next) {
  try {
    const query = { ...req.query };
    if (req.user.role === "DRIVER") {
      const driver = await prisma.driver.findFirst({ where: { userId: req.user.id } });
      if (driver) {
        query.driverId = driver.id;
      } else {
        return res.json({ success: true, data: { trips: [], total: 0, page: 1, limit: 25, totalPages: 0 } });
      }
    }
    const result = await tripService.list(query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const trip = await tripService.getById(parseInt(req.params.id));
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const trip = await tripService.create(req.validatedBody, req.user.id);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function dispatch(req, res, next) {
  try {
    const trip = await tripService.dispatchTrip(parseInt(req.params.id));
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const { endOdometer, fuelConsumed } = req.validatedBody;
    const trip = await tripService.completeTrip(parseInt(req.params.id), endOdometer, fuelConsumed);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const trip = await tripService.cancelTrip(parseInt(req.params.id));
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, dispatch, complete, cancel };
