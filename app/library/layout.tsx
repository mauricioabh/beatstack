import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Library",
  description:
    "Browse BeatStack workspaces and saved prompt generations stored in your browser.",
  pathname: "/library",
});

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
