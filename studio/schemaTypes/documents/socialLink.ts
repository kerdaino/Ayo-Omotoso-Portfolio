import { defineField, defineType } from "sanity";

import { SOCIAL_PLATFORMS } from "../../../sanity/constants";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "document",
  description: "A public social profile or portfolio link.",
  initialValue: { displayOrder: 100, enabled: true },
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "label", direction: "asc" },
      ],
    },
  ],
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: [...SOCIAL_PLATFORMS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Public label",
      type: "string",
      description: "For example, LinkedIn or Watch on YouTube.",
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "enabled",
      title: "Show this link",
      type: "boolean",
      description: "Disable a link to keep it in Studio without showing it publicly.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      platform: "platform",
      enabled: "enabled",
      url: "url",
    },
    prepare({ title, platform, enabled, url }) {
      const platformTitle =
        SOCIAL_PLATFORMS.find((item) => item.value === platform)?.title || platform;

      return {
        title: title || platformTitle || "Untitled social link",
        subtitle: `${enabled ? "Enabled" : "Hidden"}${url ? ` / ${url}` : ""}`,
      };
    },
  },
});

