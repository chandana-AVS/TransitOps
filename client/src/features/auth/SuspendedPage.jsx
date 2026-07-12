import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Button from "../../components/ui/Button";

export default function SuspendedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="max-w-md mx-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-accent-rose/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-accent-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Suspended</h1>
        <p className="text-surface-400 mb-2">Hi {user?.name}, your driver account has been suspended.</p>
        <p className="text-surface-500 text-sm mb-8">Please contact your Fleet Manager to resolve this. Send an email to request reinstatement.</p>
        <div className="flex gap-3 justify-center">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=fm@transitops.com&su=Suspension%20Reinstatement%20Request&body=Hi%20Fleet%20Manager%2C%0A%0AMy%20driver%20account%20has%20been%20suspended.%20Please%20reinsate%20me.%0A%0AName%3A%20" target="_blank" rel="noopener noreferrer">
            <Button>Contact Fleet Manager</Button>
          </a>
          <Button variant="ghost" onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
