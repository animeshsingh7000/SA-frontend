import { ApiTool, apiTools } from './apiTools';

/**
 * Standard error object for MCP dispatcher
 * {
 *   type: string, // e.g., 'access_denied', 'unauthenticated', 'not_found', 'backend_error'
 *   code: string, // e.g., 'ROLE_FORBIDDEN', 'NO_AUTH', 'NOT_FOUND', 'API_ERROR'
 *   message: string
 * }
 */

/**
 * Dispatcher for MCP tool invocations.
 * Validates endpoint, method, role, and auth before making the API call.
 * Never leaks raw backend errors.
 *
 * Usage:
 *   const result = await dispatchMcpTool(tool, params, user, canAccessTool, getAccessError);
 */
export async function dispatchMcpTool(
  tool: ApiTool,
  params: Record<string, any>,
  user: any,
  canAccessTool: (tool: ApiTool) => boolean,
  getAccessError: (tool: ApiTool) => any
): Promise<any> {
  // Validate tool is in registry
  const registryTool = apiTools.find(t => t.path === tool.path && t.method === tool.method);
  if (!registryTool) {
    return {
      type: 'not_found',
      code: 'NOT_FOUND',
      message: 'Requested tool/endpoint is not registered.'
    };
  }

  // Validate method is GET
  if (tool.method !== 'GET') {
    return {
      type: 'access_denied',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only GET endpoints are allowed.'
    };
  }

  // Validate role access
  if (!canAccessTool(tool)) {
    return getAccessError(tool);
  }

  // Validate auth if needed
  if (tool.needsAuth && (!user || !user.activeToken)) {
    return {
      type: 'unauthenticated',
      code: 'NO_AUTH',
      message: 'You must be logged in to access this endpoint.'
    };
  }

  // Build API URL (replace path params)
  let url = tool.path;
  for (const param of tool.requiredParams) {
    if (!(param in params)) {
      return {
        type: 'bad_request',
        code: 'MISSING_PARAM',
        message: `Missing required parameter: ${param}`
      };
    }
    url = url.replace(`{${param}}`, encodeURIComponent(params[param]));
  }

  // Build query string for optional params
  const query: Record<string, any> = {};
  for (const param of tool.optionalParams) {
    if (param in params) {
      query[param] = params[param];
    }
  }

  // Special case: /news/list should always include page=1 and count=1 if not present (for testing)
  if (url === '/news/list') {
    if (!('page' in query)) query.page = 1;
    query.count = 5; // Always set count=1 for testing
  }

  const queryString = Object.keys(query).length
    ? '?' + new URLSearchParams(query as any).toString()
    : '';
  const apiBase = process.env.REACT_APP_API_URL || '/api/v1';

  // Always ensure /api/v1 is present after the base URL
  let base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  let path = url.startsWith('/') ? url.slice(1) : url;
  // Prepend /api/v1 if not already present in base
  if (!base.endsWith('/api/v1')) base += '/api/v1';
  const fullUrl = base + '/' + path + queryString;

  // Make the API call
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (tool.needsAuth && user?.activeToken) {
      headers['Authorization'] = `Bearer ${user.activeToken}`;
    }
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      // Wrap backend error
      return {
        type: 'backend_error',
        code: 'API_ERROR',
        message: `API error: ${response.status} ${response.statusText}`
      };
    }
    const data = await response.json();
    // Always wrap backend data in a standard object
    return { data };
  } catch (err: any) {
    // Never leak raw error
    return {
      type: 'backend_error',
      code: 'API_ERROR',
      message: 'An unexpected error occurred while calling the API.'
    };
  }
} 


