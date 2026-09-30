import { Navigate, useOutletContext } from "react-router-dom";
import { can } from "../../utils/roles";

export default function Settings() {
  const { role } = useOutletContext() || {};

  if (!can(role, "view_settings")) {
    return <Navigate to="/admin/users" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold">Settings</h1>
      <p className="text-sm text-slate-500 mt-1">Super admin only</p>
    </div>
  );
}