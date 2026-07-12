import "./CompanySettings.css";

export default function NotificationSettings() {

  return (

    <div className="settings-card">

      <h2>Notification Preferences</h2>

      <div className="toggle-group">

        <div className="toggle-item">

          <span>Email Notifications</span>

          <input type="checkbox" defaultChecked />

        </div>

        <div className="toggle-item">

          <span>SMS Notifications</span>

          <input type="checkbox" />

        </div>

        <div className="toggle-item">

          <span>Fuel Alerts</span>

          <input type="checkbox" defaultChecked />

        </div>

        <div className="toggle-item">

          <span>Maintenance Alerts</span>

          <input type="checkbox" defaultChecked />

        </div>

      </div>

    </div>

  );

}