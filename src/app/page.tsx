import { client } from '@/sanity/client';
import Gallery, { type ProjectItem } from './components/gallery';

export const revalidate = 60;

const query = `*[_type == "project"] | order(publishedAt desc){
  title,
  slug,
  code,
  images[]{asset->{_id,url}},
  categories[]-> { title }
}`;

export default async function Home() {
  const projects = await client.fetch<ProjectItem[]>(query);

  return <Gallery projects={projects} />;
}