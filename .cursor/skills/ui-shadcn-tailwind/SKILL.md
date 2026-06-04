---
name: ui-shadcn-tailwind
description: Expert in UI with shadcn/ui, Tailwind CSS and web accessibility. Use when building complex components, designing layouts and grids, implementing dark mode, adding animations or complex state, or ensuring accessibility (ARIA, keyboard navigation). Applies when working with shadcn, Tailwind, components, layouts, dark mode, or a11y.
---

# UI Agent — shadcn/ui + Tailwind Specialist

Apply this skill when building or reviewing UI: complex components, layouts, dark mode, animations, and accessibility.

## When to intervene

- **Complex components**: Forms, data tables, wizards, multi-step flows
- **Layouts and grids**: Page structure, responsive breakpoints, spacing systems
- **Dark mode**: Theme switching, CSS variables, contrast
- **Animations / complex state**: Transitions, loading states, optimistic UI
- **Accessibility**: ARIA, keyboard navigation, focus management, screen readers

## Always apply

### Architecture

- **Server Components by default**; add `"use client"` only when the component needs hooks, event handlers, or browser APIs.
- Use **`cn()`** (from `@/lib/utils` or shadcn) for conditional classes; never long ternary class strings.
- Use **`cva()`** (class-variance-authority) for component variants (e.g. button sizes, card styles).

### States

- **Loading**: Prefer Skeleton loaders from shadcn (`Skeleton`) over spinners for content placeholders.
- **Empty**: Always provide descriptive empty states (message + optional CTA), never blank areas.
- **Error**: Error states must offer a clear message and a **retry** (or “try again”) action when applicable.

### Layout and design

- **Mobile-first**: Base styles for small viewports; use `sm:`, `md:`, `lg:` for larger screens.
- **Tailwind only**: Use Tailwind utility classes; avoid inline styles or extra CSS files unless strictly needed (e.g. keyframes).

### Accessibility

- Use semantic HTML (`button`, `nav`, `main`, `section`, headings in order).
- Add ARIA where behavior isn’t obvious: `aria-label`, `aria-expanded`, `aria-current`, `role` when needed.
- Ensure **keyboard navigation**: focusable elements reachable by Tab, no focus traps unless intentional (e.g. modals).
- Maintain **focus visibility** (e.g. `focus-visible:ring-2`); avoid removing outline without a visible focus style.

## Quick reference

### Conditional classes

```tsx
import { cn } from '@/lib/utils'

<div className={cn('base', isActive && 'active', className)} />
```

### Component variants with cva

```tsx
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-lg border', {
  variants: {
    variant: { default: 'bg-card', muted: 'bg-muted/50' },
    padding: { none: 'p-0', sm: 'p-3', md: 'p-4' },
  },
  defaultVariants: { variant: 'default', padding: 'md' },
})

export function Card({ className, variant, padding, ...props }) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
}
```

### Loading skeleton

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Use for content that is loading
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>
```

### Empty and error states

```tsx
// Empty: message + optional action
<div className="flex flex-col items-center justify-center py-12 text-center">
  <p className="text-muted-foreground">No items yet.</p>
  <Button variant="outline" className="mt-4">Create first</Button>
</div>

// Error: message + retry
<div className="flex flex-col items-center justify-center py-12 text-center">
  <p className="text-destructive">Something went wrong.</p>
  <Button variant="outline" className="mt-4" onClick={onRetry}>Try again</Button>
</div>
```

### Dark mode (CSS variables)

Rely on theme variables so dark mode “just works” with `dark:` where needed:

```tsx
// Prefer semantic tokens
className="bg-background text-foreground border border-border"

// Override for dark when necessary
className="bg-background dark:bg-background/95"
```

## Checklist before finishing UI work

- [ ] Server Component unless hooks/events/browser API required
- [ ] `cn()` for conditional classes; `cva()` for variant-heavy components
- [ ] Skeleton for loading; descriptive empty state; error state with retry
- [ ] Mobile-first Tailwind; no inline styles or extra CSS unless needed
- [ ] Semantic HTML and ARIA where needed; keyboard and focus handled
