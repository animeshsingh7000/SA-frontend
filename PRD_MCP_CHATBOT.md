# Product Requirements Document (PRD)

## Title:
Stay Attaché Frontend MCP-Driven Chatbot (GET-only, Role-Aware)

---

### 1. Project Objective
Replace ad hoc chat API integration with a robust Model Context Protocol (MCP) architecture, allowing secure, role-aware, and extensible multi-API interaction through the chatbot.
**Scope:** Only GET endpoints are accessible; no write actions permitted.

---

### 2. Core Requirements
#### 2.1 Endpoint Integration
- All eligible API endpoints are documented via the OpenAPI spec (see src/api).
- Only GET methods may be invoked by chatbot.
- Tool registry maintains path, method, allowed roles, JWT/auth requirements, and description per endpoint.
- **CTO Note:** Add both requiredParams and optionalParams fields for clarity. Comment any ambiguities for review.

#### 2.2 Authentication
- JWT is managed exclusively through the useAuth context.
- No token is ever provided to the LLM or user, only sent with backend API calls.
- Auth failure is gracefully handled and surfaced to the user via the LLM.
- **CTO Note:** Add a custom ESLint rule or CI check to flag any direct localStorage token access.

#### 2.3 Role-Based Access
- Chatbot logic determines user role using fields in the user object (`user.isOwner`, `user.isAttache`, `user.isGuest`, `user.userRole`).
- Only endpoints matching the user's current role are exposed and permitted.
- Attempted violations are blocked and reported as structured errors.
- **CTO Note:** Registry should be designed for easy addition of new roles or role groups.

#### 2.4 Chatbot MCP Flow
- On user message:
  - System prompt is built with user role and list of GET endpoints (from registry).
  - Message history, prompt, and user message are sent to LLM.
  - If LLM calls a tool (intent object), dispatcher checks tool registry and role/auth, then fetches API.
  - API result or error is returned to LLM for formatted output.
- Only GET actions; all "write" API requests are blocked.
- **CTO Note:** All API errors should be wrapped in a standard error object (e.g., `{ type, code, message }`) for LLM consumption.

#### 2.5 System Prompt Structure
- Modularized into:
  - Assistant persona & limitations (Stay Attaché context only).
  - Role rules (inject from user object).
  - Tool/endpoint capability list (auto-generated from registry).
  - Examples of intent/response.
  - Privacy and error handling.
- **CTO Note:** Add a version number and changelog for prompt edits. Warn or automate if registry and prompt drift.

#### 2.6 Error Handling
- All API errors (unauth, forbidden, not found) and business errors are sent to the LLM for user-friendly phrasing.
- **CTO Note:** Never leak raw backend errors; always use the standard error object.

#### 2.7 Output
- All results and errors are delivered as LLM-generated chat responses—no custom React components required for data display.

---

### 3. Implementation Steps
- Audit and list all GET endpoints, with allowed roles/auth from OpenAPI.
- Build and maintain a tool registry in code.
- Centralize JWT auth and role-checking using useAuth context.
- Create a dispatcher that enforces registry rules for tool use.
- Refactor the chat handler to support prompt→LLM→tool→LLM flow.
- Modularize the system prompt.
- Document all flows and provide instructions for new endpoint/prompt updates.
- **CTO Note:** Add automation for linting token access, registry/prompt diff, and a basic test harness for role+endpoint permutations.

---

### 4. Out of Scope
- Any non-GET API (POST, PUT, PATCH, DELETE)
- Custom data visualization beyond LLM text output
- Role detection via JWT decoding or API, unless future requirements change

---

### 5. Success Criteria
- Chatbot only allows GET endpoints, checked per role and auth.
- Tool registry and prompt are always in sync (manual or automated).
- All data/results and errors are phrased by LLM—no backend leaks.
- Future write-action and role extension is documented, not ad hoc.
- Ownership, documentation, and changelogs exist and are maintained.

---

### 6. Ownership, Versioning, and Onboarding (CTO Addendum)
- Assign a clear owner for registry and prompt maintenance; document the process for requesting/approving changes.
- README must include a "Why we do it this way" section, not just "How".
- Maintain a prompt version and changelog file; note which prompt version is used for each release.
- Document onboarding steps for new developers, including registry/prompt update process and security rationale.
- Plan for scaling roles and endpoints by grouping roles in the registry and documenting extension patterns. 


