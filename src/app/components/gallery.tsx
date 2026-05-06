'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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
  slug?: string;
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
  onProjectOpen?: (slug: string, categorySlug?: string | null) => void;
  onProjectHoverChange?: (categorySlug: string | null) => void;
};

export default function ProjectsGalleryClient({
  projects,
  onProjectOpen,
  onProjectHoverChange,
}: ProjectsGalleryClientProps) {
  const isMobile = responsive();
  const mainRef = useRef<HTMLElement | null>(null);
  const [distances, setDistances] = useState<number[]>([]);
  const [hoveredProjectKey, setHoveredProjectKey] = useState<string | null>(null);
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setVisible(true), 333);
  //   return () => clearTimeout(timeout);
  // }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const handleScroll = () => {
      const half = main.scrollWidth / 2;
      if (main.scrollLeft >= half) {
        main.scrollLeft -= half;
      } else if (main.scrollLeft <= 0) {
        main.scrollLeft += half;
      }

      // Calcular distancia de cada elemento al borde izquierdo
      const children = Array.from(main.querySelectorAll('[data-project-item]')) as HTMLElement[];
      const newDistances = children.map((child) => Math.abs(child.offsetLeft - main.scrollLeft));
      setDistances(newDistances);
    };

    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  // const getHeightClass = (distance: number): string => {
  //   return distance < 50 ? 'h-full' : 'h-1/2';
  // };



  return (
    <main
      ref={mainRef}
      // className={`w-full h-full overflow-x-auto overflow-y-hidden transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      className={`w-full overflow-x-auto overflow-y-hidden transition-opacity duration-1000 ease-in-out`}

    >

      <div className="flex w-max pr-[2px]">
        
        {[...projects, ...projects].map((project, index) => (
          (() => {
            const projectKey = `${project.slug.current}-${index}`;

            return (
          <div
            key={projectKey}
            data-project-item
            // className={`h-full pb-(--header) transition-opacity duration-100 ease-in-out ${index < projects.length ? (visibleItems.includes(index) ? 'opacity-100' : 'opacity-0') : 'opacity-100'}`}
            // className={`${getHeightClass(distances[index] ?? 300)} sticky pl-[2px] left-0 bg-white transition-all duration-200`}
            className={`sticky pl-[2px] left-0 duration-500 ease-in-out bg-white transition-all duration-200 ${hoveredProjectKey === projectKey ? 'pt-[calc(var(--lh)+4px)]' : ''}`}
            data-category={project.categories?.[0]?.slug || ''}
            onMouseMove={() => {
              setHoveredProjectKey(projectKey);
              onProjectHoverChange?.(project.categories?.[0]?.slug || null);
            }}
            onMouseLeave={() => {
              setHoveredProjectKey(null);
              onProjectHoverChange?.(null);
            }}
          >
            <div className='my-[2px]'>
              <p>
                {project.code}.{project.title}
              </p>
            </div>

            <Link
              href={`/${project.slug.current}`}
              onClick={(event) => {
                if (!onProjectOpen) return;
                event.preventDefault();
                onProjectOpen(project.slug.current, project.categories?.[0]?.slug || null);
              }}
              className="pb-[calc(var(--lh)+4px)]"
            >
              {project.images?.[0] && (
                <img
                  key={project.images[0].asset._id}
                  src={urlFor(project.images[0]).url()}
                  alt={project.title}
                  className="lg:w-auto w-screen h-auto lg:h-[66.667dvh] object-cover"
                />
              )}
            </Link>
          </div>
            );
          })()
        ))}
      </div>
    </main>
  );
}
