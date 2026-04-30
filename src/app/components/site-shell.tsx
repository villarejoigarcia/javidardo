'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Header from './header';

type CategoryItem = {
  _id: string;
  title: string;
  slug: string;
};

type SiteShellProps = {
  children: React.ReactNode;
  categories?: CategoryItem[];
  activeCategorySlugs?: string[];
  viewMode: 'home' | 'single';
  activeView?: 'gallery' | 'archive';
  onViewChange?: (view: 'gallery' | 'archive') => void;
  activeSingleView?: 'all' | 'single';
  onSingleViewChange?: (view: 'all' | 'single') => void;
};

export default function SiteShell({
  children,
  categories = [],
  activeCategorySlugs = [],
  viewMode,
  activeView,
  onViewChange,
  activeSingleView,
  onSingleViewChange,
}: SiteShellProps) {
  return (
    <>
      {children}

      {/* <AnimatePresence mode="wait" initial={false}> */}
        {/* <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        > */}
          <Header
            categories={categories}
            activeCategorySlugs={activeCategorySlugs}
            viewMode={viewMode}
            activeView={activeView}
            onViewChange={onViewChange}
            activeSingleView={activeSingleView}
            onSingleViewChange={onSingleViewChange}
          />
        {/* </motion.div> */}
      {/* </AnimatePresence> */}
    </>
  );
}
