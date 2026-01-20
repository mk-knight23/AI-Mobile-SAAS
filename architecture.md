# Architecture: Xdesign.ai

## System Overview

```mermaid
graph TD
    User([User]) -->|Prompt| Frontend[Next.js Frontend]
    Frontend -->|POST /api/chat| AIServer[Vercel AI SDK]
    AIServer -->|Stream Object| Gemini[Gemini 2.0 API]
    Gemini -->|JSON Screens| AIServer
    AIServer -->|Streaming UI| Canvas[XYFlow Canvas]
    Canvas -->|Render| MobileFrame[Mobile Device Frame]
    MobileFrame -->|Export| PNG[PNG Image]
    Canvas -->|Save| DB[(Postgres / Prisma)]
```

## Technical Decisions

### 1. Vercel AI SDK (Stream Object)
We use `streamObject` to allow the user to see the design evolve in real-time. Instead of waiting for the full response, the canvas adds nodes as soon as the schema is partially fulfilled.

### 2. XYFlow (React Flow)
Chosen for its flexibility in handling custom nodes. It allows us to treat a complex mobile device mockup as a single draggable entity on an infinite plane.

### 3. Glassmorphism Design System
Following the `ui-ux-pro-max` search result, we implemented a layered glass system using backdrop-blur and semi-transparent borders to create a premium, high-tech feel suitable for an AI tool.

### 4. Prisma 7 Output Path
The client is generated into `src/generated/prisma` to ensure compatibility with modern bundlers and strict directory structures.
