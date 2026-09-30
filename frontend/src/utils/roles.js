export function normalizeRole(role) {
  return String(role || "user").toLowerCase().trim();
}

export function isSuperAdmin(role) {
  return normalizeRole(role) === "super_admin";
}

export function isStaff(role) {
  const r = normalizeRole(role);
  return r === "super_admin" || r === "admin";
}

/** user → /app/predict | super_admin → /admin/users */
export function homePathForRole(role) {
  if (isSuperAdmin(role)) return "/admin/users";
  return "/app/predict";
}

/**
 * Permission helper for admin UI
 */
export function can(role, action) {
  const r = normalizeRole(role);

  const rules = {
    view_admin: ["super_admin", "admin"],
    view_users: ["super_admin", "admin"],
    edit_user: ["super_admin", "admin"],
    delete_user: ["super_admin"],
    change_role: ["super_admin"],
    promote_super_admin: ["super_admin"],
    delete_prediction: ["super_admin"],
    view_settings: ["super_admin"],
    reset_password: ["super_admin", "admin"],
  };

  return (rules[action] || []).includes(r);
}