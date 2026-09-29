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

import Overview from "./pages/admin/Overview";
import Users from "./pages/admin/Users";
import Predictions from "./pages/admin/Predictions";
import Regions from "./pages/admin/Regions";
import AdminSettings from "./pages/admin/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User app — needs login */}
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

        {/* Admin console — admin | super_admin only */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="regions" element={<Regions />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}