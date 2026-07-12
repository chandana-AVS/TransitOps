const z = require("zod");

const createExpenseSchema = z.object({
  vehicleId: z.coerce.number().int().positive().optional().nullable(),
  tripId: z.coerce.number().int().positive().optional().nullable(),
  type: z.enum(["TOLL", "MAINTENANCE", "OTHER"]),
  amount: z.coerce.number().nonnegative("Amount cannot be negative"),
  description: z.string().min(1, "Description is required"),
  expenseDate: z.coerce.date().optional().default(() => new Date()),
});

module.exports = { createExpenseSchema };
