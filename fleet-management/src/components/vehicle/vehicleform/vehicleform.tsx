import { useState } from "react";
import "./vehicleform.css";

interface VehicleFormProps {
  onClose: () => void;
}

function VehicleForm({ onClose }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    registration: "",
    model: "",
    type: "",
    capacity: "",
    odometer: "",
    cost: "",
    status: "Available",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    // API integration later

    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="vehicle-form">
        <h2>Add Vehicle</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="registration"
            placeholder="Registration Number"
            value={formData.registration}
            onChange={handleChange}
          />

          <input
            name="model"
            placeholder="Vehicle Model"
            value={formData.model}
            onChange={handleChange}
          />

          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>

            <option value="Van">Van</option>

            <option value="Truck">Truck</option>

            <option value="Bus">Bus</option>
          </select>

          <input
            name="capacity"
            placeholder="Maximum Load Capacity (kg)"
            value={formData.capacity}
            onChange={handleChange}
          />

          <input
            name="odometer"
            placeholder="Odometer"
            value={formData.odometer}
            onChange={handleChange}
          />

          <input
            name="cost"
            placeholder="Acquisition Cost"
            value={formData.cost}
            onChange={handleChange}
          />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Available</option>

            <option>On Trip</option>

            <option>In Shop</option>

            <option>Retired</option>
          </select>

          <div className="form-actions">
            <button type="submit">Save</button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;
