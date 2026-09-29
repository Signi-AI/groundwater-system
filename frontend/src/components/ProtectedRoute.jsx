import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../services/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}