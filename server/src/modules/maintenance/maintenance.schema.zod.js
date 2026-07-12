const z = require("zod");

const createMaintenanceSchema = z.object({
  vehicleId: z.coerce.number().int().positive(),
  description: z.string().min(1, "Description is required"),
  cost: z.coerce.number().nonnegative("Cost cannot be negative"),
});

module.exports = { createMaintenanceSchema };
