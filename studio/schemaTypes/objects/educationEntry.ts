import { defineField, defineType } from "sanity";

export const educationEntry = defineType({
  name: "educationEntry",
  title: "Education entry",
  type: "object",
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (rule) => rule.required().min(2).max(160),
    }),
    defineField({
      name: "qualification",
      title: "Programme / qualification",
      type: "string",
      validation: (rule) => rule.required().min(2).max(160),
    }),
    defineField({
      name: "focus",
      title: "Focus / field",
      type: "string",
      description: "Optional verified specialisation or field of study.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "completion",
      title: "Completion date",
      type: "string",
      description: "Use the verified public month and year only.",
      validation: (rule) => rule.required().min(4).max(40),
    }),
  ],
  preview: {
    select: {
      title: "institution",
      qualification: "qualification",
      completion: "completion",
    },
    prepare({ title, qualification, completion }) {
      return {
        title: title || "Education entry",
        subtitle: [qualification, completion].filter(Boolean).join(" / "),
      };
    },
  },
});
