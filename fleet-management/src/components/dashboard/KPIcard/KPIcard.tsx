import "./KPIcard.css";
import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
}

function KPICard({ title, value, icon, description }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>

      <div className="kpi-content">
        <p className="kpi-title">{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>
      </div>
    </div>
  );
}

export default KPICard;
