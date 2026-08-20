import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the image's meaning for someone who cannot see it. Do not repeat the caption.",
      validation: (rule) => rule.required().min(3).max(220),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional visible context or approved credit.",
      validation: (rule) => rule.max(220),
    }),
  ],
  preview: {
    select: { media: "image", title: "caption", subtitle: "alt" },
    prepare({ media, title, subtitle }) {
      return {
        media,
        title: title || "Gallery image",
        subtitle,
      };
    },
  },
});

