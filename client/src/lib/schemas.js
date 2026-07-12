import { z } from "zod";

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  name: z.string().min(1, "Vehicle name is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  maxLoadCapacity: z.coerce.number().positive("Max load capacity must be positive"),
  acquisitionCost: z.coerce.number().nonnegative("Acquisition cost cannot be negative"),
  region: z.string().optional().default(""),
});

export const createDriverSchema = z.object({
  userId: z.coerce.number().int().positive("User ID is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseCategory: z.string().min(1, "License category is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  safetyScore: z.coerce.number().min(0).max(10).optional().default(5.0),
});

export const createTripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  driverId: z.coerce.number().int().positive("Driver is required"),
  cargoWeight: z.coerce.number().positive("Cargo weight must be positive"),
  plannedDistance: z.coerce.number().positive("Planned distance must be positive"),
  startOdometer: z.coerce.number().nonnegative().optional(),
});

export const completeTripSchema = z.object({
  endOdometer: z.coerce.number().positive("End odometer must be positive"),
  fuelConsumed: z.coerce.number().nonnegative("Fuel consumed cannot be negative").optional(),
});

export const createMaintenanceSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  description: z.string().min(1, "Description is required"),
  cost: z.coerce.number().nonnegative("Cost cannot be negative"),
});

export const createFuelLogSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  liters: z.coerce.number().positive("Liters must be positive"),
  cost: z.coerce.number().nonnegative("Cost cannot be negative"),
  odometerReading: z.coerce.number().nonnegative("Odometer reading is required"),
  loggedDate: z.string().optional(),
});

export const createExpenseSchema = z.object({
  vehicleId: z.coerce.number().int().positive().optional(),
  type: z.string().min(1, "Type is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  expenseDate: z.string().optional(),
});
