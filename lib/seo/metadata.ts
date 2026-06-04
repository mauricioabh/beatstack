import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  PRODUCT_NAME,
  allowSearchIndexing,
  getSiteUrl,
} from "@/lib/seo/site";

export type PageMetadataInput = {
  title: string;
  description?: string;
  pathname: string;
  noIndex?: boolean;
};

function resolveTitle(title: string): string {
  return title === PRODUCT_NAME ? title : `${title} | ${PRODUCT_NAME}`;
}

function ogImageUrl(): string {
  return new URL(DEFAULT_OG_IMAGE_PATH, getSiteUrl()).href;
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  pathname,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonicalPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pageUrl = new URL(canonicalPath, getSiteUrl()).href;
  const resolvedTitle = resolveTitle(title);
  const indexingBlocked = noIndex || !allowSearchIndexing();
  const ogAlt = `${PRODUCT_NAME} — Suno prompt editor`;

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: canonicalPath },
    robots: indexingBlocked
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      siteName: PRODUCT_NAME,
      title: resolvedTitle,
      description,
      images: [
        {
          url: ogImageUrl(),
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [ogImageUrl()],
    },
  };
}

export function rootLayoutMetadata(): Metadata {
  const indexingBlocked = !allowSearchIndexing();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: PRODUCT_NAME,
      template: `%s | ${PRODUCT_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: PRODUCT_NAME,
    alternates: { canonical: "/" },
    robots: indexingBlocked
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: PRODUCT_NAME,
      title: PRODUCT_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: DEFAULT_OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: `${PRODUCT_NAME} — Suno prompt editor`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: PRODUCT_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      title: PRODUCT_NAME,
      statusBarStyle: "black-translucent",
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        {
          url: "/icons/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
  };
}
