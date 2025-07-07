export const AVAILABLE_PERMISSIONS = [
  {
    value: "dashboard",
    label: "Dashboard",
    description: "Access to dashboard and analytics",
    icon: "BarChart3",
  },
  {
    value: "menu",
    label: "Menu Management",
    description: "Manage menu items and categories",
    icon: "Package",
  },
  {
    value: "category",
    label: "Categories",
    description: "Manage product categories",
    icon: "Tag",
  },
  {
    value: "orders",
    label: "Orders",
    description: "View and manage orders",
    icon: "ClipboardList",
  },
  {
    value: "users",
    label: "User Management",
    description: "Manage user accounts and permissions",
    icon: "Users",
  },
  {
    value: "settings",
    label: "Settings",
    description: "Access to system settings",
    icon: "Settings",
  },
];

export const PATH_PERMISSION_MAP = {
  "/admin/dashboard": "dashboard",
  "/admin/menu": "menu",
  "/admin/category": "category",
  "/admin/orders": "orders",
  "/admin/users": "users",
  "/admin/settings": "settings",
};

export const VALID_ROLES = ["admin", "staff"];

export function hasPermission(user, requiredPermission) {
  if (!user || !requiredPermission) return false;
  if (!VALID_ROLES.includes(user.role)) return false;

  const validPermissions = AVAILABLE_PERMISSIONS.map((p) => p.value);
  if (!validPermissions.includes(requiredPermission)) return false;

  if (user.role === "admin") return true;

  const userPermissions = user.permissions || [];
  return userPermissions.includes(requiredPermission);
}

export function getAvailablePermissions() {
  return AVAILABLE_PERMISSIONS;
}

export function getDefaultPermissions(role) {
  if (!VALID_ROLES.includes(role)) return [];
  if (role === "admin") return AVAILABLE_PERMISSIONS.map((p) => p.value);
  return ["dashboard", "menu", "category", "orders"];
}

export function canAccessPath(user, path) {
  if (!user || !path) return false;
  if (user.role === "admin") return true;

  const requiredPermission = getRequiredPermission(path);
  if (!requiredPermission) return true;

  return hasPermission(user, requiredPermission);
}

export function getRequiredPermission(path) {
  if (!path || typeof path !== "string") return null;

  if (PATH_PERMISSION_MAP[path]) return PATH_PERMISSION_MAP[path];

  for (const [protectedPath, permission] of Object.entries(
    PATH_PERMISSION_MAP
  )) {
    if (path.startsWith(protectedPath)) return permission;
  }

  return null;
}

export function isProtectedAdminPath(path) {
  if (!path || typeof path !== "string") return false;
  return Object.keys(PATH_PERMISSION_MAP).some((protectedPath) =>
    path.startsWith(protectedPath)
  );
}

export function filterNavLinksByPermissions(navLinks, user) {
  if (!Array.isArray(navLinks)) return [];
  if (!user) return navLinks;

  const userRole = user.role;
  const userPermissions = user.permissions || [];

  if (!VALID_ROLES.includes(userRole)) return navLinks;
  if (userRole === "admin") return navLinks;

  return navLinks.filter((link) => {
    if (!link.permission) return true;
    return userPermissions.includes(link.permission);
  });
}

export function validatePermissions(permissions) {
  if (!Array.isArray(permissions)) return false;
  const validPermissions = AVAILABLE_PERMISSIONS.map((p) => p.value);
  return permissions.every((permission) =>
    validPermissions.includes(permission)
  );
}

export function getPermissionDisplayName(permission) {
  if (!permission) return "Unknown Permission";
  const perm = AVAILABLE_PERMISSIONS.find((p) => p.value === permission);
  return perm ? perm.label : permission;
}

export function getPermissionDescription(permission) {
  if (!permission) return "";
  const perm = AVAILABLE_PERMISSIONS.find((p) => p.value === permission);
  return perm ? perm.description : "";
}

export function validateUser(user) {
  if (!user || typeof user !== "object") return false;
  if (!VALID_ROLES.includes(user.role)) return false;
  if (!Array.isArray(user.permissions)) return false;
  return validatePermissions(user.permissions);
}

export function getUserPermissionSummary(user) {
  if (!validateUser(user)) {
    return {
      isValid: false,
      role: user?.role || "unknown",
      permissionCount: 0,
      permissions: [],
      hasAllPermissions: false,
    };
  }

  const permissionCount = user.permissions.length;
  const hasAllPermissions =
    user.permissions.length === AVAILABLE_PERMISSIONS.length;

  return {
    isValid: true,
    role: user.role,
    permissionCount,
    permissions: user.permissions,
    hasAllPermissions,
  };
}
