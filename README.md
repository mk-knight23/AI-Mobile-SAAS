# VibeDesign.ai | AI Mobile UI Design Agent

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.0-2d3748?style=for-the-badge&logo=prisma)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff?style=for-the-badge&logo=clerk)

**An AI-powered platform to design and prototype mobile apps in seconds.**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Deployment](#deployment)

</div>

---

## Features

- **AI Direct Design**: Prompt-to-UI generation using Minimax AI
- **Draggable Canvas**: Infinite workspace powered by XYFlow (React Flow)
- **Real Mockups**: View designs inside realistic mobile device frames
- **Export PNG**: Download high-quality images of your designs
- **Dark/Light Mode**: Seamless switching between themes
- **Secure Authentication**: Powered by Clerk with middleware protection
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Comprehensive error boundaries with fallback content
- **Chat Assistant**: AI-powered design assistant for guidance

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI, shadcn/ui pattern |
| Animation | Framer Motion |
| State Management | React Hooks, XYFlow |
| Database | PostgreSQL with Prisma 7 |
| Authentication | Clerk |
| AI | Vercel AI SDK (Minimax) |
| Forms | Zod validation |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- PostgreSQL database (local or hosted)
- Clerk account (free tier works)
- Minimax API key (https://api.minimax.chat)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibedesign-ai.git
   cd vibedesign-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   # Database (Supabase, Neon, or local)
   DATABASE_URL="postgresql://user:password@host:5432/db"

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx

   # AI (Minimax)
   MINIMAX_API_KEY=sk-xxx
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `MINIMAX_API_KEY` | Yes | Minimax API key for AI generation |

## Project Structure

```
vibedesign-ai/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   │   ├── chat/         # Chat API
│   │   │   ├── generate/     # Screen generation API
│   │   │   ├── projects/     # Projects CRUD
│   │   │   └── screens/      # Screens CRUD
│   │   ├── dashboard/        # User dashboard
│   │   ├── editor/           # Project editor
│   │   ├── projects/         # Projects list
│   │   ├── templates/        # App templates
│   │   ├── pricing/          # Pricing page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── editor/           # Editor components
│   │   │   ├── canvas.tsx
│   │   │   ├── chat-sidebar.tsx
│   │   │   ├── mobile-frame.tsx
│   │   │   └── toolbar.tsx
│   │   ├── home/             # Home page components
│   │   ├── layout/           # Layout components
│   │   │   └── header.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── loading.tsx
│   │       └── sonner.tsx
│   ├── lib/
│   │   ├── ai.ts             # AI provider utilities
│   │   ├── env.ts            # Environment validation
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Utility functions
│   └── generated/prisma/     # Generated Prisma client
├── .env.example              # Environment template
├── .eslint.config.mjs        # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## API Documentation

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all user projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/:id` | Get single project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/screens` | Add screen to project |
| POST | `/api/projects/save` | Save project state |

### Screens

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/screens/:id` | Get single screen |
| PATCH | `/api/screens/:id` | Update screen |
| DELETE | `/api/screens/:id` | Delete screen |

### AI Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate new screen |
| POST | `/api/chat` | AI chat assistant |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
vercel deploy --prod
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Railway

1. Connect GitHub repository
2. Add PostgreSQL service
3. Add environment variables
4. Deploy

### Netlify

Netlify doesn't support WebSocket connections required for some features. Use Vercel instead.

## Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Run production server
npm start
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Create an issue for bugs
- Discussions for questions
- Wiki for documentation

---

<div align="center">
Built with ❤️ using Next.js, AI, and Modern Web Technologies
</div>
