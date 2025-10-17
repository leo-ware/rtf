# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for Return to Freedom, a wild horse conservation organization. The application serves as their main website with content management, donation processing, event management, and admin functionality.

**Tech Stack:**
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Convex (database, real-time updates, serverless functions)
- **Authentication**: Convex Auth with password-based authentication
- **Styling**: Tailwind CSS with shadcn/ui components (New York style)
- **Rich Text**: TipTap editor for content management
- **State Management**: Jotai for global state
- **Icons**: Lucide React

## Development Commands

### Essential Commands
```bash
# Install dependencies
yarn install

# Start development (runs both frontend and backend)
yarn dev

# Start only frontend
yarn dev:frontend

# Start only backend  
yarn dev:backend

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint
```

### Setup Commands
```bash
# Initial setup (runs once)
yarn predev

# Manual setup (if needed)
node setup.mjs
```

## Architecture

### Directory Structure
```
app/                    # Next.js App Router pages
├── (main)/            # Public-facing pages (landing, about, etc.)
├── admin/             # Protected admin interface
├── globals.css        # Global styles with Tailwind
└── layout.tsx         # Root layout with auth providers

convex/                # Convex backend functions
├── schema.ts          # Database schema definitions
├── auth.ts            # Authentication configuration
├── articles.ts        # Blog/article management
├── animals.ts         # Horse/burro profiles
├── donations.ts       # Payment processing
├── events.ts          # Event management
├── images.ts          # File storage handling
├── pages.ts           # CMS pages
└── herds.ts          # Animal group management

components/            # React components (51 total)
├── ui/               # shadcn/ui base components
└── [feature-based]   # Custom components

hooks/                # Custom React hooks
lib/                  # Utility functions and helpers
public/              # Static assets
```

### Database Schema
The Convex schema includes these main entities:
- **users**: Authentication + roles (authorized/admin/dev)
- **articles**: Blog posts with publish workflow
- **animals**: Horse/burro profiles with herds
- **donations**: Payment processing with status tracking
- **events**: Event management with registration
- **images**: File storage with metadata
- **pages**: CMS pages by category
- **contactMessages**: Contact form submissions
- **newsletterSubscribers**: Email list management
- **externalArticles**: Curated external content

### Authentication System
- Uses Convex Auth with password provider
- Role-based access: `authorized`, `admin`, `dev`
- Protected routes under `/admin/*`
- Middleware handles auth redirects
- Session management via Convex Auth providers

### Content Management
- Rich text editing with TipTap editor
- Image upload/management through Convex storage
- Slug-based routing for articles, pages, animals
- Publication workflow for content approval
- Category-based page organization

## Styling Guidelines

### Design System
- Uses shadcn/ui with "new-york" style variant
- Base color: neutral
- CSS variables for theming
- Tailwind CSS with custom configuration

### Typography
- Primary: Work Sans (weights: 400, 500, 600, 700)
- Display: Marcellus (serif for headings)
- Mono: Geist Mono

### Component Patterns
- Prefer const/arrow functions for components
- Use `type` for prop definitions
- Follow ESLint prefer-destructuring
- Use Tailwind classes over CSS files
- 4-space indentation, minimal semicolons

## Development Guidelines

### Convex Function Patterns
- Always use new function syntax with args/returns validators
- Use `internalQuery/Mutation/Action` for private functions
- Use `query/mutation/action` for public API endpoints
- Include `returns: v.null()` for functions returning nothing
- Prefer indexed queries over filters for performance
- Use proper TypeScript types like `Id<"tableName">`

### React Patterns
- No explicit React imports (modern JSX transform)
- Use const/arrow functions for components
- Prefer `type` over `interface`
- Use string templates over concatenation
- Follow Cursor rules for React/TypeScript

### File Organization
- Feature-based component organization
- Co-locate related files when possible
- Use absolute imports with `@/` prefix
- Keep Convex functions in appropriate domain files

### Authentication Integration
```typescript
// Check authentication in components
const { isLoading, isAuthenticated } = useConvexAuth()

// Get current user
const currentUser = useQuery(api.users.current)

// Protect admin routes via middleware
const isProtectedRoute = createRouteMatcher(["/admin/(.*)"])
```

### Content Management Patterns
- Use slug-based routing consistently
- Include publication status in queries
- Handle image uploads through Convex storage
- Implement proper error handling for admin operations

## Common Tasks

### Adding New Content Types
1. Define schema in `convex/schema.ts`
2. Create CRUD functions in appropriate `convex/*.ts` file
3. Build UI components in `components/`
4. Add pages in `app/` following route conventions

### Managing Images
- Upload through Convex storage API
- Store metadata in `images` table
- Use `ctx.storage.getUrl()` for public URLs
- Handle file validation and error states

### Working with Forms
- Use react-hook-form with Zod validation
- Handle Convex mutations for data persistence
- Implement proper error handling and loading states
- Follow existing form patterns in codebase

## Environment Setup

The project uses environment variables for:
- Convex deployment configuration
- Authentication secrets (managed by Convex Auth)
- External service integrations

Run `yarn predev` for initial setup which configures Convex Auth automatically.