'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { urlFor } from '@/sanity/helper';

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
  activeCategorySlug?: string | null;
  onProjectHoverCategoryChange?: (categorySlug: string | null) => void;
};

export default function ProjectsGalleryClient({
  projects,
  onProjectOpen,
  activeCategorySlug,
  onProjectHoverCategoryChange,
}: ProjectsGalleryClientProps) {
  const mainRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [distances, setDistances] = useState<number[]>([]);
  const [shouldClone, setShouldClone] = useState(false);
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setVisible(true), 333);
  //   return () => clearTimeout(timeout);
  // }, []);

  useEffect(() => {
    const main = mainRef.current;
    const content = contentRef.current;

    if (!main || !content) return;

    const updateCloneState = () => {
      const children = Array.from(content.querySelectorAll('[data-project-item]')) as HTMLElement[];
      const baseChildren = children.slice(0, projects.length);
      const baseWidth = baseChildren.reduce((total, child) => total + child.offsetWidth, 0);
      setShouldClone(baseWidth > main.clientWidth);
    };

    updateCloneState();

    const observer = new ResizeObserver(updateCloneState);
    observer.observe(main);
    observer.observe(content);

    return () => observer.disconnect();
  }, [projects, activeCategorySlug]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const handleScroll = () => {
      if (!shouldClone) return;

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
  }, [shouldClone]);

  // const getHeightClass = (distance: number): string => {
  //   return distance < 50 ? 'h-full' : 'h-1/2';
  // };



  return (
    <main
      ref={mainRef}
      // className={`w-full h-full overflow-x-auto overflow-y-hidden transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      className={`w-full overflow-x-auto overflow-y-hidden transition-opacity duration-1000 ease-in-out`}

    >

      <div ref={contentRef} className={`flex w-max pr-[2px]`}>
        
        {(shouldClone ? [...projects, ...projects] : projects).map((project, index) => (
        // {/* {[...projects].filter((project) => (project.images?.length ?? 0) > 1).map((project, index) => ( */}
          (() => {
            return (
          <div
            key={`${project.slug.current}-${index}`}
            data-project-item
            // className={`h-full pb-(--header) transition-opacity duration-100 ease-in-out ${index < projects.length ? (visibleItems.includes(index) ? 'opacity-100' : 'opacity-0') : 'opacity-100'}`}
            // className={`${getHeightClass(distances[index] ?? 300)} sticky pl-[2px] left-0 bg-white transition-all duration-200`}
            className={`sticky left-0 duration-500 bg-(--color-positive) lg:hover:pt-[calc(var(--lh)+4px)] ${activeCategorySlug && project.categories?.[0]?.slug !== activeCategorySlug ? 'w-0 p-0! duration-0! overflow-hidden' : ''}`}
            data-category={project.categories?.[0]?.slug || ''}
            onMouseEnter={() => {
              onProjectHoverCategoryChange?.(project.categories?.[0]?.slug || null);
            }}
            onMouseLeave={() => {
              onProjectHoverCategoryChange?.(null);
            }}
          >
            <div className='my-[2px] pl-[2px]'>
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
                  className="lg:w-auto w-[90vw] h-auto lg:h-[66.667dvh] object-cover pl-[2px]"
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
