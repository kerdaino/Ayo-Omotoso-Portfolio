import type { StructureResolver } from "sanity/structure";

export const portfolioStructure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio content")
    .items([
      S.listItem()
        .id("profile")
        .title("Ayomi's profile")
        .child(S.document().schemaType("profile").documentId("profile")),
      S.divider(),
      S.listItem()
        .title("Projects")
        .child(
          S.list()
            .title("Projects")
            .items([
              S.documentTypeListItem("project").title("All projects"),
              S.listItem()
                .title("Featured projects")
                .child(
                  S.documentList()
                    .title("Featured projects")
                    .schemaType("project")
                    .filter('_type == "project" && featured == true')
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
              S.listItem()
                .title("Culture / Entertainment")
                .child(
                  S.documentList()
                    .title("Culture / Entertainment")
                    .schemaType("project")
                    .filter('_type == "project" && category == "culture"')
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
              S.listItem()
                .title("B2B / Technology")
                .child(
                  S.documentList()
                    .title("B2B / Technology")
                    .schemaType("project")
                    .filter('_type == "project" && category == "b2b"')
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title("In progress")
                .child(
                  S.documentList()
                    .title("In-progress projects")
                    .schemaType("project")
                    .filter('_type == "project" && status == "in-progress"'),
                ),
              S.listItem()
                .title("Concepts")
                .child(
                  S.documentList()
                    .title("Concepts")
                    .schemaType("project")
                    .filter('_type == "project" && status == "concept"'),
                ),
              S.listItem()
                .title("Pitches")
                .child(
                  S.documentList()
                    .title("Pitches")
                    .schemaType("project")
                    .filter('_type == "project" && status == "pitch"'),
                ),
            ]),
        ),
      S.documentTypeListItem("experience").title("Experience timeline"),
      S.documentTypeListItem("socialLink").title("Social links"),
    ]);
