'use client';

import { useEffect, useRef, useState } from 'react';
import { urlFor } from '@/sanity/helper';
import { responsive } from './responsive';

type ProjectImage = {
  asset: {
    _id: string;
    url: string;
  };
};

type ProjectCategory = {
  title: string;
};

export type ProjectItem = {
  title: string;
  slug: {
    current: string;
  };
  code: string;
  images: ProjectImage[];
  categories?: ProjectCategory[];
};

type ProjectsGalleryClientProps = {
  projects: ProjectItem[];
};

export default function ProjectsGalleryClient({ projects }: ProjectsGalleryClientProps) {
  const isMobile = responsive();
  const mainRef = useRef<HTMLElement | null>(null);

  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    projects.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * 200);
    });
  }, [projects]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let rafId: number;
    let speed = 1;

    const animate = () => {
      main.scrollLeft += speed;

      // loop back to start when reaching the end
      if (main.scrollLeft >= main.scrollWidth / 2) {
        main.scrollLeft = 0;
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <main
      ref={mainRef}
      className="w-full h-dvh overflow-x-auto overflow-y-hidden"
    >
      <div className="flex h-dvh w-max gap-x-[2px]">
        {/* {!isMobile && ( */}
          <div className='fixed z-50 lg:top-[calc(50vh-var(--header))] left-0 lg:translate-y-full mix-blend-difference h-full lg:h-fit lg:pb-0 pb-(--header) lg:pt-0 pt-[calc(var(--lh)+4px)] flex flex-col items-center lg:flex-row w-full lg:justify-between justify-evenly px-[5px] pointer-events-none'>
            {projects.map((project) => (
              <div
                key={project.slug.current}
              >

                <div className='flex'>
                  <p className='text-white!'>{project.code}</p>
                  {/* <p className='text-white!'>{project.code}.</p><p className='group-hover:opacity-100 opacity-0 text-white!'>{project.title}</p> */}
                </div>



              </div>
            ))}

          </div>
        {/* )} */}

        {[...projects, ...projects].map((project, index) => (
          <div
            key={`${project.slug.current}-${index}`}
            className={`h-full pb-(--header) transition-opacity duration-1000 ease-in-out ${index < projects.length ? (visibleItems.includes(index) ? 'opacity-100' : 'opacity-0') : 'opacity-100'}`}
            data-category={project.categories?.[0]?.title || ''}
          >
            <div className='my-[2px]'>
              <p className='text-center'>
                {project.code}.{project.title}
              </p>
              </div>

            <div className="h-full pb-[calc(var(--lh)+4px)]">
              {project.images?.[0] && (
                <img
                  key={project.images[0].asset._id}
                  src={urlFor(project.images[0]).url()}
                  alt={project.title}
                  className="w-auto h-full object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
