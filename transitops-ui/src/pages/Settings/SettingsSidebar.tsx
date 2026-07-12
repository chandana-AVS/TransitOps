import "./SettingsSidebar.css";

import {
  Building2,
  Truck,
  Shield,
  Bell,
  Palette,
  DatabaseBackup,
  Info
} from "lucide-react";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function SettingsSidebar({
  activeTab,
  setActiveTab,
}: Props) {

  return (

    <div className="settings-sidebar">

      <h2>TransitOps</h2>

      <button
        className={activeTab === "company" ? "active" : ""}
        onClick={() => setActiveTab("company")}
      >
        <Building2 size={20} />

        Company

      </button>

      <button
        className={activeTab === "fleet" ? "active" : ""}
        onClick={() => setActiveTab("fleet")}
      >
        <Truck size={20} />

        Fleet

      </button>

      <button
        className={activeTab === "security" ? "active" : ""}
        onClick={() => setActiveTab("security")}
      >
        <Shield size={20} />

        Security

      </button>

      <button
        className={activeTab === "notification" ? "active" : ""}
        onClick={() => setActiveTab("notification")}
      >
        <Bell size={20} />

        Notifications

      </button>

      <button
        className={activeTab === "appearance" ? "active" : ""}
        onClick={() => setActiveTab("appearance")}
      >
        <Palette size={20} />

        Appearance

      </button>

      <button
        className={activeTab === "backup" ? "active" : ""}
        onClick={() => setActiveTab("backup")}
      >
        <DatabaseBackup size={20} />

        Backup

      </button>

      <button
        className={activeTab === "about" ? "active" : ""}
        onClick={() => setActiveTab("about")}
      >
        <Info size={20} />

        About

      </button>

    </div>

  );
}