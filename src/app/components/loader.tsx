'use client';

import { useEffect, useState } from 'react';
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
  code?: string;
  images?: ProjectImage[];
  categories?: ProjectCategory[];
};

type ProjectsLoaderClientProps = {
  projects: ProjectItem[];
};

function useActiveProjectIndex(projectCount: number, initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (projectCount <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % projectCount);
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [projectCount]);

  return projectCount ? activeIndex % projectCount : -1;
}

export default function ProjectsGalleryClient({
  projects,
}: ProjectsLoaderClientProps) {
  const midpoint = Math.ceil(projects.length / 2);
  const leftProjects = projects.slice(0, midpoint);
  const rightProjects = projects.slice(midpoint);
  const mobileActiveIndex = useActiveProjectIndex(projects.length);
  const leftActiveIndex = useActiveProjectIndex(leftProjects.length);
  const rightActiveIndex = useActiveProjectIndex(rightProjects.length, 2);

  if (projects.length === 0) {
    return null;
  }

  const getProjectLabel = (project: ProjectItem) =>
    project.code ? `${project.code}.${project.title}` : project.title;

  // clock

  // const [time, setTime] = useState('');

  // useEffect(() => {
  //       const updateTime = () => {
  //           const now = new Date();
  //           setTime(
  //               new Intl.DateTimeFormat('es-ES', {
  //                   hour: '2-digit',
  //                   minute: '2-digit',
  //                   second: '2-digit',
  //                   timeZone: 'Europe/Madrid',
  //               }).format(now)
  //           );
  //       };
  //       updateTime();
  //       const interval = setInterval(updateTime, 1000);
  //       return () => clearInterval(interval);
  //   }, []);

  return (
    <main
      className={`w-full`}
    >
      <div>
        {projects.map((project, index) => {
          const isMobileActive = index === mobileActiveIndex;
          const isLeftActive = index < midpoint && index === leftActiveIndex;

          return (
            <div
              key={`${project.slug.current}-${index}`}
              className={`absolute left-0 top-0 w-screen lg:w-[50vw] h-dvh ${isMobileActive ? 'opacity-100' : 'opacity-0'} ${isLeftActive ? 'lg:opacity-100' : 'lg:opacity-0'} ${index >= midpoint ? 'lg:hidden' : ''}`}
            >

              {project.images?.[0] && (
                <img
                  key={project.images[0].asset._id}
                  src={urlFor(project.images[0]).url()}
                  alt={project.title}
                  className="lg:w-[50vw] w-screen h-dvh object-cover"
                />
              )}
              {!project.images?.[0] && <div className="lg:w-[50vw] w-screen h-dvh" />}
              <div className='m-[3px] absolute lg:top-1/3 top-2/3 mix-blend-overlay'>
                <p className='text-white!'>
                  {getProjectLabel(project)}
                </p>
              </div>


            </div>
          );
        })}
      </div>  

      <div>
        {rightProjects.map((project, index) => {
          const isActive = index === rightActiveIndex;

          return (
            <div
              key={`${project.slug.current}-${index}`}
              className={`lg:block hidden absolute right-0 bottom-0 w-[50vw] h-dvh ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >

              {project.images?.[0] && (
                <img
                  key={project.images[0].asset._id}
                  src={urlFor(project.images[0]).url()}
                  alt={project.title}
                  className="lg:w-[50vw] w-screen h-[50dvh] lg:h-dvh object-cover"
                />
              )}
              {!project.images?.[0] && <div className="lg:w-[50vw] w-screen h-[50dvh] lg:h-dvh" />}
              <div className='m-[3px] absolute top-1/3 mix-blend-overlay'>
                <p className='text-white!'>
                  {getProjectLabel(project)}
                </p>
              </div>
            </div>
          );
        })}

      </div>



      {/* <div className='fixed bottom-0 left-0 w-full flex items-end justify-between mix-blend-overlay'>
        
        <div className='p-[5px]'>
          <h1 className='text-white!'>Javi Dardo</h1>
        </div>

        <div className='p-(--kv) text-right'>
          <p className='text-white! fixed left-[3px] top-[66.667dvh] mt-[3px]!'>Fashion and still life photographer based in Barcelona and working worldwide</p>
        </div>

      </div> */}



      <div className='fixed top-0 left-0 w-full px-[3px] flex justify-between mix-blend-overlay'>
        
        <div className='lg:flex-[.5]'>
          <h1 className='text-white!'>Javi Dardo</h1>
        </div>


        <div className='lg:flex-[.5] pt-[3px] flex'>
          <div className='flex flex-col ml-auto mr-[3px]' id='loader'>
            <a className='text-white!' href="https://www.instagram.com/javidardo" target='_blank'>@javidardo</a>
            <a className='text-white!' href="tel:+34 669 342 305">+34 669 342 305</a>
            <a className='text-white!' href="mailto:contact@javidardo.com">contact@javidardo.com</a>
          </div>
        </div>

        <div className='lg:flex-1 py-[2px] text-right'>
          <p className='text-white! lg:relative lg:left-auto lg:top-auto fixed left-[3px] top-1/3 lg:mt-0! mt-[3px]!'>Fashion and still life photographer based in Barcelona and working worldwide</p>
        </div>

      </div>

      <div className='fixed bottom-0 lg:left-1/2 left-0 p-[3px] mix-blend-overlay'>
        <p className='uppercase text-white!'>New website soon</p>
      </div>

    </main>
  );
}
