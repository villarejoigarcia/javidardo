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

export default function ProjectsGalleryClient({
  projects,
}: ProjectsLoaderClientProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // animation

  useEffect(() => {
    if (projects.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveProjectIndex((currentIndex) => (currentIndex + 1) % projects.length);
    }, 167);

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
      <div className='py-[3px] px-[5px]'>
      <p className='text-(--color-grey)!'>Fashion and still life photographer based in Barcelona and working worldwide.</p>
      </div>
        {projects.map((project, index) => {
          const isActive = index === activeProjectIndex;

          return (
            <div
              key={`${project.slug.current}-${index}`}
              className={`absolute px-[2px] top-[15.5px] left-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >

              {project.images?.[0] && (
                <img
                  key={project.images[0].asset._id}
                  src={urlFor(project.images[0]).url()}
                  alt={project.title}
                  className="lg:w-auto w-screen h-auto lg:h-[66.667dvh] object-cover"
                />
              )}
              <div className='m-[3px]'>
                <p>
                  {project.code}.{project.title}
                </p>
              </div>
            </div>
          );
        })}

      <div className='fixed bottom-0 left-0 lg:w-1/2 w-full px-[3px_7px] flex items-end justify-between'>
        
        <div className=''>
          <h1>Javi Dardo</h1>
          {/* <Logo /> */}
        </div>
      
        <div className='pb-[7px]'>
          <h6>Barcelona, {time}</h6>
        </div>

        <div className='pb-[7px]'>
          <a href="https://www.instagram.com/javidardo" target='_blank'>@javidardo</a>
          <a href="tel:+34 669 342 305">+34 669 342 305</a>
          <a href="mailto:contact@javidardo.com">contact@javidardo.com</a>
        </div>

      </div>

    </main>
  );
}
