/**
 * Filters out the current user from a list of users
 * Supports both ID and email matching for robust user exclusion
 */
export function filterOutCurrentUser(users, currentUser) {
  if (!users || !Array.isArray(users)) {
    return [];
  }

  // If no current user data, return all users
  if (!currentUser) {
    return users;
  }

  return users.filter((user) => {
    const userId = user._id?.toString();
    const userEmail = user.email?.toLowerCase();

    const currentUserId = currentUser.id?.toString();
    const currentUserEmail = currentUser.email?.toLowerCase();

    // Exclude if user ID matches
    if (currentUserId && userId === currentUserId) {
      return false;
    }

    // Exclude if email matches
    if (currentUserEmail && userEmail === currentUserEmail) {
      return false;
    }

    return true;
  });
}

/**
 * Filters users based on search term and role
 */
export function filterUsers(users, search = "", roleFilter = "all") {
  if (!users || !Array.isArray(users)) {
    return [];
  }

  return users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });
}

/**
 * Calculates user statistics
 */
export function calculateUserStats(users) {
  if (!users || !Array.isArray(users)) {
    return {
      total: 0,
      admins: 0,
      staff: 0,
      active: 0,
      inactive: 0,
    };
  }

  return {
    total: users.length,
    admins: users.filter((user) => user.role === "admin").length,
    staff: users.filter((user) => user.role === "staff").length,
    active: users.filter((user) => user.active !== false).length,
    inactive: users.filter((user) => user.active === false).length,
  };
}
