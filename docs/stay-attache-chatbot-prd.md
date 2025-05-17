# Stay Attaché — OpenRouter/Gemini Chat Assistant PRD
*Revised for Pet Project Scope*

---

## 1. Project Overview
Replace the existing chat with an AI-powered assistant that answers Stay Attaché-specific questions using existing APIs, while maintaining strict scope control and security.

---

## 2. Current Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend UI | ✅ DONE | Chat interface implemented in React |
| LLM Integration | ✅ DONE | Using OpenRouter with Gemini model |
| System Prompt | ✅ DONE | Comprehensive scope and behavior rules set |
| Message Handling | ✅ DONE | Can send/receive messages with proper formatting |
| Basic Error Handling | ✅ DONE | Displays user-friendly error messages |

---

## 3. Remaining Implementation Goals

### 3.1. Chat Assistant Capabilities
- **Intent Detection** ⚠️ NEEDED
  - Have the LLM correctly identify user intent from messages
  - Map intents to appropriate API endpoints

- **API Integration** ⚠️ NEEDED
  - Use existing Stay Attaché APIs based on user intent
  - Pass authentication tokens to APIs
  - Format API responses into friendly chat messages

- **Permission Handling** ⚠️ NEEDED
  - Check user role/permissions before making API calls
  - Provide appropriate responses for unauthorized requests

### 3.2. Enhanced User Experience
- **Loading States** ⚠️ NEEDED
  - Improve visual feedback during API calls
  - Add typing indicators for longer responses

- **Contextual Suggestions** ⚠️ NEEDED
  - Offer relevant follow-up actions based on previous interactions
  - Suggest specific queries users can ask about

---

## 4. Implementation Approach

### 4.1. Front-End Only Architecture
```
[React Chat Widget] → [Auth Context/Tokens]
          ↓
[OpenRouter/Gemini API] → [System Prompt + Intent Detection]
          ↓
[Intent-to-API Mapper] → [Existing Stay Attaché APIs]
          ↓
[Response Formatter] → [User-friendly Message]
```

### 4.2. Task Breakdown

1. **Intent Detection Module**
   - Enhance system prompt to better identify common intents
   - Create an intent-to-API mapping function in the frontend
   - Implement verification checks before API calls

2. **API Integration**
   - Add utility functions for calling existing APIs
   - Create response parsers for converting API data to chat messages
   - Implement error handling for API failures

3. **UX Enhancements**
   - Add loading states and typing indicators
   - Implement contextual suggestions
   - Create helpful error states for common issues

4. **Security & Validation**
   - Ensure proper token handling
   - Validate user inputs before API calls
   - Implement rate limiting for chat messages

---

## 5. Technical Requirements

### 5.1. Frontend Components
- Enhanced `ChatWidget.tsx` with API integration
- Utility functions for API calls and response formatting
- Intent detection and mapping logic

### 5.2. API Integration
- Use existing endpoints with proper authentication
- Handle API responses and errors gracefully
- Format API data into user-friendly messages

### 5.3. Model Configuration
- Continue using OpenRouter with Gemini Flash 1.5
- Optimize system prompt for better intent detection
- Implement JSON parsing for structured API responses

---

## 6. Task Priority & Dependencies

| Task | Priority | Dependencies | Status |
|------|----------|--------------|--------|
| Setup OpenRouter/LLM integration | HIGH | None | ✅ DONE |
| Implement system prompt | HIGH | OpenRouter integration | ✅ DONE |
| Basic chat UI | HIGH | None | ✅ DONE |
| Intent detection enhancement | HIGH | System prompt | ⚠️ TO DO |
| API integration utilities | HIGH | Intent detection | ⚠️ TO DO |
| Response formatting | MEDIUM | API integration | ⚠️ TO DO |
| Loading states & indicators | MEDIUM | Basic chat UI | ⚠️ TO DO |
| Contextual suggestions | LOW | Response formatting | ⚠️ TO DO |
| Security enhancements | HIGH | API integration | ⚠️ TO DO |

---

## 7. Implementation Guidelines

1. **Keep It Simple**
   - Focus on core functionality first
   - Avoid complex state management

2. **Use Existing APIs**
   - No new backends or services
   - Work with what's already available

3. **Security First**
   - Always validate user input
   - Only make API calls with proper permissions

4. **Graceful Degradation**
   - Handle API failures elegantly
   - Provide helpful messages when things go wrong

---

## 8. Success Criteria
- Chat assistant can accurately identify common user intents
- Assistant can fetch data from existing APIs successfully
- Responses are formatted in a user-friendly way
- System respects user permissions and security boundaries
- UI provides appropriate feedback during operations 