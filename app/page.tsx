import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";

const url = `${process.env.BASE_URL}/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}&content_type=blog`;
// console.log(url)

export default async function Home() {
  const response = await fetch(url, {
    cache: "no-store",
  });
  const data = await response.json();

return (
  <main>
    {data.items.map((a: any, index: number) => {
      const image = data.includes.Asset.find((asset: any) =>
        asset.sys.id === a.fields.image.sys.id
      );
      // console.log(image.fields.file.url)

      return (
        <div key={index} className="px-24 mx-auto">
          <h1 className="text-3xl font-bold py-4 ">{a.fields.title}</h1>
          <div className="py-4 ">
            {documentToReactComponents(a.fields.body)}
          </div>
          <Image src={'https:'+image.fields.file.url} width={500}
            height={500}
            alt="blogimage"
          />
        </div>
      );
    })}
  </main>
);
}