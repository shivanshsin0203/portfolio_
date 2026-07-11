import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { profile, siteUrl } from "@/data/profile";
import { projects } from "@/data/projects";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const title = `${profile.name} — ${profile.headline.join(" ")}`;
const description = `${profile.role}. ${projects.length} products in production — ${projects
  .map((p) => p.domain)
  .join(", ")} — monitored live on this page. ${profile.education}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    "Shivansh Singh",
    "full-stack engineer",
    "AI engineer",
    "NIT Hamirpur",
    "Next.js",
    "Cloudflare Durable Objects",
    "portfolio",
    "GitDocs",
    "SquadWars",
    "PriceAlert",
  ],
  authors: [{ name: profile.name, url: profile.links.github }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: profile.siteName,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@ShivanshSi0203",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: siteUrl },
  other: {
    // A hint for AI crawlers that a machine-readable summary exists.
    "llms-txt": `${siteUrl}/llms.txt`,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  jobTitle: "Full-stack Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "National Institute of Technology, Hamirpur",
  },
  sameAs: [
    profile.links.x,
    profile.links.github,
    profile.links.linkedin,
    profile.links.leetcode,
  ],
  knowsAbout: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Cloudflare Workers",
    "Durable Objects",
    "Redis",
    "PostgreSQL",
    "LLM product engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          // Set the theme before first paint so there is no flash.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.dataset.theme="dark"}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
