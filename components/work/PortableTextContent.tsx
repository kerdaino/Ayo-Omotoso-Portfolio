import type { ReactNode } from "react";

import type { AllProjectsQueryResult } from "@/sanity/sanity.types";

type PortableTextValue = NonNullable<
  AllProjectsQueryResult[number][
    | "projectContext"
    | "brief"
    | "role"
    | "strategicApproach"
    | "execution"
    | "verifiedResults"
  ]
>;

type PortableTextContentProps = {
  value: PortableTextValue;
};

function blockText(block: PortableTextValue[number]) {
  return block.children?.map((child) => child.text ?? "").join("") ?? "";
}

export function hasPortableText(value: PortableTextValue | null | undefined) {
  return Boolean(value?.some((block) => blockText(block).trim()));
}

export function PortableTextContent({ value }: PortableTextContentProps) {
  const content: ReactNode[] = [];
  let index = 0;

  while (index < value.length) {
    const block = value[index];
    const text = blockText(block).trim();

    if (!text) {
      index += 1;
      continue;
    }

    if (block.listItem) {
      const listType = block.listItem;
      const items: Array<{ key: string; text: string }> = [];

      while (index < value.length && value[index].listItem === listType) {
        const listBlock = value[index];
        const listText = blockText(listBlock).trim();

        if (listText) {
          items.push({ key: listBlock._key, text: listText });
        }

        index += 1;
      }

      const List = listType === "number" ? "ol" : "ul";
      content.push(
        <List key={`list-${items[0]?.key ?? index}`}>
          {items.map((item) => (
            <li key={item.key}>{item.text}</li>
          ))}
        </List>,
      );
      continue;
    }

    if (block.style === "h2") {
      content.push(<h3 key={block._key}>{text}</h3>);
    } else if (block.style === "h3") {
      content.push(<h4 key={block._key}>{text}</h4>);
    } else {
      content.push(<p key={block._key}>{text}</p>);
    }

    index += 1;
  }

  return <>{content}</>;
}
