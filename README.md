# SA-frontend

# MCP Chatbot Architecture, Ownership, and Onboarding

## Overview
This project implements a Model Context Protocol (MCP)-driven chatbot architecture for Stay Attaché, enabling secure, role-aware, GET-only API access via a registry-driven system. All chatbot actions are mediated by a modular, versioned system prompt and a secure dispatcher utility.

## System Architecture & Flow
- **apiTools.ts**: Central registry of all eligible GET endpoints, with path, roles, params, and descriptions.
- **useRoleAccess.ts**: Hook for role-aware access control, using the user object from useAuth.
- **mcpDispatcher.ts**: Dispatcher utility that validates endpoint, method, role, and auth before making API calls. Returns only standardized error objects.
- **promptBuilder.ts**: Modular, versioned system prompt builder that injects persona, role, tool list, examples, privacy, error handling, version, and changelog.
- **mcpChatbotLoop.ts**: Main chatbot loop that builds the prompt, interacts with the LLM, handles tool calls, and returns LLM-phrased results/errors.
- **StepsTakenToMCP.md**: Running changelog and onboarding reference for all MCP migration work.

## How to Add/Update Endpoints, Roles, or Prompts
1. **Add or update GET endpoints** in `apiTools.ts`, specifying path, method, roles, params, and description. Comment any ambiguities for review.
2. **Update the prompt builder** (`promptBuilder.ts`) if you add new prompt modules, examples, or change the persona.
3. **If you add new roles**, update the registry and ensure `useRoleAccess.ts` and the prompt builder support the new role.
4. **Document all changes** in `StepsTakenToMCP.md` and update the changelog/version in the prompt builder.

## Ownership & Change Approval
- The MCP registry (`apiTools.ts`) and prompt (`promptBuilder.ts`) have clear owners. All changes must be reviewed and approved by the designated owner(s).
- Use the changelog in `StepsTakenToMCP.md` and the prompt version/changelog for auditability.
- For major changes, update onboarding documentation and notify the team.

## Onboarding Steps for New Developers
1. Read `StepsTakenToMCP.md` for a full history of the MCP migration and rationale for all major decisions.
2. Review the architecture overview above and the code in `apiTools.ts`, `mcpDispatcher.ts`, `promptBuilder.ts`, and `mcpChatbotLoop.ts`.
3. Follow the coding guidelines and security rationale below.

## Security Rationale & Extension Patterns
- **JWT/auth is managed exclusively via `useAuth`.** Never access localStorage directly in new code.
- **Role checks use the user object from `useAuth`.** All access and tool exposure is determined by the user's role.
- **Only GET endpoints are ever exposed to the chatbot.** All write actions are blocked.
- **All errors/results are LLM-phrased.** Never leak raw backend errors.
- **To extend roles or endpoints:**
  - Add new roles to the registry and update `useRoleAccess.ts`.
  - Add new endpoints to `apiTools.ts` and update the prompt builder as needed.
  - Document all changes and update onboarding docs.

For more details, see the full MCP migration log in `StepsTakenToMCP.md`.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
