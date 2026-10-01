import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import History from "./pages/History";
import MapPage from "./pages/MapPage";
import Settings from "./pages/Settings";

import Users from "./pages/admin/Users";
import Predictions from "./pages/admin/Predictions";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Normal user app */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="predict" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="predict" element={<Predict />} />
          <Route path="history" element={<History />} />
          <Route path="map" element={<MapPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Super admin only */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<Users />} />
          <Route path="predictions" element={<Predictions />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}