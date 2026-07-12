const z = require("zod");

const createTripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  vehicleId: z.coerce.number().int().positive(),
  driverId: z.coerce.number().int().positive(),
  cargoWeight: z.coerce.number().positive("Cargo weight must be positive"),
  plannedDistance: z.coerce.number().positive("Planned distance must be positive"),
  startOdometer: z.coerce.number().nonnegative().optional(),
});

const completeTripSchema = z.object({
  endOdometer: z.coerce.number().positive("End odometer must be positive"),
  fuelConsumed: z.coerce.number().nonnegative("Fuel consumed cannot be negative").optional(),
});

module.exports = { createTripSchema, completeTripSchema };
