const prisma = require("../../config/db");

async function getKpis() {
  const [activeVehicles, availableVehicles, inShopVehicles, activeTrips, pendingTrips, driversOnDuty, availableDrivers, totalVehicles] = await Promise.all([
    prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
    prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
    prisma.vehicle.count({ where: { status: "IN_SHOP" } }),
    prisma.trip.count({ where: { status: "DISPATCHED" } }),
    prisma.trip.count({ where: { status: "DRAFT" } }),
    prisma.driver.count({ where: { status: "ON_TRIP" } }),
    prisma.driver.count({ where: { status: "AVAILABLE" } }),
    prisma.vehicle.count(),
  ]);

  const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

  return {
    activeVehicles,
    availableVehicles,
    inShopVehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    availableDrivers,
    fleetUtilization,
  };
}

async function getFuelEfficiency() {
  const trips = await prisma.trip.findMany({
    where: { status: "COMPLETED", actualDistance: { gt: 0 } },
    select: { id: true, actualDistance: true, vehicleId: true },
  });

  if (trips.length === 0) return { averageKmPerLiter: 0, totalTrips: 0 };

  const tripIds = trips.map((t) => t.id);
  const fuelLogs = await prisma.fuelLog.groupBy({
    by: ["tripId"],
    where: { tripId: { in: tripIds } },
    _sum: { liters: true },
  });

  const fuelMap = {};
  for (const fl of fuelLogs) {
    fuelMap[fl.tripId] = fl._sum.liters;
  }

  let totalKm = 0;
  let totalLiters = 0;
  for (const t of trips) {
    const liters = fuelMap[t.id] || 0;
    totalKm += parseFloat(t.actualDistance);
    totalLiters += parseFloat(liters);
  }

  return {
    averageKmPerLiter: totalLiters > 0 ? Math.round((totalKm / totalLiters) * 100) / 100 : 0,
    totalTrips: trips.length,
    totalDistance: Math.round(totalKm * 100) / 100,
    totalFuel: Math.round(totalLiters * 100) / 100,
  };
}

async function getUtilization() {
  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, registrationNumber: true, status: true, name: true },
  });

  const total = vehicles.length;
  const statusCounts = {};
  for (const v of vehicles) {
    statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
  }

  return {
    totalVehicles: total,
    breakdown: statusCounts,
    utilizationRate: total > 0 ? Math.round(((statusCounts["ON_TRIP"] || 0) / total) * 100) : 0,
  };
}

async function getCost() {
  const [fuelAgg, maintAgg, expenseAgg] = await Promise.all([
    prisma.fuelLog.aggregate({ _sum: { cost: true } }),
    prisma.maintenanceLog.aggregate({ _sum: { cost: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
  ]);

  const fuelCost = parseFloat(fuelAgg._sum.cost || 0);
  const maintenanceCost = parseFloat(maintAgg._sum.cost || 0);
  const otherExpenses = parseFloat(expenseAgg._sum.amount || 0);

  return {
    totalFuelCost: Math.round(fuelCost * 100) / 100,
    totalMaintenanceCost: Math.round(maintenanceCost * 100) / 100,
    totalOtherExpenses: Math.round(otherExpenses * 100) / 100,
    totalOperationalCost: Math.round((fuelCost + maintenanceCost + otherExpenses) * 100) / 100,
  };
}

async function getRoi() {
  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, registrationNumber: true, name: true, acquisitionCost: true },
  });

  const vehicleIds = vehicles.map((v) => v.id);

  const [fuelByVehicle, maintByVehicle, tripsByVehicle] = await Promise.all([
    prisma.fuelLog.groupBy({
      by: ["vehicleId"],
      where: { vehicleId: { in: vehicleIds } },
      _sum: { cost: true },
    }),
    prisma.maintenanceLog.groupBy({
      by: ["vehicleId"],
      where: { vehicleId: { in: vehicleIds } },
      _sum: { cost: true },
    }),
    prisma.trip.groupBy({
      by: ["vehicleId"],
      where: { vehicleId: { in: vehicleIds }, status: "COMPLETED" },
      _count: { id: true },
    }),
  ]);

  const costMap = {};
  for (const f of fuelByVehicle) costMap[f.vehicleId] = { fuel: parseFloat(f._sum.cost || 0), maint: 0 };
  for (const m of maintByVehicle) {
    if (!costMap[m.vehicleId]) costMap[m.vehicleId] = { fuel: 0, maint: 0 };
    costMap[m.vehicleId].maint = parseFloat(m._sum.cost || 0);
  }

  const tripCountMap = {};
  for (const t of tripsByVehicle) tripCountMap[t.vehicleId] = t._count.id;

  const results = vehicles.map((v) => {
    const costs = costMap[v.id] || { fuel: 0, maint: 0 };
    const totalCost = costs.fuel + costs.maint;
    const acquisitionCost = parseFloat(v.acquisitionCost);
    const estimatedRevenue = (tripCountMap[v.id] || 0) * 100;
    const roi = acquisitionCost > 0 ? Math.round(((estimatedRevenue - totalCost) / acquisitionCost) * 10000) / 100 : 0;

    return {
      vehicleId: v.id,
      registrationNumber: v.registrationNumber,
      name: v.name,
      acquisitionCost,
      totalOperatingCost: Math.round(totalCost * 100) / 100,
      estimatedRevenue,
      roi,
    };
  });

  return results;
}

async function exportCsv() {
  const trips = await prisma.trip.findMany({
    include: {
      vehicle: { select: { registrationNumber: true, name: true } },
      driver: { select: { licenseNumber: true, user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const header = "Trip ID,Source,Destination,Status,Vehicle,Cargo (kg),Distance (km),Driver,Created At\n";
  const rows = trips
    .map((t) => {
      return `${t.id},"${t.source}","${t.destination}",${t.status},${t.vehicle.registrationNumber},${t.cargoWeight},${t.actualDistance || t.plannedDistance},"${t.driver.user.name}",${t.createdAt.toISOString()}`;
    })
    .join("\n");

  return header + rows;
}

module.exports = { getKpis, getFuelEfficiency, getUtilization, getCost, getRoi, exportCsv };
