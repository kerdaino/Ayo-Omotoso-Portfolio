import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  description: "Ayo's public identity and portfolio-wide information.",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "biography", title: "Biography" },
    { name: "media", title: "Portrait & résumé" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "Search & sharing" },
  ],
  initialValue: {
    publicName: "Ayo Omotoso",
    professionalTitle: "Creative Brand Strategist",
    heroStatement: "One Strategic Mind, Many Worlds.",
    supportingLine:
      "I shape ideas, campaigns and experiences across culture and commerce.",
  },
  fields: [
    defineField({
      name: "publicName",
      title: "Public name",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: "professionalTitle",
      title: "Professional title",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "heroStatement",
      title: "Hero statement",
      type: "string",
      group: "identity",
      description: "The leading portfolio statement. Keep it concise and truthful.",
      validation: (rule) => rule.required().min(5).max(120),
    }),
    defineField({
      name: "supportingLine",
      title: "Supporting line",
      type: "text",
      rows: 2,
      group: "identity",
      validation: (rule) => rule.required().min(10).max(220),
    }),
    defineField({
      name: "shortBio",
      title: "Short biography",
      type: "text",
      rows: 4,
      group: "biography",
      description: "A concise approved introduction for summaries.",
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "fullBio",
      title: "Full biography",
      type: "portableText",
      group: "biography",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitAlt",
      title: "Portrait alternative text",
      type: "string",
      group: "media",
      description: "Required whenever a portrait is supplied.",
      validation: (rule) =>
        rule.max(220).custom((value, context) => {
          const parent = context.parent as { portrait?: unknown } | undefined;
          return parent?.portrait && !value?.trim()
            ? "Add alternative text for the portrait."
            : true;
        }),
    }),
    defineField({
      name: "resume",
      title: "Public résumé",
      type: "resumeResource",
      group: "media",
    }),
    defineField({
      name: "email",
      title: "Public email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "linkedIn",
      title: "Primary LinkedIn link",
      type: "reference",
      group: "contact",
      description:
        "Select the LinkedIn entry from Social Links. Its URL is edited there once, not duplicated here.",
      to: [{ type: "socialLink" }],
      options: { filter: 'platform == "linkedin"' },
    }),
    defineField({
      name: "location",
      title: "Public location",
      type: "string",
      group: "contact",
      description: "Leave blank until the preferred public wording is approved.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "availabilityCta",
      title: "Availability / contact call to action",
      type: "string",
      group: "contact",
      description: "Optional approved contact prompt shown to visitors.",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "seo",
      title: "Search and sharing",
      type: "seoMetadata",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "publicName", subtitle: "professionalTitle", media: "portrait" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Ayo's profile", subtitle, media };
    },
  },
});

