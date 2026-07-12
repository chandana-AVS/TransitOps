const expenseService = require("./expenses.service");

async function list(req, res, next) {
  try {
    const result = await expenseService.list(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const expense = await expenseService.create(req.validatedBody);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create };
