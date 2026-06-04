import type { Metadata } from "next";
import { LibraryPage } from "@/components/library/LibraryPage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Library history",
  description:
    "View prompt history and saved generations in your BeatStack library.",
  pathname: "/library/history",
});

export default function LibraryHistoryRoute() {
  return <LibraryPage />;
}
