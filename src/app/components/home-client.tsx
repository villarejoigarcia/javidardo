'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Gallery, { type ProjectItem } from './gallery';
import Archive from './archive';
import Header from './header';

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
  const [activeView, setActiveView] = useState<'gallery' | 'archive'>('gallery');

  return (
    <>
      <div className="relative h-dvh overflow-hidden">
        <motion.div
          className="h-[66dvh]"
          animate={{ opacity: activeView === 'archive' ? 0.05 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Gallery projects={projects} />
        </motion.div>

        <AnimatePresence initial={false}>
          {activeView === 'archive' ? (
            <motion.div
              key="archive"
              className="absolute inset-0 z-[1] h-dvh"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Archive projects={projects} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <Header
        categories={categories}
        activeView={activeView}
        onViewChange={setActiveView}
      />
    </>
  );
}
