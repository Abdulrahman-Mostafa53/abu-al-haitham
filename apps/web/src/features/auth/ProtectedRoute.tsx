import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context";

export default function ProtectedRoute() {
  const { role } = useAuth();
  return role ? <Outlet /> : <Navigate to="/login" replace />;
}
