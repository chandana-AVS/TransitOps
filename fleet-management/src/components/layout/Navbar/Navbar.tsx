import { MdNotifications, MdSearch, MdKeyboardArrowDown } from "react-icons/md";

import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <h2>Fleet Management</h2>
      </div>

      {/* Center Search */}
      <div className="navbar-search">
        <MdSearch />

        <input type="text" placeholder="Search vehicles, drivers..." />
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <button className="notification">
          <MdNotifications />

          <span>3</span>
        </button>

        <div className="profile">
          <div className="avatar">A</div>

          <div className="profile-info">
            <p>Admin</p>

            <small>Fleet Manager</small>
          </div>

          <MdKeyboardArrowDown />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
