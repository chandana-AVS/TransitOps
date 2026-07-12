import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const demoAccounts = [
  { label: "Fleet Manager", email: "fm@transitops.com", role: "Full Control", desc: "Oversee fleet, dispatch, & costs" },
  { label: "Driver", email: "driver@transitops.com", role: "Trips & Fuel Logs", desc: "Manage assigned trips & logs" },
  { label: "Safety Officer", email: "safety@transitops.com", role: "Compliance & Safety", desc: "Monitor scores & licenses" },
  { label: "Financial Analyst", email: "finance@transitops.com", role: "Financial Reports", desc: "Review ROI & fuel costs" },
];

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [autoSubmittingRole, setAutoSubmittingRole] = useState(null);

  // Read theme from localStorage or default to Light mode (if no theme is stored)
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return false; // Default to Light mode!
  });

  // Apply class on load and state change
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setAutoSubmittingRole(null);
    }
    setSubmitting(false);
  };

  const handleDemoClick = (account) => {
    if (submitting) return;
    setAutoSubmittingRole(account.label);
    setEmail(account.email);
    setPassword("password123");
    setError("");

    setTimeout(() => {
      setSubmitting(true);
      login(account.email, "password123")
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((err) => {
          setError(err.message || "Failed to sign in as demo user.");
          setAutoSubmittingRole(null);
          setSubmitting(false);
        });
    }, 800);
  };

  return (
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans overflow-hidden transition-colors duration-200 relative ${
      dark ? "bg-surface-950 text-white" : "bg-surface-50 text-surface-900"
    }`}>
      
      {/* THEME TOGGLE: Bulb Switch on top right */}
      <button
        type="button"
        onClick={toggleDark}
        className={`absolute top-6 right-6 z-50 p-2.5 rounded-xl border hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer ${
          dark
            ? "bg-surface-900/80 border-surface-800 text-accent-amber hover:bg-surface-800"
            : "bg-white/80 border-surface-200 text-surface-500 hover:text-primary-600 hover:bg-surface-100"
        }`}
        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {dark ? (
          <svg className="w-5 h-5 fill-accent-amber stroke-accent-amber animate-pulse" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 00-7 7c0 2.03.86 3.86 2.2 5.162A3.001 3.001 0 018 19.5v.5a1 1 0 001 1h6a1 1 0 001-1v-.5a3.001 3.001 0 01.8-2.338A7 7 0 0012 5z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 00-7 7c0 2.03.86 3.86 2.2 5.162A3.001 3.001 0 018 19.5v.5a1 1 0 001 1h6a1 1 0 001-1v-.5a3.001 3.001 0 01.8-2.338A7 7 0 0012 5z" />
          </svg>
        )}
      </button>

      {/* LEFT COLUMN: Visual Product Showcase (Hidden on Mobile) */}
      <div className={`hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 border-r transition-colors duration-200 overflow-hidden select-none ${
        dark 
          ? "bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950 border-surface-800/40 text-white" 
          : "bg-gradient-to-br from-primary-50/50 via-surface-50 to-accent-teal/5 border-surface-200 text-surface-950"
      }`}>
        {/* Animated Mesh Gradients (Only in dark mode) */}
        {dark && (
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "10s" }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-teal/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />
          </>
        )}
        
        {/* Brand/Logo Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-550 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h8m-4-4v4M4 11h16M4 15h16M4 19h16" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">Transit<span className="text-primary-600 dark:text-primary-400 font-extrabold">Ops</span></span>
          </div>
        </div>

        {/* Dynamic Mock Dashboard Preview */}
        <div className="relative z-10 my-auto max-w-lg space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              The Next-Gen Command Center for <span className="bg-gradient-to-r from-primary-600 to-accent-teal dark:from-primary-400 dark:to-accent-teal bg-clip-text text-transparent">Fleet Operations</span>
            </h2>
            <p className={`text-base leading-relaxed ${dark ? "text-surface-400" : "text-surface-600"}`}>
              Consolidate dispatching, maintenance logs, driver compliance, and operational cost analytics into a single responsive platform.
            </p>
          </div>

          {/* Glowing Mock Fleet Stats Panel */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-200 ${
            dark 
              ? "border-white/5 shadow-2xl shadow-black/40 bg-surface-900/30" 
              : "border-surface-200 shadow-xl shadow-surface-200/50 bg-white/60"
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${dark ? "border-surface-800" : "border-surface-200"}`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
                <span className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-surface-300" : "text-surface-700"}`}>Live System Metrics</span>
              </div>
              <span className={`text-[10px] font-mono ${dark ? "text-surface-500" : "text-surface-400"}`}>ID: TO-90412</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3.5 rounded-xl border transition-all duration-300 group ${
                dark ? "bg-surface-900/60 border-surface-800/50 hover:border-primary-500/30" : "bg-white border-surface-150 hover:border-primary-400/40 hover:shadow-sm"
              }`}>
                <p className={`text-[10px] uppercase font-medium ${dark ? "text-surface-400" : "text-surface-500"}`}>Fleet Utilization</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold group-hover:text-primary-500 transition-colors">94.2%</span>
                  <span className="text-[10px] text-accent-emerald font-medium">↑ 2.1%</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border transition-all duration-300 group ${
                dark ? "bg-surface-900/60 border-surface-800/50 hover:border-primary-500/30" : "bg-white border-surface-150 hover:border-primary-400/40 hover:shadow-sm"
              }`}>
                <p className={`text-[10px] uppercase font-medium ${dark ? "text-surface-400" : "text-surface-500"}`}>Active Deliveries</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold group-hover:text-primary-500 transition-colors">86</span>
                  <span className="text-[10px] text-primary-500 font-medium">12 Pending</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border transition-all duration-300 group ${
                dark ? "bg-surface-900/60 border-surface-800/50 hover:border-primary-500/30" : "bg-white border-surface-150 hover:border-primary-400/40 hover:shadow-sm"
              }`}>
                <p className={`text-[10px] uppercase font-medium ${dark ? "text-surface-400" : "text-surface-500"}`}>Avg Fuel Efficiency</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold group-hover:text-primary-500 transition-colors">14.8 km/L</span>
                  <span className="text-[10px] text-accent-teal font-medium">Optimal</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border transition-all duration-300 group ${
                dark ? "bg-surface-900/60 border-surface-800/50 hover:border-primary-500/30" : "bg-white border-surface-150 hover:border-primary-400/40 hover:shadow-sm"
              }`}>
                <p className={`text-[10px] uppercase font-medium ${dark ? "text-surface-400" : "text-surface-500"}`}>Vehicles In Shop</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold group-hover:text-primary-500 transition-colors">3</span>
                  <span className="text-[10px] text-accent-amber font-medium">Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column Footer Info */}
        <div className={`relative z-10 flex items-center justify-between text-xs ${dark ? "text-surface-500" : "text-surface-400"}`}>
          <span>© 2026 TransitOps Enterprise</span>
          <div className="flex gap-4">
            <span className="hover:text-primary-500 cursor-pointer transition-colors">Security Protocol</span>
            <span className="hover:text-primary-500 cursor-pointer transition-colors">Compliance API</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Glassmorphic Authentication Portal */}
      <div className={`lg:col-span-5 flex flex-col justify-center px-6 py-12 md:px-16 xl:px-24 relative overflow-y-auto transition-colors duration-200 ${
        dark ? "bg-surface-950" : "bg-white"
      }`}>
        {/* Background Accent for Mobile/Tablet */}
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] lg:hidden ${
          dark ? "from-primary-900/10 via-surface-950 to-surface-950" : "from-primary-100/30 via-white to-white"
        }`} />

        <div className="relative z-10 w-full max-w-md mx-auto space-y-8">
          
          {/* Mobile Brand Header */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-550 flex items-center justify-center shadow-lg shadow-primary-500/25 mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h8m-4-4v4M4 11h16M4 15h16M4 19h16" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">TransitOps</h1>
            <p className={`text-xs mt-1 ${dark ? "text-surface-400" : "text-surface-500"}`}>Smart Transport Operations Platform</p>
          </div>

          {/* Desktop Heading */}
          <div className="hidden lg:block space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
            <p className={`text-sm ${dark ? "text-surface-400" : "text-surface-500"}`}>Access your dashboard with your operational credentials.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 bg-accent-rose/10 border border-accent-rose/20 text-accent-rose px-4 py-3.5 rounded-xl text-sm animate-scale-in">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="text-xs text-accent-rose/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold uppercase tracking-wider ${dark ? "text-surface-400" : "text-surface-500"}`}>Email Address</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  disabled={submitting}
                  className={`w-full pl-11 pr-4 py-3 border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl placeholder-surface-400 focus:outline-none transition-all text-sm font-medium ${
                    dark 
                      ? "bg-surface-900/60 border-surface-850 text-white" 
                      : "bg-surface-50 border-surface-200 text-surface-900"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${dark ? "text-surface-400" : "text-surface-500"}`}>Password</label>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=fm@transitops.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:text-primary-600 hover:underline transition-colors font-medium">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={submitting}
                  className={`w-full pl-11 pr-11 py-3 border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl placeholder-surface-400 focus:outline-none transition-all text-sm font-medium ${
                    dark 
                      ? "bg-surface-900/60 border-surface-850 text-white" 
                      : "bg-surface-50 border-surface-200 text-surface-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-450 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/15 hover:shadow-primary-500/30 active:scale-[0.98] text-sm relative overflow-hidden cursor-pointer"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {autoSubmittingRole ? `Accessing as ${autoSubmittingRole}...` : "Verifying System credentials..."}
                </span>
              ) : (
                "Sign In to Control Center"
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative py-2">
            <div className={`absolute inset-0 flex items-center ${dark ? "border-surface-850" : "border-surface-200"}`}><div className="w-full border-t border-inherit" /></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className={`px-3 font-semibold ${dark ? "bg-surface-950 text-surface-500" : "bg-white text-surface-450"}`}>
                Quick Demo Access
              </span>
            </div>
          </div>

          {/* Demo Accounts List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoAccounts.map((acct) => (
              <button
                key={acct.email}
                type="button"
                onClick={() => handleDemoClick(acct)}
                disabled={submitting}
                className={`flex flex-col items-start p-3.5 rounded-xl border hover:border-primary-500/40 hover:bg-primary-500/5 transition-all text-left group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  dark 
                    ? "bg-surface-900/40 border-surface-850 text-white" 
                    : "bg-surface-50/50 border-surface-200 text-surface-900"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold transition-colors ${dark ? "text-surface-200 group-hover:text-primary-300" : "text-surface-800 group-hover:text-primary-600"}`}>{acct.label}</span>
                  <span className="text-[9px] uppercase font-bold text-primary-600 dark:text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-md">{acct.role}</span>
                </div>
                <span className={`text-[10px] mt-1 leading-snug ${dark ? "text-surface-500" : "text-surface-450"}`}>{acct.desc}</span>
              </button>
            ))}
          </div>

          {/* Footer for Mobile */}
          <p className={`text-center text-[10px] pt-4 lg:hidden ${dark ? "text-surface-600" : "text-surface-400"}`}>
            © 2026 TransitOps · Built for Odoo Hackathon
          </p>
          
        </div>
      </div>

    </div>
  );
}
