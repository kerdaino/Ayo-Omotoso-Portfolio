export const siteProfile = {
  publicName: "Ayomi Omotoso",
  professionalTitle: "Creative Brand Strategist",
  heroStatement: "One Strategic Mind, Many Worlds.",
  supportingLine:
    "I shape ideas, campaigns and experiences across culture and commerce.",
  email: "ayomiiomotoso@gmail.com",
  linkedIn: "https://linkedin.com/ayomiomotoso",
} as const;

export const siteDescription =
  "The portfolio of Ayomi Omotoso, a Creative Brand Strategist working across culture and commerce.";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://ayomiomotoso.com",
);

export function canonicalUrl(pathname = "/") {
  return new URL(pathname, siteUrl).toString();
}
