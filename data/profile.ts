/**
 * Everything about you in one place. Edit freely — the whole site reads from here.
 */
export const profile = {
  name: "Shivansh Singh",
  firstName: "Shivansh",
  role: "Full-stack engineer, AI-product builder",
  education: "B.Tech, NIT Hamirpur — Class of 2026",
  location: "India (IST)",
  timezone: "Asia/Kolkata",
  email: "singhshivansh12may@gmail.com",
  githubUser: "shivanshsin0203",
  leetcodeUser: "singhshivansh12may",
  headline: ["Claims are cheap.", "Ping my servers."],
  intro:
    "I'm Shivansh — a full-stack engineer out of NIT Hamirpur, class of 2026. I've shipped three AI-heavy products to real domains, and this page monitors them live. A portfolio should be evidence, not adjectives.",
  links: {
    x: "https://x.com/ShivanshSi0203",
    github: "https://github.com/shivanshsin0203",
    linkedin: "https://www.linkedin.com/in/shivansh-singh-736521289/",
    leetcode: "https://leetcode.com/u/singhshivansh12may/",
  },
  /** Used for metadata + llms.txt. Set NEXT_PUBLIC_SITE_URL in prod. */
  siteName: "Shivansh Singh — System Specification",
  docRev: "REV 2026.07",
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
