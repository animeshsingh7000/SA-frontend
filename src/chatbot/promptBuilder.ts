import { User } from '../types/User';
import { ApiTool } from './apiTools';

/**
 * Modular system prompt builder for MCP chatbot.
 *
 * Usage:
 *   const prompt = buildSystemPrompt({ user, tools, version, changelog });
 *
 * - Persona, role rules, tool list, examples, privacy, error handling, version, and changelog are all modular.
 * - Version and changelog are injected for auditability.
 */

interface BuildPromptOptions {
  user: User;
  tools: ApiTool[];
  version: string;
  changelog: string;
}

export function buildSystemPrompt({ user, tools, version, changelog }: BuildPromptOptions): string {
  // Persona
  const persona = `You are Stay Attaché's AI assistant. You help users with property, rental, and admin queries, but only within the Stay Attaché context. You never answer questions outside this domain.`;

  // Defensive: If user is null/undefined, treat as guest
  const safeUser = user || {
    isOwner: false,
    isAttache: false,
    isGuest: true,
    userRole: 1,
    email: '',
    firstName: 'Guest',
    lastName: '',
    _id: '',
    image: '',
    Id: '',
    mobile: '',
    images: [],
    activeToken: undefined,
  };

  // Role rules
  const role = safeUser.isOwner ? 'owner' : safeUser.isAttache ? 'admin' : safeUser.isGuest ? 'guest' : 'renter';
  const roleRules = `You are currently assisting a user with the role: ${role}. Only expose and use tools/endpoints permitted for this role. Never attempt actions outside this role's permissions.`;

  // Tool list
  const toolList = tools
    .filter(tool => tool.roles.includes(role as any))
    .map(tool => `- ${tool.path}: ${tool.description} (params: ${[...tool.requiredParams, ...tool.optionalParams].join(', ') || 'none'})`)
    .join('\n');
  const toolSection = `Available tools/endpoints for this user:\n${toolList}`;

  // Examples (can be expanded)
  const examples = `\nExample:\nUser: Show me my properties\nAssistant: [calls /property/list with your role and params]\n\nWhen returning a list of news items, always call the /news/list API and use only the real API data. Never invent or make up news items. If there is no real news data, say 'There are no news or announcements at the moment.'\n- Use a bulleted list ('*' or '-')\n- Make the title bold ('**title**')\n- Italicize the description ('_description_')\n- Show author and date on a new line, separated by '|'`;

  // Privacy and error handling
  const privacy = `Never expose JWT tokens, internal errors, or backend details. All errors must be phrased as user-friendly messages.`;
  const errorHandling = `If an API call fails, return a standard error object: { type, code, message } and phrase the message for the user.`;

  // Version and changelog
  const versionSection = `Prompt version: ${version}\nChangelog: ${changelog}`;

  // Assemble prompt
  return [
    persona,
    roleRules,
    toolSection,
    examples,
    privacy,
    errorHandling,
    versionSection
  ].join('\n\n');
}
