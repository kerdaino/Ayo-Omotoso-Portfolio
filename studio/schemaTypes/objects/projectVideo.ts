import { defineField, defineType } from "sanity";
export const projectVideo = defineType({
  name: "projectVideo",
  title: "Project video",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster / thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "posterAlt",
      title: "Poster alternative text",
      type: "string",
    }),
    defineField({
      name: "playbackUrl",
      title: "Public playback source",
      type: "url",
      description:
        "Approved public YouTube, Vimeo or hosted MP4. Never a private Drive source.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom((value) =>
            value && /(?:drive|docs)\.google\.com/i.test(value)
              ? "Use a public streaming source, not Drive."
              : true,
          ),
    }),
    defineField({ name: "caption", type: "text", rows: 2 }),
    defineField({
      name: "displayOrder",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "publicApproved",
      title: "Playback and publication verified",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "title", media: "poster" } },
});
