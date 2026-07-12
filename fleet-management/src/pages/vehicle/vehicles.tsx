import { useState } from "react";
//import { useState } from "react";

import VehicleForm from "../../components/vehicle/vehicleform/vehicleform";

import VehicleTable from "../../components/vehicle/vehicletable/vehicletable";

import VehicleFilters from "../../components/vehicle/vehiclefilters/vehiclefilters";

import "./vehicles.css";

const vehicleData = [
  {
    registration: "AP01AB1234",
    model: "Van-05",
    type: "Van",
    capacity: "500 kg",
    status: "Available",
  },

  {
    registration: "AP02CD5678",
    model: "Truck-01",
    type: "Truck",
    capacity: "1000 kg",
    status: "On Trip",
  },

  {
    registration: "AP03EF7890",
    model: "Van-02",
    type: "Van",
    capacity: "700 kg",
    status: "In Shop",
  },
];

function Vehicles() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [type, setType] = useState("");

  const filteredVehicles = vehicleData.filter((vehicle) => {
    return (
      (vehicle.registration.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(search.toLowerCase())) &&
      (status === "" || vehicle.status === status) &&
      (type === "" || vehicle.type === type)
    );
  });

  return (
    <div className="vehicles-page">
      <div className="vehicles-header">
        <div>
          <h1>Vehicles</h1>

          <p>Manage fleet vehicles</p>
        </div>

        <button onClick={() => setShowForm(true)}>+ Add Vehicle</button>
        {showForm && <VehicleForm onClose={() => setShowForm(false)} />}
      </div>

      <VehicleFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        type={type}
        setType={setType}
      />

      <VehicleTable vehicles={filteredVehicles} />
    </div>
  );
}

export default Vehicles;
