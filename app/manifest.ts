import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.siteName,
    short_name: profile.firstName,
    description: `${profile.role}. Three products in production, monitored live on this page.`,
    start_url: "/",
    display: "browser",
    background_color: "#f3f4f0",
    theme_color: "#f3f4f0",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
