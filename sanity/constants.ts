export const PROJECT_CATEGORIES = [
  { title: "Culture / Entertainment", value: "culture" },
  { title: "B2B / Technology", value: "b2b" },
] as const;

export const PROJECT_STATUSES = [
  { title: "Completed", value: "completed" },
  { title: "In progress", value: "in-progress" },
  { title: "Concept", value: "concept" },
  { title: "Pitch", value: "pitch" },
] as const;

export const PROJECT_SKILLS = [
  "Creative Direction & Brand Strategy",
  "Copywriting & Customer Storytelling",
  "Set Design & Experiential",
  "Brand Partnerships",
] as const;

export const SOCIAL_PLATFORMS = [
  { title: "LinkedIn", value: "linkedin" },
  { title: "Instagram", value: "instagram" },
  { title: "YouTube", value: "youtube" },
  { title: "Vimeo", value: "vimeo" },
  { title: "TikTok", value: "tiktok" },
  { title: "X", value: "x" },
  { title: "Other website", value: "website" },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]["value"];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]["value"];
export type ProjectSkill = (typeof PROJECT_SKILLS)[number];

