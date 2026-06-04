import type { Metadata } from "next";
import { HomeLanding } from "@/components/home/HomeLanding";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PRODUCT_NAME } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Home",
  description: `${PRODUCT_NAME} — visual node editor for Suno AI music prompts. Open the canvas, browse your library, or read the help guide.`,
  pathname: "/home",
});

export default function HomePage() {
  return <HomeLanding />;
}
