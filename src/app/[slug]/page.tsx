import { client } from '@/sanity/client';
import type { Metadata } from 'next';
import ProjectPageClient, { type CategoryItem, type ProjectData, type ProjectListItem } from './page-client';

interface ProjectProps {
  params: Promise<{ slug: string }>;
}

const CATEGORIES_QUERY = `
*[_type == "category"] {
  _id,
  title,
  "slug": slug.current
}
`;

export async function generateMetadata(props: ProjectProps): Promise<Metadata> {
  const params = await props.params;
  const project = await client.fetch(
    `*[_type=="project" && slug.current == $slug][0]{title, slug, categories[]->{title, "slug": slug.current}}`,
    { slug: params.slug }
  );
  return { title: project?.title ?? 'Proyecto' };
}

export default async function ProjectPage(props: ProjectProps) {
  const params = await props.params;
  const [project, categories, projects] = await Promise.all([
    client.fetch<ProjectData | null>(
      `*[_type=="project" && slug.current == $slug][0]{
        title,
        code,
        "slug": slug.current,
        images[]{asset->{_id,url}},
        categories[]-> { title, "slug": slug.current },
        body
      }`,
      { slug: params.slug }
    ),
    client.fetch<CategoryItem[]>(CATEGORIES_QUERY),
    client.fetch<ProjectListItem[]>(
      `*[_type=="project"] | order(publishedAt desc){
        title,
        code,
        "slug": slug.current
      }`
    ),
  ]);

  if (!project) return <p>Proyecto no encontrado</p>;

  return <ProjectPageClient project={project} categories={categories} projects={projects} />;
}