import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon — same mark as the favicon, full bleed (Apple rounds it). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f13",
          color: "#f3f4f0",
          fontSize: 116,
          fontWeight: 800,
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        S
        <div
          style={{
            position: "absolute",
            right: 28,
            top: 28,
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "#3fd99b",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
