import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/helper';
import { PortableText } from 'next-sanity';
import type { Metadata } from 'next';

interface ProjectProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: ProjectProps): Promise<Metadata> {
  const params = await props.params;
  const project = await client.fetch(
    `*[_type=="project" && slug.current == $slug][0]{title, slug, categories[]->{title}}`,
    { slug: params.slug }
  );
  return { title: project?.title ?? 'Proyecto' };
}

export default async function ProjectPage(props: ProjectProps) {
  const params = await props.params;
  const project = await client.fetch(
    `*[_type=="project" && slug.current == $slug][0]{
      title,
      images[]{asset->{_id,url}},
      categories[]-> { title },
      body
    }`,
    { slug: params.slug }
  );

  if (!project) return <p>Proyecto no encontrado</p>;

  return (
    <main className="container mx-auto p-2">
      <h1>{project.title}</h1>
      {project.categories.length > 0 && (
        <p>Categoría: {project.categories[0].title}</p>
      )}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {project.images.map((img: any) => (
          <img
            key={img.asset._id}
            src={urlFor(img).width(800).url()}
            alt={project.title}
            className="w-full object-cover"
          />
        ))}
      </div>
      {project.body && (
        <PortableText value={project.body} />
      )}
    </main>
  );
}