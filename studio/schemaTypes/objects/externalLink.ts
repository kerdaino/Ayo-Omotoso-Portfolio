import { defineField, defineType } from "sanity";

export const externalLink = defineType({
  name: "externalLink",
  title: "Public link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Link label",
      type: "string",
      description: "Plain-language text visitors will understand.",
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});

