# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application for Return to Freedom (RTF), a wild horse conservation organization. The stack includes:

- **Frontend**: Next.js 16 with React 19, TypeScript
- **Backend**: Convex (serverless database and backend)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4
- **Rich Text**: TipTap editor
- **Package Manager**: Yarn (always use `yarn`, not `npm`)

## Development Commands

### Running TypeScript

```bash
# Run TypeScript compiler in watch mode
yarn run tsc
```

You always run TypeScript before reporting that a task is done (unless it's something tiny, like a small css fix etc.)

### Running the Application

```bash
# Start both frontend and backend in development mode
yarn dev

# Start only the frontend
yarn dev:frontend

# Start only the backend (Convex)
yarn dev:backend

# Pre-development setup (runs convex setup)
yarn predev
```

### Building and Testing

```bash
# Build the application for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint
```

**Note**: Building takes a long time. Be reluctant to run builds unless necessary. If build errors occur, check `.next/` for build output.

## Architecture

### Route Structure

The app uses Next.js App Router with two main route groups:

- **`app/(main)/`**: Public-facing pages (landing, about, contact, donate, horses, resources, visit-us, what-we-do)
- **`app/admin/`**: Admin dashboard (animals, demo, dev, documents, errors, events, images, locations, news, people, sponsors, users)
- **`app/api/`**: API routes

### Convex Backend

All backend logic lives in the `convex/` directory:

- **Schema**: `convex/schema.ts` defines all database tables and indexes
- **Functions**: File-based routing where `convex/example.ts` exports functions accessible as `api.example.functionName`
- **Key tables**: users, people, animals, herds, articles, events, programs, images, documents, contactMessages, newsletterSubscribers

Important Convex function patterns:
- Use `query`, `mutation`, `action` for public functions
- Use `internalQuery`, `internalMutation`, `internalAction` for private functions
- Always include `args` and `returns` validators
- Call functions via `ctx.runQuery`, `ctx.runMutation`, `ctx.runAction` with function references from `api` or `internal` objects

### Authentication & Authorization

- Uses Clerk for authentication (configured in `middleware.ts`)
- Convex auth config in `convex/auth.config.ts`
- Role-based access: `guest`, `authorized`, `admin`, `dev` (defined in `convex/schema.ts`)
- User helper: `getCurrentUserOrThrow` in `convex/users.ts`

### Component Organization

- **`components/ui/`**: Shadcn UI components (button, dialog, form, etc.)
- **`components/`**: Custom components (AdminNavbar, EventCalendar, TiptapEditor, etc.)
- **`components/public-ui/`**: Public-facing UI components
- **`components/images/`**: Image-related components
- **`components/donation-widgets/`**: Donation-specific widgets
- **`providers/`**: React context providers (ConvexClientProvider, AuthRouter, DnDProvider)

### State Management

- Convex queries/mutations provide reactive state
- Jotai for local state management
- React Hook Form for form state

### Image Handling

- Images stored in Convex storage (`_storage` table)
- Metadata tracked in `images` table
- Next.js Image component configured for `*.convex.cloud` domains
- Helper functions in `convex/images.ts`

## Coding Conventions

### TypeScript

- Use `type` instead of `interface`
- Use ES6 arrow functions with `const` keyword for all functions
- Use string templates instead of concatenation
- 4 spaces for indentation
- No semicolons except where necessary
- Be strict with types, especially Convex `Id<"tableName">` types

### React

- Don't import React directly; use named imports (`import { useState } from 'react'`)
- Use const/ES6 arrow functions for components
- Use `PageProps` type from `./lib/types.ts` for page components
- Use `type` for prop definitions
- Prefer destructured props (ESLint prefer-destructuring rule)

### Styling

- Use Tailwind CSS for all styling
- Fallback to inline styles only when necessary
- Never create independent CSS files
- Do not use the burnt-orange color for anything. Use cinnamon instead.
- Everything in the admin interface /admin/* should be black and white. No colors in this part of the site.

### Convex

- **Always** use new function syntax with validators:
  ```typescript
  export const myQuery = query({
    args: { id: v.id("tableName") },
    returns: v.object({ ... }),
    handler: async (ctx, args) => { ... }
  })
  ```
- **Always** include both `args` and `returns` validators
- Use `v.null()` when returning null
- Define indexes in schema with descriptive names (e.g., `by_field1_and_field2`)
- Use `withIndex` for queries, not `filter`
- For deletions: `.collect()` results then iterate and call `ctx.db.delete(row._id)`
- Actions that need Node.js: add `"use node";` at top of file

### File Organization

- Convex uses file-based routing in `convex/` directory
- Group related functionality (e.g., `people.ts`, `animals.ts`, `events.ts`)
- Keep internal helper functions in the same file or `convex/utils.ts`

## Key Domain Concepts

### People Management

- People can have multiple roles: director, staff, equine specialist, storyteller, ambassador
- People can be marked as "in memoriam"
- Each role has an order field for display ordering
- People can belong to advisory boards (many-to-many via `peopleAdvisoryBoards` table)

### Animal & Herd Management

- Animals (horses/burros) can belong to herds
- Both animals and herds have rich content (description, gallery, timeline)
- Animals/herds can have associated articles via `articleMetadataIds`
- Animals can be marked "in memoriam"

### Events & Programs

- Programs belong to program groups
- Events are instances of programs with specific dates
- Events support RSVP with ticket pricing
- Discount codes can apply to specific programs or events

### Content Management

- Articles have metadata (tags, topics, excerpt) separate from content
- External articles can be linked
- Full-text search on article metadata
- Images have searchable titles and alt text
- TipTap editor for rich content editing

## Environment Variables

Check `.env.local` for required environment variables (not committed to repo):
- Convex deployment URL
- Clerk authentication keys
- Any other API keys

## Common Patterns

### Fetching Data in Server Components

```typescript
import { preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

const preloaded = await preloadQuery(api.example.myQuery, { ... })
```

### Using Convex in Client Components

```typescript
"use client"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const data = useQuery(api.example.myQuery, { ... })
const mutate = useMutation(api.example.myMutation)
```

### Image URLs

```typescript
// In Convex function
const url = await ctx.storage.getUrl(storageId)

// In component
const url = useQuery(api.images.getImageUrl, { imageId })
```

## Testing

No formal test suite currently exists. Manual testing in development environment.

## Deployment

Application appears to be deployed to:
- Production: https://returntofreedom.org
- Staging: https://rtf.leoware.io
