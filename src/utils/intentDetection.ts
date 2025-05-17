// Utility for extracting intent data from AI responses

export interface IntentData {
  action: string;
  endpoint: string;
  params: Record<string, any>;
  token: string;
  purpose: string;
}

/**
 * Extracts the first valid intent JSON block from an AI response string.
 * Returns null if no valid intent block is found.
 */
export function extractIntentData(aiResponse: string): IntentData | null {
  // Try to find [JSON] ... [/JSON] block first
  const match = aiResponse.match(/\[JSON\]([\s\S]*?)\[\/JSON\]/i);
  let jsonStr = '';
  if (match) {
    jsonStr = match[1].trim();
  } else {
    // Try to find a JSON object in the response (even if not tagged)
    const curlyMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (curlyMatch) {
      jsonStr = curlyMatch[0];
    } else {
      return null;
    }
  }
  try {
    const data = JSON.parse(jsonStr);
    if (
      typeof data === 'object' &&
      data.action === 'call_api' &&
      typeof data.endpoint === 'string' &&
      typeof data.params === 'object' &&
      typeof data.purpose === 'string'
    ) {
      return data as IntentData;
    }
    return null;
  } catch (e) {
    return null;
  }
}