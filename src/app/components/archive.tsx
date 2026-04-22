'use client';

import { urlFor } from '@/sanity/helper';
import { type ProjectItem } from './gallery';

type ArchiveProps = {
  projects: ProjectItem[];
};

export default function Archive({ projects }: ArchiveProps) {
  
  return (

    <main className='h-full overflow-y-auto'>

    <div className="flex flex-wrap justify-center content-start h-full gap-y-[2px] pt-[calc(var(--lh)+4px)] px-[3.125vw]">
        
        {[...projects].map((project, index) => (

          <div
            key={`${project.slug.current}-${index}`}
            className={`flex-[0_0_16.667%] flex relative`}
            data-category={project.categories?.[0]?.title || ''}
          >

                    <div className='w-full my-[2px] absolute right-1/2 -translate-x-1/4 mr-[5px] flex flex-col items-end'>
                        <p>
                        {/* <p className='translate-x-1/2'> */}
                            {project.code}.
                            {/* {project.code} */}
                        </p>

                        <p className=''>
                        {/* <p className='translate-x-1/2'> */}
                            {project.title}
                            {/* {project.code} */}
                        </p>
            
                    </div>

                    {/* <div className="h-[20dvh]"> */}
                    <div className='px-[25%] pb-[50%]'>
                        {project.images?.[0] && (
                            <img
                                key={project.images[0].asset._id}
                                src={urlFor(project.images[0]).url()}
                                alt={project.title}
                                className="w-full h-auto object-cover"
                            />
                        )}
                    </div>

          </div>

        ))}

      </div>

      </main>

  );

}
