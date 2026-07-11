/**
 * Everything about you in one place. Edit freely — the whole site reads from here.
 */
export const profile = {
  name: "Shivansh Singh",
  firstName: "Shivansh",
  role: "Full-stack + AI engineer",
  education: "B.Tech ’26, NIT Hamirpur",
  batch: "’26 batch",
  location: "India (IST)",
  timezone: "Asia/Kolkata",
  email: "singhshivansh12may@gmail.com",
  githubUser: "shivanshsin0203",
  leetcodeUser: "singhshivansh12may",
  headline: ["Fresh out of college.", "Already in production."],
  intro:
    "I'm Shivansh, a ’26 batch engineer from NIT Hamirpur. Instead of a resume full of adjectives, here are three products I built and run myself — and a page that checks on them live while you read it.",
  hireLine: "open to work",
  links: {
    x: "https://x.com/ShivanshSi0203",
    github: "https://github.com/shivanshsin0203",
    linkedin: "https://www.linkedin.com/in/shivansh-singh-736521289/",
    leetcode: "https://leetcode.com/u/singhshivansh12may/",
    source: "https://github.com/shivanshsin0203/portfolio_",
  },
  /** Used for metadata + llms.txt. Set NEXT_PUBLIC_SITE_URL in prod. */
  siteName: "Shivansh Singh — System Specification",
  docRev: "REV 2026.07",
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
