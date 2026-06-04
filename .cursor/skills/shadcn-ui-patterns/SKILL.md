---
name: shadcn-ui-patterns
description: Applies shadcn/ui and Tailwind patterns for component installation, cn() and cva() usage, CSS variable theming, React Hook Form with Zod, loading/error/empty/success states, and next-themes dark mode. Use when building or refactoring UI with shadcn/ui, adding components, forms, or theming.
---

# shadcn/ui Patterns

Apply these patterns whenever building UI with shadcn/ui and Tailwind.

## Component installation

Never copy components manually. Always use the CLI:

```bash
npx shadcn@latest add [component]
```

## Conditional classes with cn()

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

## Variants with cva()

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva('base-styles', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
    },
    size: {
      default: 'h-10 px-4',
      sm: 'h-8 px-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})
```

### Component structure with variants

```tsx
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

## Theming with CSS variables

Use shadcn CSS variables only; never hardcode colors:

- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border`

## Forms with React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: {},
})
```

## States to always include

| State    | Use |
|----------|-----|
| Loading  | Skeleton from shadcn |
| Error    | Alert with `variant="destructive"` |
| Empty    | Descriptive message + CTA |
| Success  | Toast (Sonner) |

## Dark mode

- Use **next-themes** with `ThemeProvider` in the root layout.
- Never hardcode colors that break in dark mode; rely on theme variables and semantic tokens.
