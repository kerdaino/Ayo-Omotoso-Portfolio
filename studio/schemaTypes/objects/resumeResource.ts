import { defineField, defineType } from "sanity";

export const resumeResource = defineType({
  name: "resumeResource",
  title: "Résumé",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "PDF file",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "externalUrl",
      title: "Approved external résumé URL",
      type: "url",
      description: "Use this instead of uploading a file when appropriate.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true;

      return value.file || value.externalUrl
        ? true
        : "Add a PDF file or an approved external URL, or remove this résumé section.";
    }),
});

