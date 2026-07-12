import "./recentactivity.css";

const activities = [
  "Trip #102 completed by Van-05",

  "Vehicle Truck-02 added",

  "Oil Change maintenance created",

  "Driver Alex assigned to Trip #110",
];

function RecentActivity() {
  return (
    <div className="activity-card">
      <h3>Recent Activity</h3>

      {activities.map((item, index) => (
        <div className="activity" key={index}>
          <span>●</span>

          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;
