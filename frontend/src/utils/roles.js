export function normalizeRole(role) {
  return String(role || "user").toLowerCase().trim();
}

export function isSuperAdmin(role) {
  return normalizeRole(role) === "super_admin";
}

export function homePathForRole(role) {
  if (isSuperAdmin(role)) return "/admin/users";
  return "/app/predict";
}
