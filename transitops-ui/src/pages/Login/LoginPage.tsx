import "./LoginPage.css";
import LeftPanel from "./LeftPanel";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="login-page">

      {/* Animated Background */}
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      {/* Left Section */}
      <LeftPanel />

      {/* Right Section */}
      <div className="right-section">
        <LoginForm />
      </div>

    </div>
  );
}