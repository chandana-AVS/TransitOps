import "./vehiclefilters.css";

interface VehicleFiltersProps {
  search: string;

  setSearch: (value: string) => void;

  status: string;

  setStatus: (value: string) => void;

  type: string;

  setType: (value: string) => void;
}

function VehicleFilters({
  search,
  setSearch,
  status,
  setStatus,
  type,
  setType,
}: VehicleFiltersProps) {
  return (
    <div className="vehicle-filters">
      <input
        type="text"
        placeholder="Search vehicle..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>

        <option value="Available">Available</option>

        <option value="On Trip">On Trip</option>

        <option value="In Shop">In Shop</option>

        <option value="Retired">Retired</option>
      </select>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All Types</option>

        <option value="Van">Van</option>

        <option value="Truck">Truck</option>

        <option value="Bus">Bus</option>
      </select>
    </div>
  );
}

export default VehicleFilters;
