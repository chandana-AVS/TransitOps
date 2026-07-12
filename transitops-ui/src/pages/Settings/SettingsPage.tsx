import { useState } from "react";
import "./SettingsPage.css";

import SettingsSidebar from "./SettingsSidebar.tsx";

import CompanySettings from "./CompanySettings.tsx";
import FleetSettings from "./FleetSettings.tsx";
import SecuritySettings from "./SecuritySettings.tsx";
import NotificationSettings from "./NotificationSettings.tsx";
import AppearanceSettings from "./AppearanceSettings.tsx";
import BackupSettings from "./BackupSettings.tsx";
import AboutSettings from "./AboutSettings.tsx";

import { Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="settings-page">

      {/* Sidebar */}

      <SettingsSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}

      <div className="settings-content">

        {/* Header */}

        <div className="settings-header">

          <div>

            <h1>Settings</h1>

            <p>
              Configure your organization, fleet, security,
              notifications and application preferences.
            </p>

          </div>

          <button className="save-btn">

            <Save size={18} />

            Save Changes

          </button>

        </div>

        {/* Body */}

        <div className="settings-body">

          {activeTab === "company" && <CompanySettings />}

          {activeTab === "fleet" && <FleetSettings />}

          {activeTab === "security" && <SecuritySettings />}

          {activeTab === "notification" && (
            <NotificationSettings />
          )}

          {activeTab === "appearance" && (
            <AppearanceSettings />
          )}

          {activeTab === "backup" && (
            <BackupSettings />
          )}

          {activeTab === "about" && (
            <AboutSettings />
          )}

        </div>

      </div>

    </div>
  );
}