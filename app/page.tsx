import Image from "next/image";
import React from "react";

interface Asset {
  sys: { id: string };
  fields: { file: { url: string } };
}

interface RichTextContent {
  nodeType: string;
  content: RichTextContent[];
  value?: string;
}

interface BlogItem {
  fields: {
    title: string;
    body: {
      content: RichTextContent[];
    };
    image: { sys: { id: string } };
  };
}

interface Data {
  items: BlogItem[];
  includes: { Asset: Asset[] };
}

// Basic implementation for rich text rendering
function documentToReactComponents(document: { content: RichTextContent[] } | undefined): React.ReactNode {
  if (!document || !document.content) return null;
  return document.content.map((node, idx) => {
    switch (node.nodeType) {
      case "paragraph":
        return <p key={idx}>{node.content.map((c) => c.value ?? "").join("")}</p>;
      case "heading-1":
        return <h1 key={idx}>{node.content.map((c) => c.value ?? "").join("")}</h1>;
      case "heading-2":
        return <h2 key={idx}>{node.content.map((c) => c.value ?? "").join("")}</h2>;
      default:
        return null;
    }
  });
}

const url = `${process.env.BASE_URL}/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}&content_type=blog`;

export default async function Home() {
  const response = await fetch(url, { cache: "no-store" });
  const data: Data = await response.json();

  return (
    <main>
      {data.items.map((a, index) => {
        const image = data.includes.Asset.find(
          (asset) => asset.sys.id === a.fields.image.sys.id
        );

        return (
          <div key={index} className="px-24 mx-auto">
            <h1 className="text-3xl font-bold py-4 ">{a.fields.title}</h1>
            <div className="py-4 ">
              {documentToReactComponents(a.fields.body)}
            </div>
            {image && (
              <Image
                src={"https:" + image.fields.file.url}
                width={500}
                height={500}
                alt="blogimage"
              />
            )}
          </div>
        );
      })}
    </main>
  );
}