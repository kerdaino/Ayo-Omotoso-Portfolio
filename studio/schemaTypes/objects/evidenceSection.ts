import { defineArrayMember, defineField, defineType } from "sanity";

export const evidenceSection = defineType({
  name: "evidenceSection",
  title: "Project evidence section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Context / attribution",
      type: "text",
      rows: 3,
      description:
        "Label reference boards as third-party inspiration; distinguish proposals from executed work.",
    }),
    defineField({
      name: "images",
      title: "Ordered images / slides",
      type: "array",
      of: [defineArrayMember({ type: "galleryImage" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "publicApproved",
      title: "Cleared for public presentation",
      type: "boolean",
      initialValue: false,
      description:
        "Enable only after checking privacy, attribution and public-use permission. Unapproved sections are excluded from public queries.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0.image",
      approved: "publicApproved",
    },
    prepare: ({ title, media, approved }) => ({
      title,
      media,
      subtitle: approved
        ? "Public presentation"
        : "Not cleared for publication",
    }),
  },
});
