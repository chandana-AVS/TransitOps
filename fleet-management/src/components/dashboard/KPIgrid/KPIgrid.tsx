import {
  MdDirectionsCar,
  MdCheckCircle,
  MdBuild,
  MdRoute,
  MdPendingActions,
  MdPeople,
  MdSpeed,
} from "react-icons/md";

import KPICard from "../KPIcard/KPIcard";

import "./KPIGrid.css";

const kpis = [
  {
    title: "Active Vehicles",
    value: 42,
    description: "Currently operating",
    icon: <MdDirectionsCar />,
  },

  {
    title: "Available Vehicles",
    value: 18,
    description: "Ready for dispatch",
    icon: <MdCheckCircle />,
  },

  {
    title: "In Maintenance",
    value: 5,
    description: "Vehicles in shop",
    icon: <MdBuild />,
  },

  {
    title: "Active Trips",
    value: 12,
    description: "Currently running",
    icon: <MdRoute />,
  },

  {
    title: "Pending Trips",
    value: 7,
    description: "Awaiting dispatch",
    icon: <MdPendingActions />,
  },

  {
    title: "Drivers On Duty",
    value: 25,
    description: "Currently assigned",
    icon: <MdPeople />,
  },

  {
    title: "Fleet Utilization",
    value: "78%",
    description: "Vehicle efficiency",
    icon: <MdSpeed />,
  },
];

function KPIGrid() {
  return (
    <div className="kpi-grid">
      {kpis.map((item, index) => (
        <KPICard key={index} {...item} />
      ))}
    </div>
  );
}

export default KPIGrid;
