import { client } from '@/sanity/client';
import { projectsQuery } from "./queries/projects-query";
import HomeClient from './components/home-client';

const options = { next: { revalidate: 30 } };

const CATEGORIES_QUERY = `
*[_type == "category"] {
  _id,
  title,
  "slug": slug.current
}
`;

export default async function Home() {
  const [projects, categories] = await Promise.all([
    client.fetch(projectsQuery, {}, options),
    client.fetch(CATEGORIES_QUERY),
  ]);

  return <HomeClient projects={projects} categories={categories} />;

}