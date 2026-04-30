'use client';

import Link from 'next/link';
import { Logo } from "./logo";

type CategoryItem = {
  _id: string;
  title: string;
  slug: string;
};

type HeaderProps = {
  categories?: CategoryItem[];
  activeCategorySlugs?: string[];
  activeView?: 'gallery' | 'archive';
  onViewChange?: (view: 'gallery' | 'archive') => void;
  viewMode?: 'home' | 'single';
  activeSingleView?: 'all' | 'single';
  onSingleViewChange?: (view: 'all' | 'single') => void;
};

export default function Header({
  categories = [],
  activeCategorySlugs = [],
  activeView = 'gallery',
  onViewChange,
  viewMode = 'home',
  activeSingleView = 'single',
  onSingleViewChange,
}: HeaderProps) {

  return (
    <header className="flex gap-x-(--kv) fixed w-full z-10 bottom-0 left-0 items-end justify-between p-(--kv) bg-linear-to-t from-white from-10% to-transparent">
    {/* // <header className="flex gap-x-(--kv) fixed w-full z-10 bottom-0 left-0 items-end justify-between p-[5px]"> */}
     
      <div className="flex-1">
        <div className="pb-(--lh)">
          <h6>Last update: Apr. 23, 2026</h6>
        </div>
        <Logo />
      </div>

      {/* <div className="flex-1 flex flex-col items-center">
        <a href="https://www.instagram.com/javidardo" target="_blank">@javidardo</a>
        <a href="tel:+34 669 34 23 05" target="_blank">+34 669 34 23 05</a>
        <a href="mailto:contact@javidardo.com" target="_blank">contact@javidardo.com</a>
      </div>

      <div className="lg:flex-1 text-right flex-0">
        <h6>New website soon</h6>
      </div> */}
      
      <div className="flex flex-1 items-end gap-x-(--kv)">
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
      </div>
      
      <div className="flex flex-1 items-end gap-x-(--kv)">
        <h6>Category</h6>
        <div className="flex flex-col">
          {categories.map((category) => (
            <a
              key={category._id}
              data-category={category.slug}
              className={`${viewMode === 'single' && activeCategorySlugs.length > 0 && !activeCategorySlugs.includes(category.slug) ? 'hidden!' : ''}`}
            >
              {category.title}
            </a>
          ))}
        </div>
      </div>

      <div className="flex absolute bottom-(--kv) items-center gap-x-(--kv) right-(--kv)">
        <h6 className="cursor-pointer text-black! duration-500 hover:text-(--color-grey)!">About</h6>
        <div className="relative mr-(--kv)">
          <div className="w-[200%] h-[8px] bg-white border-black border rounded-(--kv) absolute z-0"></div>
          <div className="w-[8px] h-[8px] bg-black border-black border rounded-(--kv) relative"></div>
        </div>
      </div>

    </header>
  );
}