import { useAuth } from "../features/auth/AuthProvider";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
