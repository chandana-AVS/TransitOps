const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding TransitOps database...");

  // Clean existing data
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create roles
  const fleetManagerRole = await prisma.role.create({ data: { name: "FLEET_MANAGER" } });
  const driverRole = await prisma.role.create({ data: { name: "DRIVER" } });
  const safetyOfficerRole = await prisma.role.create({ data: { name: "SAFETY_OFFICER" } });
  const financialAnalystRole = await prisma.role.create({ data: { name: "FINANCIAL_ANALYST" } });
  console.log("Roles created: FLEET_MANAGER, DRIVER, SAFETY_OFFICER, FINANCIAL_ANALYST");

  const hash = await bcrypt.hash("password123", 10);

  // Create users
  const fmUser = await prisma.user.create({
    data: { name: "Alice Fleet", email: "fm@transitops.com", passwordHash: hash, roleId: fleetManagerRole.id },
  });
  const driverUser = await prisma.user.create({
    data: { name: "Alex Driver", email: "driver@transitops.com", passwordHash: hash, roleId: driverRole.id },
  });
  const soUser = await prisma.user.create({
    data: { name: "Sam Safety", email: "safety@transitops.com", passwordHash: hash, roleId: safetyOfficerRole.id },
  });
  const faUser = await prisma.user.create({
    data: { name: "Finn Analyst", email: "finance@transitops.com", passwordHash: hash, roleId: financialAnalystRole.id },
  });
  console.log("Users created (password: password123): fm@transitops.com, driver@transitops.com, safety@transitops.com, finance@transitops.com");

  // Create Van-05 (the example vehicle from the brief)
  const van05 = await prisma.vehicle.create({
    data: {
      registrationNumber: "Van-05",
      name: "Transit Cargo Van",
      model: "Ford Transit 2024",
      type: "VAN",
      maxLoadCapacity: 500,
      odometer: 15000,
      acquisitionCost: 35000,
      region: "Downtown",
    },
  });

  // Additional vehicles
  const truck01 = await prisma.vehicle.create({
    data: {
      registrationNumber: "Truck-01",
      name: "Heavy Hauler",
      model: "Volvo FH16",
      type: "TRUCK",
      maxLoadCapacity: 20000,
      odometer: 85000,
      acquisitionCost: 150000,
      region: "North Zone",
    },
  });

  const truck02 = await prisma.vehicle.create({
    data: {
      registrationNumber: "Truck-02",
      name: "Medium Transporter",
      model: "Isuzu NPR",
      type: "TRUCK",
      maxLoadCapacity: 5000,
      odometer: 42000,
      acquisitionCost: 65000,
      region: "South Zone",
    },
  });

  // Vehicle that starts IN_SHOP for demo purposes
  const vanShop = await prisma.vehicle.create({
    data: {
      registrationNumber: "Van-03",
      name: "Service Van",
      model: "Mercedes Sprinter",
      type: "VAN",
      maxLoadCapacity: 1000,
      odometer: 30000,
      acquisitionCost: 45000,
      status: "IN_SHOP",
      region: "East Zone",
    },
  });
  console.log("Vehicles created: Van-05 (500kg), Truck-01 (20t), Truck-02 (5t), Van-03 (in-shop)");

  // Create Alex as a driver (the example driver from the brief)
  const alexDriver = await prisma.driver.create({
    data: {
      userId: driverUser.id,
      licenseNumber: "LIC-ALEX-001",
      licenseCategory: "CLASS_C",
      licenseExpiryDate: new Date("2027-12-31"),
      contactNumber: "+1-555-0101",
      safetyScore: 9.5,
    },
  });

  // Additional drivers
  await prisma.driver.create({
    data: {
      userId: fmUser.id,
      licenseNumber: "LIC-FM-002",
      licenseCategory: "CLASS_B",
      licenseExpiryDate: new Date("2026-10-15"),
      contactNumber: "+1-555-0102",
      safetyScore: 8.0,
    },
  });

  // Driver with expired license (for violation test case)
  const expiredLicenseDriver = await prisma.user.create({
    data: { name: "Old Driver", email: "expired@transitops.com", passwordHash: hash, roleId: driverRole.id },
  });
  await prisma.driver.create({
    data: {
      userId: expiredLicenseDriver.id,
      licenseNumber: "LIC-EXP-003",
      licenseCategory: "CLASS_C",
      licenseExpiryDate: new Date("2025-01-15"),
      contactNumber: "+1-555-0103",
      safetyScore: 4.0,
    },
  });

  // Suspended driver (for violation test case)
  const suspendedDriverUser = await prisma.user.create({
    data: { name: "Bad Driver", email: "suspended@transitops.com", passwordHash: hash, roleId: driverRole.id },
  });
  await prisma.driver.create({
    data: {
      userId: suspendedDriverUser.id,
      licenseNumber: "LIC-SUS-004",
      licenseCategory: "CLASS_B",
      licenseExpiryDate: new Date("2027-06-01"),
      contactNumber: "+1-555-0104",
      safetyScore: 2.0,
      status: "SUSPENDED",
    },
  });
  console.log("Drivers created: Alex (active), expired-license driver, suspended driver");

  // Complete the example workflow from the brief:
  // Step 3-5: Create a trip with 450kg, dispatch it
  const exampleTrip = await prisma.trip.create({
    data: {
      source: "Warehouse A",
      destination: "Customer Site B",
      vehicleId: van05.id,
      driverId: alexDriver.id,
      cargoWeight: 450,
      plannedDistance: 120,
      startOdometer: 15000,
      createdById: driverUser.id,
      status: "DISPATCHED",
      dispatchedAt: new Date(),
    },
  });

  // Update vehicle and driver to ON_TRIP
  await prisma.vehicle.update({ where: { id: van05.id }, data: { status: "ON_TRIP" } });
  await prisma.driver.update({ where: { id: alexDriver.id }, data: { status: "ON_TRIP" } });
  console.log(`Example workflow: Trip #${exampleTrip.id} created and dispatched (Van-05 + Alex, 450kg)`);

  // Step 6: Complete the trip with odometer and fuel
  await prisma.trip.update({
    where: { id: exampleTrip.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      endOdometer: 15120,
      actualDistance: 120,
    },
  });
  await prisma.vehicle.update({ where: { id: van05.id }, data: { odometer: 15120, status: "AVAILABLE" } });
  await prisma.driver.update({ where: { id: alexDriver.id }, data: { status: "AVAILABLE" } });
  await prisma.fuelLog.create({
    data: {
      vehicleId: van05.id,
      tripId: exampleTrip.id,
      liters: 15,
      cost: 45,
      odometerReading: 15120,
      loggedDate: new Date(),
    },
  });
  console.log("Example workflow: Trip completed, vehicle/driver back to AVAILABLE");

  // Step 8: Create a maintenance record for Van-05 (oil change)
  const maintRecord = await prisma.maintenanceLog.create({
    data: {
      vehicleId: van05.id,
      description: "Oil Change & Filter Replacement",
      cost: 120,
    },
  });
  await prisma.vehicle.update({ where: { id: van05.id }, data: { status: "IN_SHOP" } });
  console.log(`Maintenance #${maintRecord.id} opened for Van-05 (IN_SHOP)`);

  // Close maintenance to restore to AVAILABLE
  await prisma.maintenanceLog.update({
    where: { id: maintRecord.id },
    data: { status: "CLOSED", closedAt: new Date() },
  });
  await prisma.vehicle.update({ where: { id: van05.id }, data: { status: "AVAILABLE" } });
  console.log("Maintenance closed, Van-05 back to AVAILABLE");

  // Add some fuel logs
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: truck01.id, liters: 80, cost: 240, odometerReading: 85000, loggedDate: new Date() },
      { vehicleId: truck01.id, liters: 75, cost: 225, odometerReading: 85200, loggedDate: new Date(Date.now() - 86400000) },
      { vehicleId: truck02.id, liters: 40, cost: 120, odometerReading: 42000, loggedDate: new Date() },
    ],
  });

  // Add some expenses
  await prisma.expense.createMany({
    data: [
      { vehicleId: truck01.id, type: "TOLL", amount: 25, description: "Highway toll Tag-01", expenseDate: new Date() },
      { vehicleId: truck01.id, type: "MAINTENANCE", amount: 500, description: "Brake pad replacement", expenseDate: new Date(Date.now() - 172800000) },
      { vehicleId: truck02.id, type: "TOLL", amount: 15, description: "Bridge toll", expenseDate: new Date() },
    ],
  });

  // Create a draft trip (for demo)
  await prisma.trip.create({
    data: {
      source: "Depot North",
      destination: "Construction Site 3",
      vehicleId: truck01.id,
      driverId: alexDriver.id,
      cargoWeight: 3000,
      plannedDistance: 200,
      createdById: driverUser.id,
    },
  });

  console.log("\n=== SEED SUMMARY ===");
  console.log("Login credentials (all use password: password123):");
  console.log("  Fleet Manager:    fm@transitops.com");
  console.log("  Driver:           driver@transitops.com");
  console.log("  Safety Officer:   safety@transitops.com");
  console.log("  Financial Analyst: finance@transitops.com");
  console.log("");
  console.log("Example workflow (from brief): Van-05 + Alex, 450kg trip ✓");
  console.log("Violation test cases available in the database:");
  console.log("  1. Over-capacity: 600kg > 500kg (Van-05)");
  console.log("  2. Expired license: expired@transitops.com");
  console.log("  3. Suspended driver: suspended@transitops.com");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
