import "./CompanySettings.css";

export default function BackupSettings() {

  return (

    <div className="settings-card">

      <h2>Backup & Restore</h2>

      <p style={{marginBottom:"25px",color:"#64748b"}}>

        Export or restore your fleet management data.

      </p>

      <div style={{display:"flex",gap:"20px"}}>

        <button className="save-btn">
          Export Data
        </button>

        <button className="save-btn">
          Import Data
        </button>

      </div>

    </div>

  );

}