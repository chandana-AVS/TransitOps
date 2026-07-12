import "./CompanySettings.css";

export default function SecuritySettings() {
  return (
    <div className="settings-card">

      <h2>Security Settings</h2>

      <div className="settings-grid">

        <div className="input-group">
          <label>Current Password</label>
          <input type="password" placeholder="********" />
        </div>

        <div className="input-group">
          <label>New Password</label>
          <input type="password" placeholder="********" />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="********" />
        </div>

        <div className="input-group">
          <label>Session Timeout</label>

          <select>
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>Never</option>
          </select>

        </div>

      </div>

    </div>
  );
}