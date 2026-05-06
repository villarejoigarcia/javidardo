'use client';

import { useEffect, useState } from 'react';
import { urlFor } from '@/sanity/helper';
import { Logo } from './logo';

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
    setLeftProjects(shuffleArray(projects));
    setRightProjects(shuffleArray(projects));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // animation

  useEffect(() => {
    if (projects.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveProjectIndex((currentIndex) => (currentIndex + 1) % projects.length);
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [projects.length]);

  if (projects.length === 0) {
    return null;
  }

  // clock

  const [time, setTime] = useState('');

  useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                new Intl.DateTimeFormat('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'Europe/Madrid',
                }).format(now)
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

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
              className={`absolute left-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >

              {project.images?.[0] && (
                <img
                  key={project.images[0].asset._id}
                  src={urlFor(project.images[0]).url()}
                  alt={project.title}
                  className="lg:w-[50vw] w-screen h-[50dvh] lg:h-screen object-cover"
                />
              )}
              <div className='m-[3px] absolute lg:top-1/3 top-1/2 -translate-y-1/2 mix-blend-overlay'>
                <p className='text-white!'>
                  {project.code}.{project.title}
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
              className={`absolute right-0 bottom-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >

              {project.images?.[0] && (
                <img
                  key={project.images[0].asset._id}
                  src={urlFor(project.images[0]).url()}
                  alt={project.title}
                  className="lg:w-[50vw] w-screen h-[50dvh] lg:h-screen object-cover"
                />
              )}
              <div className='m-[3px] absolute lg:top-1/3 top-1/2 -translate-y-1/2 mix-blend-overlay'>
                <p className='text-white!'>
                  {project.code}.{project.title}
                </p>
              </div>
            </div>
          );
        })}

      </div>

      <div className='fixed top-0 left-0 w-full px-[3px] flex justify-between mix-blend-overlay'>
        
        <div className='lg:flex-[.5]'>
          <h1 className='text-white!'>Javi Dardo</h1>
          {/* <Logo /> */}
        </div>


        <div className='lg:flex-[.5] pt-[3px] flex' id='loader'>
          <div className='flex flex-col items-start ml-auto mr-[3px]'>
            <a className='text-white!' href="https://www.instagram.com/javidardo" target='_blank'>@javidardo</a>
            <a className='text-white!' href="tel:+34 669 342 305">+34 669 342 305</a>
            <a className='text-white!' href="mailto:contact@javidardo.com">contact@javidardo.com</a>
          </div>
        </div>

        <div className='lg:flex-1 lg:py-[3px] py-[7px] text-right'>
          {/* <h6>Barcelona, {time}</h6> */}
          <p className='text-white! lg:relative lg:left-auto lg:top-auto fixed left-[3px] mt-[3px]! top-[50dvh]'>Fashion and still life photographer based in Barcelona and working worldwide</p>
        </div>

      </div>

    </main>
  );
}
