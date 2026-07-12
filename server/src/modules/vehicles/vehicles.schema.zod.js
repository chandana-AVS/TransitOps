const z = require("zod");

const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  name: z.string().min(1, "Vehicle name is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  maxLoadCapacity: z.coerce.number().positive("Max load capacity must be positive"),
  acquisitionCost: z.coerce.number().nonnegative("Acquisition cost cannot be negative"),
  region: z.string().optional().default(""),
});

const updateVehicleSchema = createVehicleSchema.partial();

module.exports = { createVehicleSchema, updateVehicleSchema };
