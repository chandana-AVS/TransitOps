import "./FuelCard.css";

import {
  Truck,
  Route,
  Droplets,
  IndianRupee,
  Gauge,
  Calendar,
  Eye,
  Pencil,
  Trash2
} from "lucide-react";

export default function FuelCard() {
  return (
    <div className="fuel-card">

      {/* Status */}

      <div className="fuel-status">

        <span className="status">
          Fuel Logged
        </span>

      </div>

      {/* Header */}

      <div className="fuel-title">

        <Truck size={24} />

        <div>

          <h2>Vehicle ID : 12</h2>

          <span>Fleet Fuel Record</span>

        </div>

      </div>

      {/* Details */}

      <div className="fuel-details">

        <div>

          <Route size={18} />

          <span>Trip ID : 105</span>

        </div>

        <div>

          <Droplets size={18} />

          <span>Fuel Filled : 65 Liters</span>

        </div>

        <div>

          <IndianRupee size={18} />

          <span>Cost : ₹6,150</span>

        </div>

        <div>

          <Gauge size={18} />

          <span>Odometer : 24,520 km</span>

        </div>

        <div>

          <Calendar size={18} />

          <span>12 July 2026</span>

        </div>

      </div>

      {/* Footer */}

      <div className="fuel-footer">

        <button className="view-btn">

          <Eye size={18} />

          View

        </button>

        <button className="edit-btn">

          <Pencil size={18} />

          Edit

        </button>

        <button className="delete-btn">

          <Trash2 size={18} />

          Delete

        </button>

      </div>

    </div>
  );
}