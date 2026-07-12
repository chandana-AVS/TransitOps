import "./CompanySettings.css";

export default function AppearanceSettings() {

  return (

    <div className="settings-card">

      <h2>Appearance</h2>

      <div className="settings-grid">

        <div className="input-group">

          <label>Theme</label>

          <select>

            <option>Light</option>

            <option>Dark</option>

            <option>System</option>

          </select>

        </div>

        <div className="input-group">

          <label>Primary Color</label>

          <input
            type="color"
            defaultValue="#2563eb"
          />

        </div>

      </div>

    </div>

  );

}