import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { HELP_FAQ_ITEMS } from "@/lib/help-faq";
import { faqPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Help",
  description:
    "How to use BeatStack: nodes, connections, AI configuration, presets, sharing, workspaces, and keyboard shortcuts.",
  pathname: "/help",
});

export default function HelpPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-10 space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link href="/create" className="underline-offset-4 hover:underline">
            ← Back to editor
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Help</h1>
        <p className="text-muted-foreground">
          Guide for the BeatStack visual Suno prompt editor. This page is
          indexable for search engines and AI assistants.
        </p>
      </header>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-xl font-medium">
          Frequently asked questions
        </h2>
        <dl className="space-y-8">
          {HELP_FAQ_ITEMS.map((item) => (
            <div key={item.id}>
              <dt>
                <h3 className="text-base font-medium">{item.question}</h3>
              </dt>
              <dd className="mt-2 text-sm text-muted-foreground">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <JsonLd data={faqPageJsonLd()} />
    </article>
  );
}
