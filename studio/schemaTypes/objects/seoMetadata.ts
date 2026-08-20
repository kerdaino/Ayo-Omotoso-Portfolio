import { defineField, defineType } from "sanity";

export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "Search and sharing",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      description: "Aim for a clear title of about 50–60 characters.",
      validation: (rule) => rule.max(70).warning("Long titles may be shortened in search results."),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      description: "A factual summary for search and social sharing.",
      validation: (rule) =>
        rule.max(170).warning("Long descriptions may be shortened in search results."),
    }),
  ],
});

