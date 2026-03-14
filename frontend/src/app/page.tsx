import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/helper';
import Link from 'next/link';

export const revalidate = 60;

const query = `*[_type == "project"] | order(publishedAt desc){
  title,
  slug,
  code,
  images[]{asset->{_id,url}},
  categories[]-> { title }
}`;

export default async function Home() {
  const projects = await client.fetch(query);

  return (
    <main className="overflow-x-auto whitespace-nowrap p-2">
      <div className="flex gap-2">
        {projects.map((project: any) => (
          <div
            key={project.slug.current}
            className="inline-block w-80 shrink-0 bg-white"
            data-category={project.categories[0]?.title || ''}
          >
            <p className="p-4 text-black font-mono">
              {project.code}.{project.title}
            </p>

            <Link href={`/${project.slug.current}`}>
              <div className="relative h-96">
                {project.images.map((img: any, idx: number) => (
                  <img
                    key={img.asset._id}
                    src={urlFor(img).width(400).url()}
                    alt={project.title}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500"
                    style={{ zIndex: idx + 1 }}
                  />
                ))}
              </div>
            </Link>

          </div>
        ))}
      </div>
    </main>
  );
}