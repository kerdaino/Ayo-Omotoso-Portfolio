import { defineField, defineType } from "sanity";

export const collaborator = defineType({
  name: "collaborator",
  title: "Collaborator / credit",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Person, team or organisation",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "role",
      title: "Credit / role",
      type: "string",
      description: "Use the approved credit wording only.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "url",
      title: "Public URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});

