# Architecture Documentation

## System Overview

VibeDesign.ai is an AI-powered mobile UI design platform built with modern web technologies. It allows users to describe mobile app screens in natural language and generates fully-rendered UI designs.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Browser   │  │   Mobile    │  │     API Clients         │  │
│  │  (Next.js)  │  │   (PWA)     │  │   (REST / Webhooks)     │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
└─────────┼───────────────┼──────────────────────────────────────┘
          │               │
          ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Application                          │
│  ┌─────────────────────┐    ┌──────────────────────────────┐   │
│  │   Pages & Layouts   │    │     API Routes               │   │
│  │   (React Server     │    │   /api/projects              │   │
│  │    Components)      │    │   /api/generate              │   │
│  │                     │    │   /api/chat                  │   │
│  └──────────┬──────────┘    └──────────────┬───────────────┘   │
│             │                               │                    │
│  ┌──────────▼──────────┐    ┌──────────────▼───────────────┐   │
│  │   Client State      │    │      Middleware              │   │
│  │   (React Hooks)     │    │   (Clerk Authentication)     │   │
│  └─────────────────────┘    └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │                               │
          ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Service Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   OpenAI GPT    │  │  Google Gemini  │  │   Minimax       │  │
│  │   (Primary)     │  │   (Fallback)    │  │   (Alternative) │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌─────────────────────┐    ┌──────────────────────────────┐   │
│  │   PostgreSQL        │    │   File Storage               │   │
│  │   (Prisma ORM)      │    │   (html-to-image export)     │   │
│  └─────────────────────┘    └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Decisions

### 1. Next.js App Router

We chose Next.js 16 with the App Router for:
- Server Components by default for better performance
- Streaming SSR for AI responses
- Built-in API routes without separate server
- Automatic code splitting and optimization

### 2. Vercel AI SDK

The AI SDK provides:
- Unified API across multiple providers
- Automatic fallback between providers
- Structured output generation (Zod schemas)
- Type-safe AI interactions

**Provider Priority:**
1. OpenAI GPT-4o-mini (primary)
2. Minimax (fallback)
3. Google Gemini 1.5 Flash (final fallback)

### 3. XYFlow (React Flow)

XYFlow was chosen for the canvas because:
- Custom node types support (mobile frames)
- Drag-and-drop functionality
- Infinite canvas with zoom/pan
- React-first architecture

### 4. Prisma 7 ORM

Prisma provides:
- Type-safe database queries
- Automatic migrations
- Generated TypeScript types
- Connection pooling support

### 5. Clerk Authentication

Clerk handles:
- User sign-up/sign-in
- Session management
- Protected routes via middleware
- User profile management

## Data Models

### Project
```typescript
model Project {
  id            String          @id @default(cuid())
  name          String
  thumbnail     String?
  userId        String
  theme         String          @default("light")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  screens       Screen[]
  promptHistory PromptHistory[]
}
```

### Screen
```typescript
model Screen {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  htmlContent String
  cssContent  String
  x           Float    @default(0)
  y           Float    @default(0)
  width       Float    @default(375)
  height      Float    @default(812)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### PromptHistory
```typescript
model PromptHistory {
  id        String   @id @default(cuid())
  projectId String
  content   String
  role      String   // "user" | "assistant"
  createdAt DateTime @default(now())
}
```

## API Design

### RESTful Endpoints

All API routes follow REST conventions:
- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `GET /api/resources/:id` - Get single resource
- `PATCH /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Error Handling

 consistent error responses:

```typescript
{
  error: "Error message",
  details?: { /* validation errors */ }
}
```

HTTP Status Codes:
- 400: Bad Request (validation)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
All API routes return- 503: Service Unavailable (AI provider down)

## Security

### Middleware Protection

```typescript
// Public routes (no auth required)
- / (landing page)
- /sign-in/*
- /sign-up/*
- /api/chat (auth in route)
- /api/projects (POST - auth in route)
- /api/generate (auth in route)

// Protected routes (auth required via middleware)
- /dashboard
- /projects
- /editor/*
- /templates
- /pricing
```

### Environment Variables

Sensitive configuration is managed through environment variables with validation at startup.

## Performance Optimizations

### Client-Side
- React Suspense for code splitting
- Memoized callbacks with `useCallback`
- Optimized package imports
- Lazy loading components

### Server-Side
- React Server Components for zero client bundle
- Streaming responses for AI generation
- Database connection pooling
- Optimized Prisma queries

### Build
- Tree-shaking unused code
- CSS optimization with Tailwind
- Image optimization with Next.js Image

## Deployment

### Vercel (Recommended)
- Automatic deployments from Git
- Edge functions support
- Built-in environment variable management
- Serverless function scaling

### Docker
```bash
docker build -t vibedesign .
docker run -p 3000:3000 vibedesign
```

### Environment-Specific Configurations

| Environment | Node.js | Features |
|-------------|---------|----------|
| Development | 20 | Debug logging, hot reload |
| Production | 20 | Optimized builds, error tracking |

## Monitoring & Logging

### Development
- Next.js dev server logs
- Console warnings for missing env vars
- API route request/response logging

### Production
- Error boundaries catch React errors
- Toast notifications for user feedback
- Console logs for server errors

## Future Improvements

### Short-term
- [ ] Real-time collaboration
- [ ] Version history with diff
- [ ] Shareable public links
- [ ] Export to React Native

### Long-term
- [ ] Team workspaces
- [ ] Custom AI model fine-tuning
- [ ] Plugin system
- [ ] API webhooks

## Known Issues & Workarounds

| Issue | Workaround |
|-------|------------|
| Gemini API unavailable | Fallback to OpenAI/Minimax |
| Canvas performance | Reduce nodes on large projects |
| Mobile view | Use responsive toolbar |

## Contributing

See [README.md](README.md) for setup and development instructions.
