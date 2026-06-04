---
name: nextjs-app-router-patterns
description: Applies Next.js 16 App Router conventions for Server/Client components, route structure, metadata, loading and error boundaries, and cache. Use when working with App Router, layouts, pages, Server Components, "use client", route groups, Route Handlers, or revalidation.
---

# Next.js App Router Patterns

Apply these patterns whenever working with Next.js 16 App Router.

**BeatStack note:** the main UI is a client-only editor; keep `app/page.tsx` thin and push `"use client"` to `components/editor/`.

## Server vs Client Components

- **Server Component by default** — no directive at top of file.
- Add `"use client"` **only** when you need: `useState`, `useEffect`, event handlers, browser APIs, or third-party client-only hooks.
- Avoid `"use client"` in layouts or pages when possible; push client boundaries down to leaf components.

## Data fetching in Server Components

Fetch directly in async components. No `useEffect` or `useState` for data.

```tsx
async function Page() {
  const data = await db.query.posts.findMany();
  return <PostList posts={data} />;
}
```

## Server Actions

- File (or top of module): `"use server"`.
- Use `auth()` (e.g. Clerk) and throw or return early if unauthenticated.
- Validate input with Zod (or schema) before DB/external calls.
- Call `revalidatePath` (or `revalidateTag`) after mutations.

```tsx
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = schema.parse(Object.fromEntries(formData));
  await db.insert(posts).values({ ...validated, userId });
  revalidatePath("/dashboard");
}
```

## Route structure (App Router)

- `app/layout.tsx` — root layout (providers, fonts, etc.).
- `app/page.tsx` — public landing.
- Route groups (no URL segment): `(auth)/`, `(dashboard)/`.
- Use `(auth)` for sign-in/sign-up with optional catch-all: `sign-in/[[...sign-in]]/page.tsx`, `sign-up/[[...sign-up]]/page.tsx`.
- Use `(dashboard)/layout.tsx` for dashboard shell; pages under `(dashboard)/dashboard/` (or similar).
- API: `app/api/.../route.ts` (e.g. `app/api/webhooks/clerk/route.ts`).

Example:

```
app/
├── layout.tsx
├── page.tsx
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx
└── api/
    └── webhooks/
        └── clerk/
            └── route.ts
```

## Metadata

- **Static**: export `metadata` from `page.tsx` or `layout.tsx`.

```tsx
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

- **Dynamic**: export `generateMetadata` async function.

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.id);
  return { title: post.title };
}
```

## Loading and error states

- **loading.tsx** — automatic Suspense fallback for the segment. No `"use client"` unless the loading UI uses client-only features.

```tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
```

- **error.tsx** — must be a Client Component; captures errors in the segment and receives `error` and `reset`.

```tsx
"use client";

export default function Error({ error, reset }) {
  return <ErrorComponent onRetry={reset} />;
}
```

## Route Handlers (API Routes)

- Export `GET`, `POST`, etc. from `app/api/.../route.ts`.
- Check auth (e.g. Clerk) and return 401 when unauthenticated.
- Return JSON via `NextResponse.json({ data })` (or consistent `{ data, error }` shape).

```tsx
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await db.query.posts.findMany();
  return NextResponse.json({ data: posts });
}
```

## Cache and revalidation

- After mutations: `revalidatePath("/dashboard")` or `revalidatePath("/posts", "layout")` for layout-level revalidation.
- For fetch: use `next: { revalidate: 3600 }` (or `cache: "no-store"`) when explicit cache control is needed.

```tsx
revalidatePath("/dashboard");
revalidatePath("/posts", "layout");

const data = await fetch(url, { next: { revalidate: 3600 } });
```

## Summary checklist

- [ ] New component is Server unless it needs client hooks/APIs/events.
- [ ] Data fetched in Server Components with async/await, not in `useEffect`.
- [ ] Server Actions use `"use server"`, auth check, and validation; then revalidate.
- [ ] Routes follow group layout: `(auth)`, `(dashboard)`, and `api/` as above.
- [ ] Pages/layouts export `metadata` or `generateMetadata` where appropriate.
- [ ] Segment has `loading.tsx` and `error.tsx` when useful.
- [ ] Route Handlers check auth and return consistent JSON.
- [ ] Mutations trigger `revalidatePath` (or tags) as needed.
