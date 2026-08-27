import { defineArrayMember, defineField, defineType } from "sanity";

import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "../../../sanity/constants";

const currentYear = new Date().getFullYear();

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  description: "A portfolio case study or clearly labelled concept/pitch.",
  groups: [
    { name: "identity", title: "Project details", default: true },
    { name: "story", title: "Story" },
    { name: "media", title: "Media & links" },
    { name: "display", title: "Portfolio display" },
  ],
  initialValue: {
    displayOrder: 100,
    featured: false,
  },
  orderings: [
    {
      title: "Portfolio order",
      name: "portfolioOrder",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Year, newest first",
      name: "yearDescending",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required().min(2).max(140),
    }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "identity",
      description: "Generate from the title, then check it before publishing.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client / brand",
      type: "string",
      group: "identity",
      description: "Use only the approved public client or brand name.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "identity",
      validation: (rule) =>
        rule.integer().min(2000).max(currentYear + 2),
      description:
        "Use only a verified publication or completion year. Leave blank when the exact year is not confirmed.",
    }),
    defineField({
      name: "category",
      title: "Main category",
      type: "string",
      group: "identity",
      options: { list: [...PROJECT_CATEGORIES], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "workType",
      title: "Work type",
      type: "string",
      group: "identity",
      description: "For example: brand strategy, campaign, cover art, or location sourcing.",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "status",
      title: "Editorial status",
      type: "string",
      group: "identity",
      description:
        "Choose the factual status. The website will preserve this wording and will not present pitches or concepts as completed work.",
      options: { list: [...PROJECT_STATUSES], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortSummary",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "story",
      description: "A factual introduction for project listings.",
      validation: (rule) => rule.required().min(20).max(320),
    }),
    defineField({
      name: "projectContext",
      title: "Project context",
      type: "portableText",
      group: "story",
    }),
    defineField({
      name: "brief",
      title: "Brief / problem",
      type: "portableText",
      group: "story",
    }),
    defineField({
      name: "role",
      title: "Ayo's role",
      type: "portableText",
      group: "story",
      description: "State Ayo's own contribution precisely.",
    }),
    defineField({
      name: "strategicApproach",
      title: "Strategic approach / creative idea",
      type: "portableText",
      group: "story",
    }),
    defineField({
      name: "execution",
      title: "Execution / deliverables",
      type: "portableText",
      group: "story",
    }),
    defineField({
      name: "verifiedResults",
      title: "Verified results / outcome",
      type: "portableText",
      group: "story",
      description:
        "Enter only outcomes that can be verified and fairly attributed. Do not present a customer's company-wide figures as Ayo's personal achievement.",
    }),
    defineField({
      name: "collaborators",
      title: "Collaborators / credits",
      type: "array",
      group: "story",
      description: "Use approved names and credit wording only.",
      of: [defineArrayMember({ type: "collaborator" })],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverAlt",
      title: "Cover image alternative text",
      type: "string",
      group: "media",
      description: "Required whenever a cover image is supplied.",
      validation: (rule) =>
        rule.max(220).custom((value, context) => {
          const parent = context.parent as { coverImage?: unknown } | undefined;
          return parent?.coverImage && !value?.trim()
            ? "Add alternative text for the cover image."
            : true;
        }),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "galleryImage" })],
    }),
    defineField({
      name: "videoUrl",
      title: "Public video URL",
      type: "url",
      group: "media",
      description: "Use a public HTTPS page or video URL only.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "externalLinks",
      title: "Public project links",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "externalLink" })],
    }),
    defineField({
      name: "featured",
      title: "Feature on the portfolio",
      type: "boolean",
      group: "display",
      description: "Featured projects can appear in the primary work selection.",
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      group: "display",
      description: "Lower numbers appear first. Projects with the same number fall back to title order.",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      category: "category",
      status: "status",
      year: "year",
      media: "coverImage",
    },
    prepare({ title, client, category, status, year, media }) {
      const categoryTitle =
        PROJECT_CATEGORIES.find((item) => item.value === category)?.title || category;
      const statusTitle =
        PROJECT_STATUSES.find((item) => item.value === status)?.title || status;
      const details = [client, categoryTitle, statusTitle, year]
        .filter(Boolean)
        .join(" / ");

      return {
        title: title || "Untitled project",
        subtitle: details || "Project details not yet complete",
        media,
      };
    },
  },
});
