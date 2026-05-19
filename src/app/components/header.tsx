'use client';

import { useEffect, useState } from 'react';

type CategoryItem = {
  _id: string;
  title: string;
  slug: string;
};

type HeaderProps = {
  categories?: CategoryItem[];
  activeCategorySlugs?: string[];
  activeCategorySlug?: string | null;
  hoveredCategorySlug?: string | null;
  onCategorySelect?: (categorySlug: string) => void;
  activeView?: 'gallery' | 'archive';
  onViewChange?: (view: 'gallery' | 'archive') => void;
  viewMode?: 'home' | 'single';
  activeSingleView?: 'all' | 'single';
  onSingleViewChange?: (view: 'all' | 'single') => void;
};

export default function Header({
  categories = [],
  activeCategorySlugs = [],
  activeCategorySlug,
  hoveredCategorySlug,
  onCategorySelect,
  activeView = 'gallery',
  onViewChange,
  viewMode = 'home',
  activeSingleView = 'single',
  onSingleViewChange,
}: HeaderProps) {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    const handleAboutStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen: boolean }>;
      setIsAboutOpen(Boolean(customEvent.detail?.isOpen));
    };

    window.addEventListener('aboutStateChange', handleAboutStateChange);
    return () => window.removeEventListener('aboutStateChange', handleAboutStateChange);
  }, []);

  const toggleDarkMode = () => {
    const nextIsDark = !isDark;

    document.documentElement.classList.toggle('dark', nextIsDark);
    setIsDark(nextIsDark);
  };

  const sortedCategories = [...categories].sort((a, b) =>
    a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
  );

  return (
    <>
    <header className="flex fixed w-full z-10 bottom-0 left-0 items-end justify-between duration-333 ease-in p-(--kv) bg-linear-to-t from-(--color-positive) to-transparent">
    {/* // <header className="flex gap-x-(--kv) fixed w-full z-10 bottom-0 left-0 items-end justify-between p-[5px]"> */}
     
      <div className="flex-1">
        {/* <div className="pb-(--kv)">
          <h6>Last update: Apr. 23, 2026</h6>
        </div> */}
        {/* <Logo /> */}
        <h1 className='relative bottom-[-5px] left-[-5px]'>Javi Dardo</h1>
      </div>

      {/* <div className="flex-1 flex flex-col items-center">
        <a href="https://www.instagram.com/javidardo" target="_blank">@javidardo</a>
        <a href="tel:+34 669 34 23 05" target="_blank">+34 669 34 23 05</a>
        <a href="mailto:contact@javidardo.com" target="_blank">contact@javidardo.com</a>
      </div>

      <div className="lg:flex-1 text-right flex-0">
        <h6>New website soon</h6>
      </div> */}
      
      {/* <div className="flex flex-1 items-end gap-x-(--kv)">
        <h6>View</h6>
        <div className="flex flex-col items-start">
          {viewMode === 'single' ? (
            <>
            <button
                className={`${activeSingleView === 'single' ? 'opacity-30 pointer-events-none' : ''}`}
                onClick={() => onSingleViewChange?.('single')}
              >
                Single
              </button>
              <button
                className={`${activeSingleView === 'all' ? 'opacity-30 pointer-events-none' : ''}`}
                onClick={() => onSingleViewChange?.('all')}
              >
                Overview
              </button>
            </>
          ) : (
            <>
              <button
                className={`${!onViewChange || activeView === 'gallery' ? 'opacity-30 pointer-events-none' : ''}`}
                onClick={() => onViewChange?.('gallery')}
              >
                Gallery
              </button>
              <button
                className={`${!onViewChange || activeView === 'archive' ? 'opacity-30 pointer-events-none' : ''}`}
                onClick={() => onViewChange?.('archive')}
              >
                Archive
              </button>
            </>
          )}
        </div>
      </div> */}

      {viewMode === 'single' ? (
        <>
        </>
      ) : (
        <div className="flex flex-1 items-end gap-x-(--kv) relative">
          <h6 className='lg:absolute lg:right-full lg:pr-(--kv)!'>View</h6>
          <div className="flex flex-col items-start">
            <button
              className={`hover:opacity-30 ${!onViewChange || activeView === 'gallery' ? 'opacity-30 pointer-events-none' : ''}`}
              onClick={() => onViewChange?.('gallery')}
            >
              Gallery
            </button>
            <button
              className={`hover:opacity-30 ${!onViewChange || activeView === 'archive' ? 'opacity-30 pointer-events-none' : ''}`}
              onClick={() => onViewChange?.('archive')}
            >
              Archive
            </button>
          </div>
        </div>
      )}
      
      <div className={`flex relative flex-1 items-end gap-x-(--kv) ${viewMode === 'single' ? 'lg:flex-2' : 'hidden lg:flex'}`}>
        <h6 className='lg:absolute lg:right-full lg:pr-(--kv)!'>Category</h6>
        <div className="flex flex-col">
          {sortedCategories.map((category) => (
            <button
              type="button"
              key={category._id}
              data-category={category.slug}
              onClick={() => onCategorySelect?.(category.slug)}
              className={`${viewMode === 'single' && activeCategorySlugs.length > 0 && !activeCategorySlugs.includes(category.slug) ? 'hidden!' : ''} ${activeCategorySlug && category.slug !== activeCategorySlug ? 'opacity-30 hover:opacity-100' : ''} ${hoveredCategorySlug && category.slug !== hoveredCategorySlug ? 'opacity-30 hover:opacity-100' : ''} ${category.slug === activeCategorySlug ? 'hover:opacity-100 before:content-["-_"]' : ''} cursor-pointer text-left duration-500 hover:opacity-30`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      

    </header>
    <div className="flex fixed z-11 bottom-(--kv) items-center gap-x-(--kv) right-[calc(8px+var(--kv))]">
        
        <h6 
          className="cursor-pointer duration-500 opacity-100! hover:opacity-33!"
          onClick={() => window.dispatchEvent(new Event('aboutToggle'))}
        >
          {isAboutOpen ? 'Close' : 'About'}
        </h6>
        
        <button
          type="button"
          onClick={toggleDarkMode}
          // aria-label="Toggle dark mode"
          className="relative"
        >
          <div className="w-[200%] h-[8px] border-(--color-negative) border-[.95px] rounded-(--kv) absolute z-0"></div>
          <div
            className={`w-[8px] h-[8px] bg-(--color-negative) border-(--color-negative) border-[.95px] rounded-(--kv) relative transition-transform duration-300 ${isDark ? 'translate-x-[8px]' : ''}`}
          ></div>
        </button>
        
      </div>
      </>
  );
}