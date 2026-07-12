import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

import "./charts.css";

const vehicleStatus = [
  {
    name: "Available",
    value: 18,
  },

  {
    name: "On Trip",
    value: 42,
  },

  {
    name: "Maintenance",
    value: 5,
  },
];

const tripData = [
  {
    name: "Completed",
    trips: 35,
  },

  {
    name: "Pending",
    trips: 7,
  },

  {
    name: "Cancelled",
    trips: 3,
  },
];

const fuelData = [
  {
    month: "Jan",
    efficiency: 8,
  },

  {
    month: "Feb",
    efficiency: 9,
  },

  {
    month: "Mar",
    efficiency: 7,
  },

  {
    month: "Apr",
    efficiency: 10,
  },
];

function Charts() {
  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Vehicle Status</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={vehicleStatus}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
            >
              {vehicleStatus.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Trip Statistics</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tripData}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="trips" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Fuel Efficiency</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={fuelData}>
            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line type="monotone" dataKey="efficiency" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;
