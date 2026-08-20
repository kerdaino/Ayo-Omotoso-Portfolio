import { defineField, defineType } from "sanity";

const currentYear = new Date().getFullYear();

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  description: "A curated public timeline entry.",
  initialValue: { current: false, displayOrder: 100 },
  orderings: [
    {
      title: "Timeline order",
      name: "timelineOrder",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "startYear", direction: "desc" },
      ],
    },
  ],
  fields: [
    defineField({
      name: "organisation",
      title: "Organisation",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "startYear",
      title: "Start year",
      type: "number",
      validation: (rule) =>
        rule.required().integer().min(1990).max(currentYear + 1),
    }),
    defineField({
      name: "endYear",
      title: "End year",
      type: "number",
      hidden: ({ parent }) => Boolean(parent?.current),
      validation: (rule) =>
        rule.integer().min(1990).max(currentYear + 1).custom((value, context) => {
          const parent = context.parent as
            | { current?: boolean; startYear?: number }
            | undefined;

          if (parent?.current && value) {
            return "Remove the end year for a current role.";
          }

          if (!parent?.current && !value) {
            return "Add an end year or mark this as a current role.";
          }

          if (value && parent?.startYear && value < parent.startYear) {
            return "End year cannot be earlier than start year.";
          }

          return true;
        }),
    }),
    defineField({
      name: "current",
      title: "Current role",
      type: "boolean",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      description: "Use only an approved public description.",
      validation: (rule) => rule.max(420),
    }),
    defineField({
      name: "location",
      title: "Public location",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "role",
      organisation: "organisation",
      startYear: "startYear",
      endYear: "endYear",
      current: "current",
    },
    prepare({ title, organisation, startYear, endYear, current }) {
      const dates = startYear
        ? `${startYear}–${current ? "Present" : endYear || "?"}`
        : "Dates awaiting confirmation";

      return {
        title: title || "Untitled role",
        subtitle: [organisation, dates].filter(Boolean).join(" / "),
      };
    },
  },
});
