import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "edge";
export const revalidate = 86400; // 1 dia para export estático

export default function OGImage() {
  const gradient = "linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage: gradient,
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "80px",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 800,
              marginBottom: 16,
              textShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            Abel Magnago
          </div>
          <div
            style={{
              fontSize: 36,
              opacity: 0.95,
              marginBottom: 28,
              textShadow: "0 4px 16px rgba(0,0,0,0.35)",
            }}
          >
            Desenvolvedor Full Stack — React, Next.js, Node.js, TypeScript, AWS
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontSize: 28,
              padding: "10px 18px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.15)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#22c55e",
                boxShadow: "0 0 0 6px rgba(34,197,94,0.35)",
              }}
            />
            <span>abel.dev.br</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
