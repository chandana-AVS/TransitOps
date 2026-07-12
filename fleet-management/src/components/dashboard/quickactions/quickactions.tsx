import "./quickactions.css";

function QuickActions() {
  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>

      <div className="action-buttons">
        <button>+ Add Vehicle</button>

        <button>+ Create Trip</button>

        <button>+ Add Driver</button>

        <button>+ Maintenance Log</button>
      </div>
    </div>
  );
}

export default QuickActions;
