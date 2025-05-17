import { api } from './api';
import { IntentData } from '../utils/intentDetection';

export async function sendChatMessage(message: string): Promise<string> {
  const response = await api.post('/api/v1/chat/message', { message });
  return response.data.message;
}

/**
 * Calls the appropriate API endpoint based on detected intent.
 * Returns a formatted string for chat display, or throws on error.
 */
export async function callApiByIntent(intent: IntentData): Promise<string> {
  try {
    // Property search should not be handled here anymore
    if (intent.endpoint === '/api/v1/listing/list') {
      throw new Error('Property search must be handled by rendering <BrowsePropertiesInChat params={...} />');
    }
    // Use the endpoint and params from the intent for other cases
    const response = await api.post(intent.endpoint, intent.params, {
      headers: {
        Authorization: `Bearer ${intent.token}`,
      },
    });
    // Format the response for chat display (simple JSON pretty print for now)
    return `<pre>${JSON.stringify(response.data, null, 2)}</pre>`;
  } catch (error: any) {
    // Return a user-friendly error message
    return 'Sorry, there was a problem fetching the requested data.';
  }
}

/**
 * Fetches property listings for the chatbot, similar to attacheProperty.browseProperty.
 * Returns { data, totalProperty }.
 */
// REMOVED: browsePropertyForChat function. Use browseProperty from ../api/attacheProperty instead. 