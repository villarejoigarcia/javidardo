'use client';

import { urlFor } from '@/sanity/helper';
import { type ProjectItem } from './gallery';

type ArchiveProps = {
  projects: ProjectItem[];
};

export default function Archive({ projects }: ArchiveProps) {
  
  return (

    <main>

    <div className="flex flex-wrap justify-center content-start gap-x-[2px]">
        
        {[...projects].map((project, index) => (

          <div
            key={`${project.slug.current}-${index}`}
            className={`w-auto relative hover:pt-[calc(var(--lh)+4px)] delay-50 duration-500 ease-in-out`}
            data-category={project.categories?.[0]?.title || ''}
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
                    <div className=' flex items-center'>
                        {project.images?.[0] && (
                            <img
                                key={project.images[0].asset._id}
                                src={urlFor(project.images[0]).url()}
                                alt={project.title}
                                className="w-auto h-[22.223dvh] object-cover"
                            />
                        )}
                    </div>

          </div>

        ))}

      </div>

      </main>

  );

}
