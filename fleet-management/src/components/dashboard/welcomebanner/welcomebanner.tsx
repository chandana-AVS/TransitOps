import { MdDirectionsCar, MdRoute, MdWarning } from "react-icons/md";

import "./welcomebanner.css";

function WelcomeBanner() {
  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        <h2>Good Morning, Admin 👋</h2>

        <p>Here's your fleet performance overview for today.</p>
      </div>

      <div className="summary-items">
        <div className="summary-card">
          <MdDirectionsCar />

          <div>
            <h3>42</h3>
            <p>Active Vehicles</p>
          </div>
        </div>

        <div className="summary-card">
          <MdRoute />

          <div>
            <h3>12</h3>
            <p>Active Trips</p>
          </div>
        </div>

        <div className="summary-card">
          <MdWarning />

          <div>
            <h3>3</h3>
            <p>Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
