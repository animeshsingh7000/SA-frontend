import { apiTools } from './apiTools';
import { dispatchMcpTool } from './mcpDispatcher';
import { buildSystemPrompt } from './promptBuilder';
import { mcpChatbotLoop } from './mcpChatbotLoop';
import { useRoleAccess } from '../hooks/useRoleAccess';

// Mock user objects for different roles
const ownerUser = { isOwner: true, isAttache: false, isGuest: false, userRole: 0, email: '', firstName: '', mobile: '', images: [], activeToken: 'token' };
const adminUser = { isOwner: false, isAttache: true, isGuest: false, userRole: 2, email: '', firstName: '', mobile: '', images: [], activeToken: 'token' };
const guestUser = { isOwner: false, isAttache: false, isGuest: true, userRole: 1, email: '', firstName: '', mobile: '', images: [], activeToken: 'token' };
const renterUser = { isOwner: false, isAttache: false, isGuest: false, userRole: 3, email: '', firstName: '', mobile: '', images: [], activeToken: 'token' };

describe('MCP Registry', () => {
  it('should include only GET endpoints and have roles defined', () => {
    for (const tool of apiTools) {
      expect(tool.method).toBe('GET');
      expect(Array.isArray(tool.roles)).toBe(true);
      expect(tool.roles.length).toBeGreaterThan(0);
    }
  });
});

describe('MCP Dispatcher', () => {
  it('should deny access for wrong role', async () => {
    const tool = apiTools.find(t => t.path === '/admin/properties/all');
    if (!tool) throw new Error('Tool not found: /admin/properties/all');
    const { canAccessTool, getAccessError } = useRoleAccess(renterUser);
    const result = await dispatchMcpTool(tool, {}, renterUser, canAccessTool, getAccessError);
    expect(result.type).toBe('access_denied');
  });
  it('should require auth for protected endpoints', async () => {
    const tool = apiTools.find(t => t.path === '/property/list');
    if (!tool) throw new Error('Tool not found: /property/list');
    // Simulate no user
    jest.spyOn(require('../hooks/useAuth'), 'useAuth').mockReturnValue({ user: null });
    const { canAccessTool, getAccessError } = useRoleAccess(null);
    const result = await dispatchMcpTool(tool, {}, null, canAccessTool, getAccessError);
    expect(result.type).toBe('unauthenticated');
  });
});

describe('Prompt Builder', () => {
  it('should generate a prompt with only allowed tools for owner', () => {
    const prompt = buildSystemPrompt({ user: ownerUser, tools: apiTools, version: '1.0.0', changelog: 'test' });
    expect(prompt).toContain('owner');
    expect(prompt).toContain('/property/list');
    expect(prompt).not.toContain('/admin/properties/all');
  });
  it('should generate a prompt with only allowed tools for admin', () => {
    const prompt = buildSystemPrompt({ user: adminUser, tools: apiTools, version: '1.0.0', changelog: 'test' });
    expect(prompt).toContain('admin');
    expect(prompt).toContain('/admin/properties/all');
  });
});

describe('MCP Chatbot Loop', () => {
  it('should return a user-friendly error for forbidden tool call', async () => {
    jest.spyOn(require('../hooks/useAuth'), 'useAuth').mockReturnValue({ user: guestUser });
    const { canAccessTool, getAccessError } = require('../hooks/useRoleAccess').useRoleAccess(guestUser);
    const result = await mcpChatbotLoop({ message: 'Show me admin properties', history: [], user: guestUser, canAccessTool, getAccessError });
    expect(result).toMatch(/Sorry, I couldn't complete your request/);
  });
  it('should return a user-friendly result for allowed tool call', async () => {
    jest.spyOn(require('../hooks/useAuth'), 'useAuth').mockReturnValue({ user: ownerUser });
    const { canAccessTool, getAccessError } = require('../hooks/useRoleAccess').useRoleAccess(ownerUser);
    const result = await mcpChatbotLoop({ message: 'Show me my properties', history: [], user: ownerUser, canAccessTool, getAccessError });
    expect(result).toMatch(/Here are your properties/);
  });
}); 