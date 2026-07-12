import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Navbar from "../components/layout/Navbar/Navbar";

import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="layout">
      <aside className="layout-sidebar">
        <Sidebar />
      </aside>

      <div className="layout-main">
        <header className="layout-navbar">
          <Navbar />
        </header>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
