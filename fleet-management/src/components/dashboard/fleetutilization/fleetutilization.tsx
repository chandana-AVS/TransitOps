import { MdDirectionsCar, MdTrendingUp } from "react-icons/md";
import "./fleetutilization.css";

const utilization = {
  percent: 78,
  active: 42,
  total: 54,
  idle: 8,
  maintenance: 4,
};

function FleetUtilization() {
  return (
    <section className="fleet-card" aria-label="Fleet utilization overview">
      <div className="fleet-header">
        <div>
          <p className="section-label">Operations</p>
          <h3>Fleet Utilization</h3>
        </div>

        <div className="fleet-icon">
          <MdDirectionsCar />
        </div>
      </div>

      <div className="utilization-summary">
        <div className="utilization-value">{utilization.percent}%</div>

        <div className="utilization-meta">
          <span className="status-pill">
            <MdTrendingUp /> On track
          </span>
          <p>Active vehicles are operating above the daily target.</p>
        </div>
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={utilization.percent}
      >
        <div
          className="progress-fill"
          style={{ width: `${utilization.percent}%` }}
        />
      </div>

      <div className="fleet-stats">
        <div>
          <strong>{utilization.active}</strong>
          <span>Active</span>
        </div>
        <div>
          <strong>{utilization.idle}</strong>
          <span>Idle</span>
        </div>
        <div>
          <strong>{utilization.maintenance}</strong>
          <span>Maintenance</span>
        </div>
      </div>

      <p className="fleet-footnote">
        {utilization.active} of {utilization.total} vehicles are currently
        active.
      </p>
    </section>
  );
}

export default FleetUtilization;
