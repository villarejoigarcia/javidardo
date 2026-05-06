'use client';

import Link from 'next/link';
import { urlFor } from '@/sanity/helper';
import { type ProjectItem } from './gallery';

type ArchiveProps = {
  projects: ProjectItem[];
  onProjectOpen?: (slug: string, categorySlug?: string | null) => void;
  onProjectHoverChange?: (categorySlug: string | null) => void;
};

export default function Archive({ projects, onProjectOpen, onProjectHoverChange }: ArchiveProps) {
  return (

    <main>

    <div className="flex flex-wrap justify-center content-start">
        
        {[...projects].map((project, index) => (

          <div
            key={`${project.slug.current}-${index}`}
            // className={`w-auto relative hover:pt-[calc(var(--lh)+4px)] delay-50 duration-500 ease-in-out`}
            // className={`w-auto relative delay-50 duration-500 ${hoveredSlug && hoveredSlug !== project.slug.current ? 'invert' : ''}`}
            className={`w-auto relative delay-50 duration-500 pt-[calc(var(--lh)+4px)] hover:translate-y-[calc(var(--lh)+4px)] px-[1px]`}
            data-category={project.categories?.[0]?.slug || ''}
            onMouseMove={() => onProjectHoverChange?.(project.categories?.[0]?.slug || null)}
            onMouseLeave={() => onProjectHoverChange?.(null)}
            // onMouseEnter={() => {
            //   setHoveredSlug(project.slug.current);
            // }}
            // onMouseLeave={() => {
            //   setHoveredSlug(null);
            // }}
          >

                    <div className='flex justify-center py-[2px]'>
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
                      className='flex items-center'
                    >
                      {project.images?.[0] && (
                        <img
                          key={project.images[0].asset._id}
                          src={urlFor(project.images[0]).url()}
                          alt={project.title}
                          className="w-auto h-[22.223dvh] object-cover"
                        />
                      )}
                    </Link>

          </div>

        ))}

      </div>

      </main>

  );

}
