'use client';

import Link from 'next/link';
import { urlFor } from '@/sanity/helper';
import { type ProjectItem } from './gallery';

type ArchiveProps = {
  projects: ProjectItem[];
  onProjectOpen?: (slug: string, categorySlug?: string | null) => void;
  activeCategorySlug?: string | null;
  onProjectHoverCategoryChange?: (categorySlug: string | null) => void;
  onBackgroundClick?: () => void;
};

export default function Archive({
  projects,
  onProjectOpen,
  activeCategorySlug,
  onProjectHoverCategoryChange,
  onBackgroundClick,
}: ArchiveProps) {
  return (

    <main>

      {/* <div className="flex flex-wrap justify-center content-start h-dvh overflow-y-auto lg:pb-[calc(33.333vh-var(--lh)-4px)] pb-(--header)"> */}
      <div
        className="flex flex-wrap justify-center content-start h-dvh overflow-y-auto lg:pb-[calc(33.333vh-var(--lh)-4px)]"
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          onBackgroundClick?.();
        }}
      >
        
        {[...projects].map((project, index) => (
          

          <div
            key={`${project.slug.current}-${index}`}
            // className={`w-auto relative hover:pt-[calc(var(--lh)+4px)] delay-50 duration-500 ease-in-out`}
            // className={`w-auto relative delay-50 duration-500 ${hoveredSlug && hoveredSlug !== project.slug.current ? 'invert' : ''}`}
            className={`w-auto relative duration-500 lg:hover:translate-y-[calc(var(--lh)+4px)] overflow-hidden ${activeCategorySlug && project.categories?.[0]?.slug !== activeCategorySlug ? 'w-0! h-0! p-0! duration-0!' : ''}`}
            data-category={project.categories?.[0]?.slug || ''}
            onMouseEnter={() => {
              onProjectHoverCategoryChange?.(project.categories?.[0]?.slug || null);
            }}
            onMouseLeave={() => {
              onProjectHoverCategoryChange?.(null);
            }}
          >

            <div className='flex justify-center pb-[2px] lg:pt-[calc(var(--lh)+4px+2px)] pt-[2px]'>
              <p className='text-center'>
                {/* <p className='translate-x-1/2'> */}
                {project.code}.
                {/* {project.code} */}
              </p>

              <p className='text-center'>
                {/* <p className='translate-x-1/2'> */}
                {project.title}
                {/* {project.code} */}
              </p>

            </div>

            {/* <div className="h-[20dvh]"> */}
            <Link
              href={`/${project.slug.current}`}
              onClick={(event) => {
                if (!onProjectOpen) return;
                event.preventDefault();
                onProjectOpen(project.slug.current, project.categories?.[0]?.slug || null);
              }}
              className='flex items-center gap-[2px] flex-wrap justify-center'
            >
                <div className='flex gap-x-[2px] px-[1px]'>
                  {project.images.slice(0, 3).map((image, imageIndex) => (
                    <img
                      key={image.asset._id || `${project.slug.current}-${imageIndex}`}
                      src={urlFor(image).width(400).url()}
                      alt={`${project.title} ${imageIndex + 1}`}
                      // className="w-auto h-[22.223dvh] object-cover"
                      // className="w-auto lg:h-[calc(22.222vh-((var(--lh))+4px)*2)] h-[16.667vh] object-cover"
                      className="w-auto lg:h-[calc(22.222vh-((var(--lh))+4px)*2)] h-[8.334vh] object-cover"
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
