'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Gallery, { type ProjectItem } from './gallery';
import Archive from './archive';
import SiteShell from './site-shell';

type CategoryItem = {
  _id: string;
  title: string;
  slug: string;
};

type HomeClientProps = {
  projects: ProjectItem[];
  categories: CategoryItem[];
};

export default function HomeClient({ projects, categories }: HomeClientProps) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'gallery' | 'archive'>('gallery');
  const [isLeaving, setIsLeaving] = useState(false);

  const handleProjectOpen = (slug: string) => {
    if (isLeaving) return;

    setIsLeaving(true);
    const pathname = slug.startsWith('/') ? slug : `/${slug}`;

    window.setTimeout(() => {
      router.push(`${pathname}?from=home`);
    }, 666);
  };

  return (
    <SiteShell
        categories={categories}
        viewMode="home"
        activeView={activeView}
        onViewChange={setActiveView}
      >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLeaving ? 0 : 1}}
        transition={{ duration: 0.666, ease: 'easeOut' }}
        className={isLeaving ? 'pointer-events-none' : ''}
      >
        <div className="relative h-dvh overflow-hidden">
          <motion.div
          //   className="h-[66dvh]"
            animate={{ opacity: activeView === 'archive' ? 0.08 : 1 }}
            transition={{ duration: 0.666, ease: 'easeOut' }}
          >
            <Gallery projects={projects} onProjectOpen={handleProjectOpen} />
          </motion.div>

          <AnimatePresence initial={false}>
            {activeView === 'archive' ? (
              <motion.div
                key="archive"
                className="absolute inset-0 z-[1] h-dvh"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .666, ease: 'easeOut' }}
              >
                <Archive projects={projects} onProjectOpen={handleProjectOpen} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </SiteShell>
  );
}
