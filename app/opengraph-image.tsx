import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export const alt = `${profile.name} — ${profile.headline.join(" ")}`;
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
          background: "#0b0f13",
          color: "#c4ced7",
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        {/* titlebar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            color: "#6d7a86",
            textTransform: "uppercase",
          }}
        >
          <span>Singh, Shivansh — system specification</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 99,
                background: "#3fd99b",
                display: "flex",
              }}
            />
            <span style={{ color: "#3fd99b" }}>LIVE</span>
          </span>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: "#f3f4f0",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            {profile.headline[0]}
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: "#5b73ff",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            {profile.headline[1]}
          </div>
        </div>

        {/* products */}
        <div style={{ display: "flex", gap: 36, fontSize: 24 }}>
          {projects.map((p) => (
            <span key={p.slug} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 99,
                  background: "#3fd99b",
                  display: "flex",
                }}
              />
              {p.domain}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 20, color: "#6d7a86" }}>
          full-stack + AI engineer · NIT Hamirpur ’26 · this page monitors my products live
        </div>
      </div>
    ),
    { ...size },
  );
}
