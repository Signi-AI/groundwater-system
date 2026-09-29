export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
};

export function normalizeRole(role) {
  return String(role || "user").toLowerCase().trim();
}

export function hasRole(userRole, allowed = []) {
  const r = normalizeRole(userRole);
  const list = (Array.isArray(allowed) ? allowed : [allowed]).map(normalizeRole);
  return list.includes(r);
}

export function isStaff(role) {
  return hasRole(role, [ROLES.SUPER_ADMIN, ROLES.ADMIN]);
}

export function isSuperAdmin(role) {
  return hasRole(role, ROLES.SUPER_ADMIN);
}

export function homePathForRole(role) {
  if (isStaff(role)) return "/admin/overview";
  return "/app/predict";
}

export function can(role, action) {
  const r = normalizeRole(role);
  const map = {
    view_admin: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    view_users: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit_user: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete_user: [ROLES.SUPER_ADMIN],
    change_role: [ROLES.SUPER_ADMIN],
    promote_super_admin: [ROLES.SUPER_ADMIN],
    delete_prediction: [ROLES.SUPER_ADMIN],
    view_settings: [ROLES.SUPER_ADMIN],
    reset_password: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  };
  return (map[action] || []).includes(r);
}