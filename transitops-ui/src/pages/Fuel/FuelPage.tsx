import { useState } from "react";
import "./FuelPage.css";
import FuelCard from "./FuelCard";
import AddFuelModal from "./AddFuelModal";

import {
  Search,
  Plus,
  Fuel,
  IndianRupee,
  Droplets,
  Gauge,
} from "lucide-react";

export default function FuelPage() {

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="fuel-page">

      {/* Header */}

      <div className="fuel-header">

        <div>
          <h1>Fuel Logs</h1>

          <p>
            Monitor fuel consumption and expenses across your fleet.
          </p>
        </div>

        <button
          className="add-fuel-btn"
          onClick={() => setOpenModal(true)}
        >
          <Plus size={20} />
          Add Fuel Log
        </button>

      </div>

      {/* Search */}

      <div className="search-section">

        <div className="search-box">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search by Vehicle ID or Trip ID..."
          />

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <Fuel size={30} />

          <h2>245</h2>

          <span>Total Fuel Logs</span>

        </div>

        <div className="stat-card">

          <Droplets size={30} />

          <h2>12,580 L</h2>

          <span>Total Fuel Filled</span>

        </div>

        <div className="stat-card">

          <IndianRupee size={30} />

          <h2>₹8.65 L</h2>

          <span>Total Fuel Cost</span>

        </div>

        <div className="stat-card">

          <Gauge size={30} />

          <h2>₹95.20/L</h2>

          <span>Average Cost / Liter</span>

        </div>

      </div>

      {/* Fuel Cards */}

      <div className="fuel-grid">

        <FuelCard />
        <FuelCard />
        <FuelCard />
        <FuelCard />

      </div>

      {/* Add Fuel Modal */}

      <AddFuelModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

    </div>
  );
}