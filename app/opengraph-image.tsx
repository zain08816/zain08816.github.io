import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export const alt = `${siteConfig.siteTitle} — ${siteConfig.bio}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const WIN95 = {
  desktop: "#008080",
  face: "#c0c0c0",
  highlight: "#ffffff",
  shadow: "#404040",
  border: "#000000",
  titleBar: "#000080",
  titleFg: "#ffffff",
  terminalBg: "#1a1a1a",
  terminalFg: "#e4e4e4",
  terminalMuted: "#a8a8a8",
  terminalAccent: "#00c0c0",
} as const;

const raisedShadow = `inset 2px 2px 0 ${WIN95.highlight}, inset -2px -2px 0 ${WIN95.shadow}`;

function TitleBarButton({ glyph }: { glyph: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 32,
        background: WIN95.face,
        boxShadow: raisedShadow,
        color: "#000",
        fontSize: 22,
        fontWeight: 900,
        fontFamily: "monospace",
      }}
    >
      {glyph}
    </div>
  );
}

export default function Image() {
  const prompt = `${siteConfig.shellUser}@${siteConfig.hostname}:~$`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: WIN95.desktop,
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 55%)",
          fontFamily: "monospace",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 1060,
            background: WIN95.face,
            border: `2px solid ${WIN95.border}`,
            boxShadow: `10px 10px 0 rgba(0,0,0,0.35), ${raisedShadow}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: WIN95.titleBar,
              color: WIN95.titleFg,
              padding: "8px 10px",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 0.2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  width: 22,
                  height: 22,
                  background: WIN95.face,
                  border: `1px solid ${WIN95.border}`,
                  boxShadow: raisedShadow,
                }}
              />
              <span>{`C:\\${siteConfig.hostname} — Terminal`}</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <TitleBarButton glyph="_" />
              <TitleBarButton glyph="□" />
              <TitleBarButton glyph="×" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: 8,
              background: WIN95.face,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                background: WIN95.terminalBg,
                color: WIN95.terminalFg,
                padding: "44px 52px",
                fontFamily: "monospace",
                fontSize: 26,
                lineHeight: 1.35,
                boxShadow: `inset 2px 2px 0 ${WIN95.shadow}, inset -2px -2px 0 ${WIN95.highlight}`,
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 14 }}>
                <span style={{ color: WIN95.terminalAccent }}>{prompt}</span>
                <span style={{ color: WIN95.terminalFg }}>whoami</span>
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#ffffff",
                  fontSize: 104,
                  fontWeight: 800,
                  letterSpacing: -2,
                  margin: "6px 0 14px",
                }}
              >
                {siteConfig.siteTitle}
              </div>

              <div style={{ display: "flex", gap: 14 }}>
                <span style={{ color: WIN95.terminalAccent }}>{prompt}</span>
                <span style={{ color: WIN95.terminalFg }}>about</span>
              </div>
              <div
                style={{
                  display: "flex",
                  color: WIN95.terminalFg,
                  fontSize: 30,
                }}
              >
                {siteConfig.bio} · a retro desktop you can kind of use.
              </div>
              <div
                style={{
                  display: "flex",
                  color: WIN95.terminalMuted,
                  fontSize: 26,
                }}
              >
                Windows 95 · macOS · System 7 — try `help` once it loads.
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 14,
                }}
              >
                <span style={{ color: WIN95.terminalAccent }}>{prompt}</span>
                <div
                  style={{
                    display: "flex",
                    width: 16,
                    height: 30,
                    background: WIN95.terminalFg,
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: WIN95.face,
              color: "#000",
              fontSize: 18,
              fontWeight: 700,
              borderTop: `1px solid ${WIN95.shadow}`,
            }}
          >
            <span>{siteConfig.hostname}</span>
            <span>{siteConfig.tagline}</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
