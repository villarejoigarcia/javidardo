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

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}



export default function ProjectsGalleryClient({
  projects,
}: ProjectsLoaderClientProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [leftProjects, setLeftProjects] = useState(projects);
  const [rightProjects, setRightProjects] = useState(projects);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    
    if (isDesktop) {
      const mid = Math.ceil(projects.length / 2);
      setLeftProjects(shuffleArray(projects.slice(0, mid)));
      setRightProjects(shuffleArray(projects.slice(mid)));
    } else {
      setLeftProjects(shuffleArray(projects));
      setRightProjects([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // animation

  useEffect(() => {
    if (projects.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveProjectIndex((currentIndex) => (currentIndex + 1) % (Math.max(leftProjects.length, rightProjects.length) || projects.length));
    }, 200);
    const stopAutoplayTimeout = window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(stopAutoplayTimeout);
    };
  }, [projects.length, leftProjects.length, rightProjects.length]);

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
        {leftProjects.map((project, index) => {
          const isActive = index === activeProjectIndex;

          return (
            <div
              key={`${project.slug.current}-${index}`}
              className={`absolute left-0 top-0 w-screen lg:w-[50vw] h-dvh ${isActive ? 'opacity-100' : 'opacity-0'}`}
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
              <div className='m-[3px] absolute top-1/3 mix-blend-overlay'>
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
          const isActive = index === activeProjectIndex;

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

      <div className='fixed bottom-0 left-0 w-full flex items-end justify-between mix-blend-overlay'>
        
        <div className='p-[5px]'>
          <h1 className='text-white!'>Javi Dardo</h1>
          {/* <Logo /> */}
        </div>


        {/* <div className='lg:flex-[.5] pt-[3px] flex'>
          <div className='flex flex-col ml-auto mr-[3px]' id='loader'>
            <a className='text-white!' href="https://www.instagram.com/javidardo" target='_blank'>@javidardo</a>
            <a className='text-white!' href="tel:+34 669 342 305">+34 669 342 305</a>
            <a className='text-white!' href="mailto:contact@javidardo.com">contact@javidardo.com</a>
          </div>
        </div> */}

        <div className='p-(--kv) text-right'>
          {/* <h6>Barcelona, {time}</h6> */}
          <p className='text-white! fixed left-[3px] top-[66.667dvh] mt-[3px]!'>Fashion and still life photographer based in Barcelona and working worldwide</p>
        </div>

      </div>

      {/* <div className='fixed bottom-0 lg:left-1/2 left-0 p-[3px] mix-blend-overlay'>
        <p className='uppercase text-white!'>New website soon</p>
      </div> */}

    </main>
  );
}
