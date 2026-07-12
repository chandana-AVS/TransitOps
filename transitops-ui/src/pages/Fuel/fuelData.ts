export interface FuelEntry {
  id: string
  vehicle: string
  driver: string
  date: string
  liters: number
  cost: number
  station: string
  status: 'Completed' | 'Pending'
}

export const fuelEntries: FuelEntry[] = [
  {
    id: 'FUEL-001',
    vehicle: 'BUS-14',
    driver: 'Alicia Gomez',
    date: '2026-07-10',
    liters: 95,
    cost: 128.4,
    station: 'North Depot',
    status: 'Completed',
  },
  {
    id: 'FUEL-002',
    vehicle: 'BUS-08',
    driver: 'Marcus Lee',
    date: '2026-07-11',
    liters: 82,
    cost: 110.7,
    station: 'Market Street',
    status: 'Pending',
  },
  {
    id: 'FUEL-003',
    vehicle: 'BUS-19',
    driver: 'Nina Patel',
    date: '2026-07-12',
    liters: 88,
    cost: 119.2,
    station: 'Harbor Point',
    status: 'Completed',
  },
]
