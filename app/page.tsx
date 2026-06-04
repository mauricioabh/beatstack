import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PRODUCT_NAME } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: PRODUCT_NAME,
  pathname: "/",
});

export default function HomePage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">{PRODUCT_NAME}</h1>
        <p className="text-lg text-muted-foreground">
          Node-based visual editor for composing Suno AI music prompts. Connect
          genre, mood, instruments, BPM, vocals, and structure into one
          shareable prompt graph.
        </p>
      </header>

      <nav
        className="mt-10 flex flex-wrap gap-4"
        aria-label="Primary actions"
      >
        <Link
          href="/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open editor
        </Link>
        <Link
          href="/help"
          className="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium hover:bg-muted"
        >
          Help &amp; FAQ
        </Link>
        <Link
          href="/library"
          className="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium hover:bg-muted"
        >
          Library
        </Link>
      </nav>
    </article>
  );
}
