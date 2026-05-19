import { client } from "@/sanity/client";
import AboutClient from "./about-client";

const ABOUT_QUERY = `{
  "about": *[_type == "about"][0] {
    title,
    description,
    listening[] {
      label,
      url
    },
    clients,
    contactLinks[] {
      label,
      url
    }
  },
  "latestUpdate": *[!(_id in path("drafts.**")) && !(_type match "system.*") && !(_type match "sanity.*")] | order(_updatedAt desc)[0]._updatedAt
}`;

export default async function About() {
  const data = await client.fetch(ABOUT_QUERY);

  if (!data?.about) return null;

  return <AboutClient data={data} />;
}