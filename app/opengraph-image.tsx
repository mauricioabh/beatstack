import { ImageResponse } from "next/og";
import { PRODUCT_NAME } from "@/lib/seo/site";

export const alt = `${PRODUCT_NAME} — Suno prompt editor`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #14121a 0%, #2a2438 50%, #14121a 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.75,
            marginBottom: 24,
          }}
        >
          Suno prompt builder
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
          {PRODUCT_NAME}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 36,
            lineHeight: 1.4,
            maxWidth: 900,
            opacity: 0.9,
          }}
        >
          Visual node editor for composing Suno AI music prompts
        </div>
      </div>
    ),
    { ...size },
  );
}
