import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  HelpCircle,
  Library,
  Share2,
  Sparkles,
} from "lucide-react";
import { BeatStackMark } from "@/components/brand/beatstack-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const brandTitleClass =
  "font-[family-name:var(--font-beatstack-brand)] text-4xl font-bold tracking-[-0.04em] sm:text-5xl";

const HIGHLIGHTS = [
  {
    icon: GitBranch,
    text: "Connect genre, mood, BPM, vocals, and structure in one graph",
  },
  {
    icon: Share2,
    text: "Share and import graphs with a link or JSON",
  },
  {
    icon: Sparkles,
    text: "Presets and AI-assisted nodes to speed up your workflow",
  },
] as const;

export function HomeLanding() {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="size-[min(28rem,80vw)] rounded-full bg-gradient-to-br from-violet-600/25 via-fuchsia-600/15 to-transparent blur-3xl dark:from-violet-500/20 dark:via-fuchsia-500/10" />
      </div>

      <article className="relative w-full max-w-lg text-center">
        <header className="flex flex-col items-center gap-6">
          <BeatStackMark
            size={72}
            className="shadow-md ring-1 ring-white/15"
            idPrefix="home-hero"
          />
          <div className="space-y-3">
            <h1 className={brandTitleClass}>
              <span className="text-foreground">Beat</span>
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
                Stack
              </span>
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Node-based visual editor for composing Suno AI music prompts.
              Build one shareable prompt graph from your canvas.
            </p>
          </div>
        </header>

        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          aria-label="Primary actions"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/create">
              Open editor
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/help">
              <HelpCircle className="size-4" aria-hidden />
              Help &amp; FAQ
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/library">
              <Library className="size-4" aria-hidden />
              Library
            </Link>
          </Button>
        </nav>

        <ul className="mt-12 space-y-3 text-left">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                  "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-400 dark:text-violet-300",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="pt-1 leading-snug">{text}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
