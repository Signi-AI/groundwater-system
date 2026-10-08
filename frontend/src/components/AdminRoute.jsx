import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../services/api";
import { isSuperAdmin } from "../utils/roles";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const token = getToken() || localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let role = "user";
  try {
    role = JSON.parse(localStorage.getItem("user") || "{}")?.role || "user";
  } catch (_) {}

  if (!isSuperAdmin(role)) {
    return <Navigate to="/app/predict" replace />;
  }
  return children;
}