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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 333);
    return () => clearTimeout(timeout);
  }, []);

  // const [visibleItems, setVisibleItems] = useState<number[]>([]);

  // useEffect(() => {
  //   projects.forEach((_, index) => {
  //     setTimeout(() => {
  //       setVisibleItems(prev => [...prev, index]);
  //     }, index * 50);
  //   });
  // }, [projects]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let rafId: number;
    let startTime: number | null = null;

    const duration = 1500; // 1 second to reach duplicates
    const target = main.scrollWidth / 2;

    let speed = isMobile ? 1.333 : .666;
    let reachedLoop = false;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;

      if (!reachedLoop) {
        // const progress = Math.min(elapsed / duration, 1);
        const t = Math.min(elapsed / duration, 1);
        const progress = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
        //  const progress = t < 0.5
        //   ? 2 * t * t
        //   : -1 +(4 - 2 * t) * t; // easeInOutQuad
        main.scrollLeft = target * progress;

        if (progress >= 1) {
          reachedLoop = true;
          // match autoplay starting point exactly
          main.scrollLeft = target;
        }
      } else {
        // maintain consistent velocity from last easing frame
        main.scrollLeft += speed;

        if (main.scrollLeft >= target) {
          main.scrollLeft = 0;
        }
      }
      main.scrollLeft += speed;
      rafId = requestAnimationFrame(animate);
    };
    
    
    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [isMobile]);

  return (
    <main
      ref={mainRef}
      // className={`w-full h-dvh overflow-x-auto overflow-y-hidden transition-opacity duration-666 ${visible ? 'opacity-100' : 'opacity-0'}`}
      className={`w-full h-dvh overflow-x-auto overflow-y-hidden transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex h-dvh w-max">
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
            // className={`h-full pb-(--header) transition-opacity duration-100 ease-in-out ${index < projects.length ? (visibleItems.includes(index) ? 'opacity-100' : 'opacity-0') : 'opacity-100'}`}
            className={`h-full pb-(--header)`}
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
