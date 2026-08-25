## Overall
    This project is very similar to notebooklm by google, where users can upload resources like pdf, youtube video, text and website. And in backend we will do RAG on resources so that users can ask queries related to the resources.

## User Flow
    1.First users will visit the landing page and after signing in will redirected to the /dashboard page.
    2.In /dashboard page there will be greeting for the user with the username(firstname) and  users can see all the notebooks they have created and can search notebooks,  and create new notebook. Users can create new notebook by icon, title and description.
    3. After creating the new notebook/workspace users will be redirected to /workspace/:workspaceId page where users can add new resources and can learn by creating summary, takeways, flashcards, quiz, mindmap and report
    4. On the workspace setting users can edit the title, description, icon, default model and can delete the workspace

## UI
    Honesty I'm not good in UI so you have to take care of it and i have given some refernece you can see it in ('./ui-reference')

## Tech Stack & tools
    NextJs -> apps/web
        clerk + tanstack with trpc + zustand + shadcnUI
        @ai-sdk/react, ai and streamdown for the chat streaming
    Express -> apps/api
        clerk + clerk webhook, (using clerk created protected procedure for trpc)
    Postgress with prisma -> packages/database
    Pinecone -> packages/vector-store
    tRPC -> packages/trpc
    cloudinary for storage -> packages/storage
    mem0ai for memory -> packages/memory
    inngest for background jobs -> packages/jobs
        inngest client -> packages/jobs-client
    rag -> packages/rag
    LLM calls -> packages/ai
    tavily web search -> packages/web-search
    services/business logic -> packages/services

