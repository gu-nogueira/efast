import roles from '../config/roles';

export default function checkUserRole(userRole, requiredRole) {
  const findUserRole = roles.find((role) => role.name === userRole);
  if (!findUserRole) {
    return false;
  }

  if (requiredRole && userRole.toLowerCase() !== requiredRole.toLowerCase()) {
    return false;
  }

  return true;
}
