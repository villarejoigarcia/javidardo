'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Gallery, { type ProjectItem } from './gallery';
import Archive from './archive';
import Loader from './loader';
import SiteShell from './site-shell';

type CategoryItem = {
  _id: string;
  title: string;
  slug: string;
};

type HomeClientProps = {
  projects: ProjectItem[];
  loaderProjects: ProjectItem[];
  categories: CategoryItem[];
  skipIntroOnLoad: boolean;
};

export default function HomeClient({ projects, loaderProjects, categories, skipIntroOnLoad }: HomeClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<'gallery' | 'archive'>('gallery');
  const [isLeaving, setIsLeaving] = useState(false);
  const [showIntro, setShowIntro] = useState(!skipIntroOnLoad);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    if (!showIntro) return;

    const introTimer = window.setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => window.clearTimeout(introTimer);
  }, [showIntro]);

  useEffect(() => {
    if (skipIntroOnLoad) {
      router.replace(pathname, { scroll: false });
    }
  }, [pathname, router, skipIntroOnLoad]);

  const handleProjectOpen = (slug: string) => {
    if (isLeaving) return;

    setIsLeaving(true);
    const pathname = slug.startsWith('/') ? slug : `/${slug}`;

    window.setTimeout(() => {
      router.push(`${pathname}?from=home`);
    }, 666);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategorySlug((currentSlug) =>
      currentSlug === categorySlug ? null : categorySlug
    );
  };

  const handleViewChange = (view: 'gallery' | 'archive') => {
    setHoveredCategorySlug(null);
    setActiveView(view);
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {showIntro ? (
          <motion.div
            key="intro-loader"
            className="fixed inset-0 z-100"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .666, delay: .200 }}
          >
            <Loader projects={loaderProjects} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SiteShell
        categories={categories}
        viewMode="home"
        activeView={activeView}
        onViewChange={handleViewChange}
        activeCategorySlug={selectedCategorySlug}
        hoveredCategorySlug={hoveredCategorySlug}
        onCategorySelect={handleCategorySelect}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showIntro || isLeaving ? 0 : 1 }}
          transition={{ duration: 0.666 }}
          className={isLeaving ? 'pointer-events-none' : ''}
        >
          <div className="relative h-dvh overflow-hidden">
            <motion.div
              animate={{ opacity: activeView === 'archive' ? 0.1 : 1 }}
              transition={{ duration: 0.666 }}
            >
              <Gallery
                projects={projects}
                onProjectOpen={handleProjectOpen}
                activeCategorySlug={selectedCategorySlug}
                onProjectHoverCategoryChange={setHoveredCategorySlug}
              />
            </motion.div>

            <motion.div
              className={`absolute inset-0 z-[1] h-dvh ${activeView === 'archive' ? '' : 'pointer-events-none'}`}
              initial={false}
              animate={{ opacity: activeView === 'archive' ? 1 : 0 }}
              transition={{ duration: 0.666 }}
            >
              <Archive
                projects={projects}
                onProjectOpen={handleProjectOpen}
                activeCategorySlug={selectedCategorySlug}
                onProjectHoverCategoryChange={setHoveredCategorySlug}
                onBackgroundClick={() => handleViewChange('gallery')}
              />
            </motion.div>
          </div>
        </motion.div>

      </SiteShell>
    </>
  );
}
