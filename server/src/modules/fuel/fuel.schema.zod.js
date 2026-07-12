const z = require("zod");

const createFuelLogSchema = z.object({
  vehicleId: z.coerce.number().int().positive(),
  tripId: z.coerce.number().int().positive().optional().nullable(),
  liters: z.coerce.number().positive("Liters must be positive"),
  cost: z.coerce.number().nonnegative("Cost cannot be negative"),
  odometerReading: z.coerce.number().nonnegative("Odometer reading cannot be negative"),
  loggedDate: z.coerce.date().optional().default(() => new Date()),
});

module.exports = { createFuelLogSchema };
