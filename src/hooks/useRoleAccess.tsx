import { useAuth } from './useAuth';
import { ApiTool } from '../chatbot/apiTools';

/**
 * useRoleAccess - Hook for role-aware access control to MCP tools.
 *
 * Usage:
 *   const { canAccessTool, getAccessError } = useRoleAccess();
 *   if (!canAccessTool(tool)) { ... }
 *
 * Never accesses localStorage directly. Uses useAuth for user and JWT.
 */
export function useRoleAccess(passedUser?: any) {
  const { user: hookUser } = useAuth();
  const user = passedUser || hookUser;

  /**
   * Checks if the current user has access to the given tool/endpoint.
   * @param tool ApiTool registry entry
   * @returns boolean
   */
  function canAccessTool(tool: ApiTool): boolean {
    // If the tool allows 'guest', always allow access (public endpoint)
    if (tool.roles.includes('guest')) return true;
    if (!user) return false;
    // Check if user role is in tool.roles
    // user.userRole may be a string or number; tool.roles is string[]
    // Map user object to role string
    let role: string | undefined = undefined;
    if (user.isOwner) role = 'owner';
    else if (user.isAttache) role = 'admin';
    else if (user.isGuest) role = 'guest';
    else if (user.userRole) role = String(user.userRole).toLowerCase();
    else role = undefined;
    if (!role) return false;
    return tool.roles.includes(role as any);
  }

  /**
   * Returns a standard error object if access is denied, or null if allowed.
   * @param tool ApiTool registry entry
   * @returns { type, code, message } | null
   */
  function getAccessError(tool: ApiTool): { type: string, code: string, message: string } | null {
    if (canAccessTool(tool)) return null;
    return {
      type: 'access_denied',
      code: 'ROLE_FORBIDDEN',
      message: 'You do not have permission to access this tool or endpoint with your current role.'
    };
  }

  return { canAccessTool, getAccessError };
} 