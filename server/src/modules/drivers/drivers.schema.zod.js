const z = require("zod");

const createDriverSchema = z.object({
  userId: z.coerce.number().int().positive("User ID is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseCategory: z.string().min(1, "License category is required"),
  licenseExpiryDate: z.coerce.date({ message: "Valid license expiry date is required" }),
  contactNumber: z.string().min(1, "Contact number is required"),
  safetyScore: z.coerce.number().min(0).max(10).optional().default(5.0),
});

const updateDriverSchema = createDriverSchema.partial();

module.exports = { createDriverSchema, updateDriverSchema };
