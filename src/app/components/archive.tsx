'use client';

import { urlFor } from '@/sanity/helper';
import { type ProjectItem } from './gallery';

type ArchiveProps = {
  projects: ProjectItem[];
};

export default function Archive({ projects }: ArchiveProps) {
  
  return (

    <main>

    <div className="flex flex-wrap justify-center content-start gap-y-(--lh) py-[2px] my-(--lh) px-[3.125vw]">
        
        {[...projects].map((project, index) => (

          <div
            key={`${project.slug.current}-${index}`}
            className={`flex-[0_0_16.667%] relative`}
            data-category={project.categories?.[0]?.title || ''}
          >

                    <div className='w-full flex mb-(--lh)'>
                        <p className='flex-1 text-center'>
                        {/* <p className='translate-x-1/2'> */}
                            {project.code}.
                            {/* {project.code} */}
                        </p>

                        <p className='flex-1 text-center'>
                        {/* <p className='translate-x-1/2'> */}
                            {project.title}
                            {/* {project.code} */}
                        </p>
            
                    </div>

                    {/* <div className="h-[20dvh]"> */}
                    <div className='px-[25%] h-full pb-[calc(var(--lh)*2)] flex items-center'>
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
