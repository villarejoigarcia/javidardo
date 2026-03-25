'use client';

import { useEffect, useRef, type MouseEvent } from 'react';
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
  const mainRef = useRef<HTMLElement | null>(null);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const isMobile = responsive();

  const indexRef = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isMobile) return;

    const startAutoPlay = () => {
      if (autoPlayRef.current) return;
      autoPlayRef.current = setInterval(() => {
        indexRef.current = (indexRef.current + 1) % projects.length;
        updatePosition();
      }, 200);
    };

    const stopAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };

    const updatePosition = () => {
      const main = mainRef.current;
      if (!main) return;

      const items = main.children[0]?.children;
      if (!items) return;

      Array.from(items).forEach((el, i) => {
        const element = el as HTMLElement;
        element.style.opacity = i === indexRef.current ? '1' : '0';
        element.style.pointerEvents = i === indexRef.current ? 'auto' : 'none';
      });
    };

    startAutoPlay();

    return () => {
      stopAutoPlay();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isMobile, projects.length]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || isMobile) return;

    let rafId = 0;

    const tick = () => {
      const delta = targetScrollRef.current - currentScrollRef.current;

      // Lerp factor controls how fast it catches the mouse target.
      currentScrollRef.current += delta * 0.3;
      main.scrollLeft = currentScrollRef.current;

      rafId = window.requestAnimationFrame(tick);
    };

    currentScrollRef.current = main.scrollLeft;
    targetScrollRef.current = main.scrollLeft;
    rafId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const main = mainRef.current;
    if (!main || isMobile) return;

    const maxScrollLeft = main.scrollWidth - main.clientWidth;
    if (maxScrollLeft <= 0) return;

    const ratio = Math.min(Math.max(event.clientX / window.innerWidth, 0), 1);
    targetScrollRef.current = ratio * maxScrollLeft;
  };

  const handleClick = () => {
    if (!isMobile) return;

    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    indexRef.current = (indexRef.current + 1) % projects.length;

    const main = mainRef.current;
    if (main) {
      const items = main.children[0]?.children;
      if (items) {
        Array.from(items).forEach((el, i) => {
          const element = el as HTMLElement;
          element.style.opacity = i === indexRef.current ? '1' : '0';
          element.style.pointerEvents = i === indexRef.current ? 'auto' : 'none';
        });
      }
    }

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

    resumeTimeoutRef.current = setTimeout(() => {
      autoPlayRef.current = setInterval(() => {
        indexRef.current = (indexRef.current + 1) % projects.length;
        const main = mainRef.current;
        if (!main) return;
        const items = main.children[0]?.children;
        if (!items) return;

        Array.from(items).forEach((el, i) => {
          const element = el as HTMLElement;
          element.style.opacity = i === indexRef.current ? '1' : '0';
          element.style.pointerEvents = i === indexRef.current ? 'auto' : 'none';
        });
      }, 200);
    }, 1000);
  };

  return (
    <main
      ref={mainRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="w-full h-dvh lg:overflow-hidden overflow-x-auto overflow-y-hidden p-(--kv) cursor-ew-resize"
    >
      <div className="flex h-dvh pb-(--header) lg:w-max relative">
        {projects.map((project) => (
          <div
            key={project.slug.current}
            className="h-full w-full flex-shrink-0 lg:w-fit lg:pr-(--kv) lg:relative absolute top-0 left-0 bg-white lg:opacity-100 opacity-0"
            data-category={project.categories?.[0]?.title || ''}
          >
            <p>
              {project.code}.{project.title}
            </p>

            <div className="h-full">
              {project.images?.map((img, idx) => (
                <img
                  key={img.asset._id}
                  src={urlFor(img).url()}
                  alt={project.title}
                  className="w-auto h-full object-cover aspect-4/5 mt-(--kv)"
                  style={{ zIndex: idx + 1 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
