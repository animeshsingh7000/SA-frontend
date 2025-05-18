import { buildSystemPrompt } from './promptBuilder';
import { apiTools, ApiTool } from './apiTools';
import { dispatchMcpTool } from './mcpDispatcher';

/**
 * Utility to sanitize messages for Openrouter API
 */
function sanitizeMessages(messages: any[]) {
  return messages
    .filter(msg => typeof msg.content === 'string')
    .map(msg => ({ ...msg, content: msg.content }));
}

/**
 * Real LLM call using Openrouter API
 * Expects: { prompt, message, history }
 * Returns: { response, toolCall?: { tool: ApiTool, params: Record<string, any> } }
 */
async function callLLM({ prompt, message, history }: { prompt: string, message: string, history: any[] }) {
  // Compose messages for Openrouter
  const completeMessages = [
    { role: 'system', content: prompt },
    ...history.map((msg: any) => ({ role: msg.role || (msg.type === 'user' ? 'user' : 'assistant'), content: msg.content || msg.message }))
  ];
  completeMessages.push({ role: 'user', content: message });

  // DEBUG: Log the API key to verify it's loaded
  // REMOVE this after debugging!
  // eslint-disable-next-line no-console
  console.log('REACT_APP_OPENROUTER_API_KEY:', process.env.REACT_APP_OPENROUTER_API_KEY);

  try {
    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.REACT_APP_SITE_URL || 'https://stayattache.com',
        'X-Title': process.env.REACT_APP_SITE_NAME || 'Stay Attache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: sanitizeMessages(completeMessages),
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { response: `Sorry, there was a problem: ${errorData.error?.message || 'Error connecting to OpenRouter'}` };
    }
    const data = await response.json();
    let botReply = "Sorry, I didn't get a valid response from the AI service.";
    if (
      data &&
      Array.isArray(data.choices) &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      botReply = data.choices[0].message.content;
    }
    // TODO: Parse tool call intent from botReply if needed
    return { response: botReply };
  } catch (err: any) {
    return { response: `Sorry, there was a problem: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}

// Helper to strip HTML tags
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * MCP Chatbot Loop Handler
 *
 * Usage:
 *   const result = await mcpChatbotLoop({ message, history, user, canAccessTool, getAccessError });
 *
 * - Builds the system prompt for the current user.
 * - Sends prompt, message, and history to the LLM.
 * - Handles tool calls via dispatcher, returns results/errors for LLM phrasing.
 * - Only GET endpoints are ever called; all errors/results are LLM-phrased.
 */
export async function mcpChatbotLoop({
  message,
  history,
  user,
  canAccessTool,
  getAccessError,
}: {
  message: string,
  history: any[],
  user: any,
  canAccessTool: (tool: ApiTool) => boolean,
  getAccessError: (tool: ApiTool) => any,
}): Promise<string> {
  const version = '1.0.0';
  const changelog = 'Initial modular prompt with persona, role, tools, and error handling.';
  const prompt = buildSystemPrompt({ user, tools: apiTools, version, changelog });

  // Helper to summarize news content
  async function summarize(content: string) {
    const prompt = `Summarize the following news content in 2 sentences for a user who wants the crux of the news:\n\n${content}`;
    const result = await callLLM({ prompt, message: '', history: [] });
    if (result && result.response) return result.response.trim();
    const match = content.match(/([^.!?]*[.!?]){1,2}/);
    return match ? match[0] : content.slice(0, 200);
  }

  // Helper to get base URL for links
  function getBaseUrl() {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return process.env.REACT_APP_SITE_URL || window.location.origin;
    }
    return process.env.REACT_APP_SITE_URL || 'https://stayattache.com';
  }

  // Helper: Extract property filters from a message using LLM
  async function extractPropertyFilters(message: string, prevFilters: Record<string, any> = {}) {
    // Compose a prompt for the LLM to extract property filters
    const filterPrompt = `A user is searching for properties. Here is their request: "${message}"
Extract any filters (like bedrooms, location, amenities, price, parking, etc.) as a JSON object. Merge with these previous filters: ${JSON.stringify(prevFilters)}. Only include filters that are relevant to property search. If none, return an empty object.`;
    const result = await callLLM({ prompt: filterPrompt, message: '', history: [] });
    try {
      const match = result.response.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch {}
    return prevFilters;
  }

  // Helper: Check if last bot message was a property search or refinement prompt
  function isLastBotPropertySearch(history: any[]) {
    if (!history || !history.length) return false;
    const lastBot = [...history].reverse().find(msg => (msg.role === 'assistant' || msg.type === 'bot'));
    if (!lastBot) return false;
    return (
      (typeof lastBot.content === 'string' && lastBot.content.includes('Here are the properties I found')) ||
      (typeof lastBot.content === 'string' && lastBot.content.toLowerCase().includes('would you like to refine'))
    );
  }

  // Helper: Check if property refinement mode is active in history
  function isPropertyRefinementMode(history: any[]) {
    if (!history || !history.length) return false;
    const lastModeMsg = [...history].reverse().find(msg => msg.type === 'property_refinement_mode');
    return lastModeMsg ? !!lastModeMsg.value : false;
  }

  // Property keywords for intent detection
  const propertyKeywords = [
    'property', 'properties', 'listings', 'show me properties', 'available properties', 'my properties', 'property list', 'property listing', 'find properties', 'browse properties', 'rental properties', 'show properties', 'property for rent', 'property to rent', 'property details', 'property info', 'property information'
  ];

  // Add property tool matcher
  const toolMatchers = [
    { keywords: ['news', 'update', 'announcement'], path: '/news/list', format: async (data: any) => {
      if (data && Array.isArray(data.newsList)) {
        const news = data.newsList;
        if (news.length === 0) return 'There are no news or announcements at the moment, but check back soon!';
        const baseUrl = getBaseUrl();
        const items = await Promise.all(news.map(async (item: any) => {
          const desc = item.excerpt || (item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 150) : '');
          const author = item.createdBy || 'Unknown';
          const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';
          const details = item.content ? await summarize(stripHtml(item.content)) : desc;
          const slug = item.slug || '';
          const viewUrl = slug ? `${baseUrl}/blog/${slug}` : '';
          return `* **${item.title}**  \n  _${desc}_  \n  Author: ${author} | Date: ${date}\n  **Details:** ${details}${viewUrl ? `\n  [View](${viewUrl})` : ''}`;
        }));
        return `Here are the latest news updates:\n\n${items.join('\n\n')}`;
      }
      return 'Sorry, I was unable to retrieve news at this time. Please try again later.';
    } },
    { keywords: ['faq', 'help', 'question', 'support'], path: '/faq/list', format: (data: any) => {
      if (data && Array.isArray(data)) {
        if (data.length === 0) return 'I couldn\'t find any FAQs at the moment. Please try again later or ask your question directly!';
        const faqListMarkdown = data.map((item: any) => `**Q: ${stripHtml(item.question)}**\nA: ${stripHtml(item.answer)}`).join('\n\n');
        return `**Here are some frequently asked questions:**\n\n${faqListMarkdown}`;
      }
      return 'Sorry, I was unable to retrieve FAQs at this time. Please try again later.';
    } },
    // Property matcher
    { keywords: propertyKeywords, path: '/property/list', format: async (data: any) => {
      if (data && Array.isArray(data)) {
        if (data.length === 0) return 'No properties found at the moment. Please try again later or adjust your search.';
        const baseUrl = getBaseUrl();
        const items = data.map((item: any) => {
          const title = item.title || 'Untitled Property';
          const address = item.address || '';
          const price = item.price ? `$${item.price}` : '';
          const id = item.id || item._id || '';
          const viewUrl = id ? `${baseUrl}/property-detail/${id}` : '';
          return `* **${title}**${address ? `\n  _${address}_` : ''}${price ? `\n  Price: ${price}` : ''}${viewUrl ? `\n  [View](${viewUrl})` : ''}`;
        });
        return `Here are the properties I found:\n\n${items.join('\n\n')}`;
      }
      return 'Sorry, I was unable to retrieve properties at this time. Please try again later.';
    } },
  ];

  // Send to LLM
  const llmResult = await callLLM({ prompt, message, history });

  // Intercept and ignore any LLM-generated API/tool JSON or Markdown for any tool
  const isJsonApiResult = (resp: string) => {
    const lower = resp.trim().toLowerCase();
    // Add more keys as you add more tools (e.g., 'faq', 'properties', etc.)
    const apiKeys = ['news', 'faq', 'properties', 'property', 'title', 'description', 'question', 'answer', 'author', 'date'];
    return (
      lower.startsWith('json {') ||
      lower.startsWith('{') ||
      lower.startsWith('[{')
    ) && apiKeys.some(k => lower.includes(k));
  };
  if (llmResult && llmResult.response && isJsonApiResult(llmResult.response)) {
    // Try to infer which tool to call based on the user's message
    // For now, default to news if news keywords, faq if faq keywords, etc.
    const lowerMessage = (message || '').toLowerCase();
    for (const matcher of toolMatchers) {
      if (matcher.keywords.some(k => lowerMessage.includes(k))) {
        const tool = apiTools.find(t => t.path === matcher.path);
        if (tool) {
          if (!canAccessTool(tool)) {
            return getAccessError(tool)?.message || 'Sorry, you do not have access to this information.';
          }
          const apiResult = await dispatchMcpTool(tool, {}, user, canAccessTool, getAccessError);
          // News: apiResult.data.data.newsList, FAQ: apiResult.data.data, Property: apiResult.data.data
          if (matcher.path === '/news/list' && apiResult.data && apiResult.data.data && Array.isArray(apiResult.data.data.newsList)) {
            return matcher.format(apiResult.data.data);
          }
          if (matcher.path === '/faq/list' && apiResult.data && Array.isArray(apiResult.data.data)) {
            return matcher.format(apiResult.data.data);
          }
          if (matcher.path === '/property/list' && apiResult.data && Array.isArray(apiResult.data.data)) {
            return await matcher.format(apiResult.data.data);
          }
        }
      }
    }
    // If no matcher, just return a generic error
    return "Sorry, I couldn't complete your request. Please try again or ask something else!";
  }

  // FAQ check: always prioritize FAQ if a relevant answer exists
  const faqTool = apiTools.find(t => t.path === '/faq/list');
  if (faqTool) {
    const apiResult = await dispatchMcpTool(faqTool, {}, user, canAccessTool, getAccessError);
    if (apiResult.data && Array.isArray(apiResult.data.data)) {
      const faqs = apiResult.data.data;
      if (faqs.length > 0) {
        const faqListMarkdown = faqs.map((item: any) => `**Q: ${stripHtml(item.question)}**\nA: ${stripHtml(item.answer)}`).join('\n\n');
        const faqPrompt = `A user asked: "${message}"
\nHere is the full FAQ list:\n\n${faqListMarkdown}\n\nIf there is an FAQ that directly and clearly answers the user's question, return it in the same format above. If none are truly relevant, reply with 'no FAQ'. Do not return loosely related or partially matching FAQs.`;
        const llmFaqResult = await callLLM({ prompt: faqPrompt, message: '', history: [] });
        if (llmFaqResult.response && llmFaqResult.response.trim().toLowerCase() !== 'no faq') {
          return `**Here's what I found in our FAQ section**\n\n${llmFaqResult.response}`;
        }
      }
    }
  }

  // Always call the real news API if the user's message is a news request
  const lowerMessage = (message || '').toLowerCase();
  const newsKeywords = [
    'news',
    '/news/list',
    'latest news',
    'updates',
    'company updates',
    'recent updates',
    'announcements',
    "what's new",
    'any news',
    'recent news',
    'new updates',
    'latest updates',
    'recent announcement',
    'company news',
    'property news',
  ];
  if (newsKeywords.some(k => lowerMessage.includes(k))) {
    const newsTool = apiTools.find(t => t.path === '/news/list');
    if (newsTool) {
      const apiResult = await dispatchMcpTool(newsTool, {}, user, canAccessTool, getAccessError);
      if (apiResult.data && apiResult.data.data && Array.isArray(apiResult.data.data.newsList)) {
        const news = apiResult.data.data.newsList;
        if (news.length === 0) return 'There are no news or announcements at the moment, but check back soon!';
        const baseUrl = getBaseUrl();
        const items = await Promise.all(news.map(async (item: any) => {
          const desc = item.excerpt || (item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 150) : '');
          const author = item.createdBy || 'Unknown';
          const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';
          const details = item.content ? await summarize(stripHtml(item.content)) : desc;
          const slug = item.slug || '';
          const viewUrl = slug ? `${baseUrl}/blog/${slug}` : '';
          return `* **${item.title}**  \n  _${desc}_  \n  Author: ${author} | Date: ${date}\n  **Details:** ${details}${viewUrl ? `\n  [View](${viewUrl})` : ''}`;
        }));
        return `Here are the latest news updates:\n\n${items.join('\n\n')}`;
      }
      return 'Sorry, I was unable to retrieve news at this time. Please try again later.';
    }
  }

  // Check if property refinement mode is active
  let inPropertyRefinementMode = isPropertyRefinementMode(history);

  // Context-aware property search refinement with refinement mode flag
  if (isLastBotPropertySearch(history) || inPropertyRefinementMode) {
    // Get previous filters from history (if any)
    let prevFilters = {};
    const lastFiltersMsg = [...history].reverse().find(msg => msg.type === 'property_filters');
    if (lastFiltersMsg && lastFiltersMsg.filters) prevFilters = lastFiltersMsg.filters;
    // If user says 'no', exit refinement mode
    if (['no', 'nope', 'nah', 'not now'].some(n => lowerMessage.trim() === n)) {
      history.push({ type: 'property_refinement_mode', value: false });
      return "Okay, let me know if you'd like to search for properties again or need help with something else!";
    }
    // If user says 'yes', prompt for more filters
    if (['yes', 'yeah', 'yep', 'sure', 'ok'].some(y => lowerMessage.trim() === y)) {
      history.push({ type: 'property_refinement_mode', value: true });
      return "Great! What additional filters or preferences would you like to add? (e.g., parking, pet friendly, price range, etc.)";
    }
    // Otherwise, try to extract new filters and merge, then immediately fetch and return results
    const newFilters = await extractPropertyFilters(message, prevFilters);
    history.push({ type: 'property_filters', filters: newFilters });
    history.push({ type: 'property_refinement_mode', value: true });
    // Call property tool with merged filters and return results in the same response
    const propertyTool = apiTools.find(t => t.path === '/property/list');
    if (propertyTool) {
      if (!canAccessTool(propertyTool)) {
        return getAccessError(propertyTool)?.message || 'Sorry, you do not have access to this information.';
      }
      const apiResult = await dispatchMcpTool(propertyTool, newFilters, user, canAccessTool, getAccessError);
      if (apiResult.data && Array.isArray(apiResult.data.data)) {
        const baseUrl = getBaseUrl();
        const items = apiResult.data.data.map((item: any) => {
          const title = item.title || 'Untitled Property';
          const address = item.address || '';
          const price = item.price ? `$${item.price}` : '';
          const id = item.id || item._id || '';
          const viewUrl = id ? `${baseUrl}/property-detail/${id}` : '';
          return `* **${title}**${address ? `\n  _${address}_` : ''}${price ? `\n  Price: ${price}` : ''}${viewUrl ? `\n  [View](${viewUrl})` : ''}`;
        });
        if (items.length === 0) return 'No properties found with those filters. Would you like to try different filters? (yes/no)';
        return `Here are the properties I found:\n\n${items.join('\n\n')}\n\nWould you like to refine these results with more filters? (yes/no)`;
      }
      return 'Sorry, I was unable to retrieve properties at this time. Please try again later.';
    }
  }

  // Always call the real property API if the user's message is a property request
  if (propertyKeywords.some(k => lowerMessage.includes(k))) {
    // Extract filters from the message
    const filters = await extractPropertyFilters(message);
    history.push({ type: 'property_filters', filters });
    history.push({ type: 'property_refinement_mode', value: true });
    const propertyTool = apiTools.find(t => t.path === '/property/list');
    if (propertyTool) {
      if (!canAccessTool(propertyTool)) {
        return getAccessError(propertyTool)?.message || 'Sorry, you do not have access to this information.';
      }
      const apiResult = await dispatchMcpTool(propertyTool, filters, user, canAccessTool, getAccessError);
      if (apiResult.data && Array.isArray(apiResult.data.data)) {
        const baseUrl = getBaseUrl();
        const items = apiResult.data.data.map((item: any) => {
          const title = item.title || 'Untitled Property';
          const address = item.address || '';
          const price = item.price ? `$${item.price}` : '';
          const id = item.id || item._id || '';
          const viewUrl = id ? `${baseUrl}/property-detail/${id}` : '';
          return `* **${title}**${address ? `\n  _${address}_` : ''}${price ? `\n  Price: ${price}` : ''}${viewUrl ? `\n  [View](${viewUrl})` : ''}`;
        });
        if (items.length === 0) return 'No properties found with those filters. Would you like to try different filters? (yes/no)';
        return `Here are the properties I found:\n\n${items.join('\n\n')}\n\nWould you like to refine these results with more filters? (yes/no)`;
      }
      return 'Sorry, I was unable to retrieve properties at this time. Please try again later.';
    }
  }

  // FAQ intent detection (no confirmation)
  const faqKeywords = ['faq', 'help', 'question', 'support', 'how do i', 'how to', 'frequently asked'];
  const isFaqIntent = faqKeywords.some(k => lowerMessage.includes(k));
  if (isFaqIntent) {
    const faqTool = apiTools.find(t => t.path === '/faq/list');
    if (faqTool) {
      const apiResult = await dispatchMcpTool(faqTool, {}, user, canAccessTool, getAccessError);
      if (apiResult.data && Array.isArray(apiResult.data.data)) {
        const faqs = apiResult.data.data;
        if (faqs.length === 0) return 'I couldn\'t find any FAQs at the moment. Please try again later or ask your question directly!';
        const faqListMarkdown = faqs.map((item: any) => `**Q: ${stripHtml(item.question)}**\nA: ${stripHtml(item.answer)}`).join('\n\n');
        const faqPrompt = `A user asked: "${message}"
\nHere is the full FAQ list:\n\n${faqListMarkdown}\n\nIf there is an FAQ that directly and clearly answers the user's question, return it in the same format above. If none are truly relevant, reply with 'no FAQ'. Do not return loosely related or partially matching FAQs.`;
        const llmFaqResult = await callLLM({ prompt: faqPrompt, message: '', history: [] });
        if (llmFaqResult.response && llmFaqResult.response.trim().toLowerCase() !== 'no faq') {
          return `**Here's what I found in our FAQ section**\n\n${llmFaqResult.response}`;
        } else {
          return 'Sorry, I was unable to retrieve FAQs at this time. Please try again later.';
        }
      }
      return `FAQ data: ${JSON.stringify(apiResult)}`;
    }
  }

  // If in property refinement mode, skip FAQ/tool checks
  if (inPropertyRefinementMode) {
    // Only handle property refinement, do not check FAQ/tools
    return '';
  }

  // Otherwise, return LLM's response
  return llmResult.response || "I'm here to help with Stay Attaché questions. How can I assist you today?";
}

// TEMP: Simple test for Openrouter LLM integration (remove after testing)
async function testMcpChatbotLoop() {
  const result = await mcpChatbotLoop({ message: 'Hello, what properties are available?', history: [], user: {}, canAccessTool: () => true, getAccessError: () => null });
  // eslint-disable-next-line no-console
  console.log('Test mcpChatbotLoop result:', result);
}
// Uncomment to run test in dev mode
// testMcpChatbotLoop(); 