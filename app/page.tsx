import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PRODUCT_NAME } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: PRODUCT_NAME,
  pathname: "/",
});

export default function RootPage() {
  redirect("/home");
}
