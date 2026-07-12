import "./LeftPanel.css";

import {
  Truck,
  BarChart3,
  ShieldCheck,
  MapPinned,
  ArrowRight
} from "lucide-react";

export default function LeftPanel() {
  return (
    <div className="left-section">

      <div className="left-content">

        <span className="badge">
          Enterprise Fleet Platform
        </span>

        <h1>
          Smart Fleet
          <br />
          Management
        </h1>

        <p>
          TransitOps helps logistics companies manage
          vehicles, drivers, trips, fuel, maintenance,
          expenses and analytics from one intelligent
          enterprise platform.
        </p>

        <div className="feature-grid">

          <div className="feature-card">

            <Truck size={34} />

            <h3>Fleet Tracking</h3>

            <span>
              Monitor every vehicle
              in real time.
            </span>

          </div>

          <div className="feature-card">

            <BarChart3 size={34} />

            <h3>Analytics</h3>

            <span>
              Intelligent dashboards
              and KPIs.
            </span>

          </div>

          <div className="feature-card">

            <ShieldCheck size={34} />

            <h3>Security</h3>

            <span>
              Enterprise authentication
              & RBAC.
            </span>

          </div>

          <div className="feature-card">

            <MapPinned size={34} />

            <h3>Live Trips</h3>

            <span>
              Track deliveries
              in real time.
            </span>

          </div>

        </div>

        <div className="stats">

          <div>

            <h2>1,250+</h2>

            <span>Vehicles</span>

          </div>

          <div>

            <h2>840+</h2>

            <span>Drivers</span>

          </div>

          <div>

            <h2>23K</h2>

            <span>Trips</span>

          </div>

        </div>

        <button className="learn-btn">

          Explore Platform

          <ArrowRight size={18}/>

        </button>

      </div>

    </div>
  );
}