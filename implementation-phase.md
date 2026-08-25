## Phase 1 - Authenticaton

    In this phase we just have to create the login/signup using clerk and i will check clerk webhook is working or not.
    And protect(middleware) routes in proxy.ts, without signing/unauthenticated users can only enter the landing page.

## Phase 2 - Workspace

    - write the tRPC procedures for the workspace according to the services in packages/trpc/server/routes/ folder
    - write the hooks for the workspace using trpc + tanstackQuery
    - create the components for the workspace
    - write the tests for the workspace

## Phase 3 - Resources

    - write the tRPC procedures for the resources according to the services in     packages/trpc/server/routes/ folder
    - write the hooks for the resources using trpc + tanstackQuery
    - create the components for the resources

## Phase 4 - Learning

    - write the tRPC procedures for the learning according to the services in packages/trpc/server/routes/ folder
    - write the hooks for the learning using trpc + tanstackQuery
    - create the components for the learning

## Phase 5 - Chat

    - write the tRPC procedures for the conversation according to the services in packages/trpc/server/routes/ folder
    - write the hooks for the chat using trpc + tanstackQuery
    - create the components for the chat using @ai-sdk/react, ai and streamdown
    - Chat with LLM should be made from express route not from trpc route using the defaultChatTransport
