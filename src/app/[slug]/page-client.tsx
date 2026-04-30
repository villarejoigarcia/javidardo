'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { urlFor } from '@/sanity/helper';
import SiteShell from '../components/site-shell';

let hasAnimatedProjectList = false;
const PROJECT_SWITCH_DELAY_MS = 333;
const PROJECT_SWITCH_DELAY_S = PROJECT_SWITCH_DELAY_MS / 1000;

type ProjectCategory = {
    title: string;
    slug?: string;
};

type ProjectImage = {
    asset: {
        _id: string;
        url?: string;
    };
};

export type ProjectData = {
    title: string;
    code?: string;
    slug?: string;
    images: ProjectImage[];
    categories: ProjectCategory[];
    body?: unknown;
};

export type ProjectListItem = {
    title: string;
    code?: string;
    slug: string;
};

export type CategoryItem = {
    _id: string;
    title: string;
    slug: string;
};

type ProjectPageClientProps = {
    project: ProjectData;
    categories: CategoryItem[];
    projects: ProjectListItem[];
};

export default function ProjectPageClient({ project, categories, projects }: ProjectPageClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLeaving, setIsLeaving] = useState(false);
    const [pendingSlug, setPendingSlug] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImageCarouselPaused, setIsImageCarouselPaused] = useState(false);
    const [activeSingleView, setActiveSingleView] = useState<'all' | 'single'>('single');
    const previousSingleViewRef = useRef<'all' | 'single'>(activeSingleView);
    const switchTimeoutRef = useRef<number | null>(null);
    const isSwitchingProject = pendingSlug !== null;
    const isSingleViewModeChange = previousSingleViewRef.current !== activeSingleView;

    useEffect(() => {
        return () => {
            if (switchTimeoutRef.current !== null) {
                window.clearTimeout(switchTimeoutRef.current);
            }
        };
    }, []);

    const handleGoHome = () => {
        if (isLeaving) return;
        setIsLeaving(true);
        window.setTimeout(() => {
            hasAnimatedProjectList = false;
            router.push('/');
        }, 666);
    };

    const [shouldAnimateList] = useState(() => {
        const nextValue = !hasAnimatedProjectList;
        hasAnimatedProjectList = true;
        return nextValue;
    });

    const [shouldAnimateContent] = useState(() => {
        const from = searchParams.get('from');
        return from === 'home' || from === 'switch';
    });

    const handleProjectSwitch = (slug: string) => {
        if (isLeaving || slug === project.slug || pendingSlug) return;

        setPendingSlug(slug);
        switchTimeoutRef.current = window.setTimeout(() => {
            router.push(`/${slug}?from=switch`);
        }, PROJECT_SWITCH_DELAY_MS);
    };

    const handleNextImage = () => {
        if (project.images.length <= 1) return;
        setActiveImageIndex((prev) => (prev + 1) % project.images.length);
    };

    useEffect(() => {
        if (searchParams.get('from')) {
            router.replace(pathname, { scroll: false });
        }
    }, [pathname, router, searchParams]);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [project.images.length, project.slug]);

    useEffect(() => {
        previousSingleViewRef.current = activeSingleView;
    }, [activeSingleView]);

    // useEffect(() => {
    //     if (project.images.length <= 1) {
    //         return;
    //     }

    //     if (isImageCarouselPaused) {
    //         return;
    //     }

    //     const intervalId = window.setInterval(() => {
    //         setActiveImageIndex((prev) => (prev + 1) % project.images.length);
    //     }, 500);

    //     return () => {
    //         window.clearInterval(intervalId);
    //     };
    // }, [isImageCarouselPaused, project.images.length]);

    return (
        <SiteShell
            categories={categories}
            activeCategorySlugs={project.categories?.map((category) => category.slug).filter(Boolean) as string[]}
            viewMode="single"
            activeSingleView={activeSingleView}
            onSingleViewChange={setActiveSingleView}
        >
            <motion.div
                animate={{ opacity: isLeaving ? 0 : 1 }}
                transition={{ duration: 0.666, ease: 'easeOut' }}
                className={isLeaving ? 'pointer-events-none' : ''}
            >
                <main className="flex">

                    <motion.div
                        className="flex-1 "
                        initial={shouldAnimateList ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.666, ease: 'easeOut' }}
                    >

                        <div className='flex items-start sticky top-(--kv) mt-(--kv) pl-(--kv)'>

                            <div className='flex-1'>

                            <button
                                onClick={handleGoHome}
                                className="text-black hover:text-(--color-grey) transition-colors duration-300 uppercase"
                            >
                                Close
                            </button>

                            </div>

                            <div className='flex flex-2 flex-col items-start'>

                            {projects.map((item) => {
                                const activeSlug = pendingSlug ?? project.slug;
                                const isActive = item.slug === activeSlug;

                                return (
                                    <Link
                                        key={item.slug}
                                        href={`/${item.slug}`}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            handleProjectSwitch(item.slug);
                                        }}
                                        className={`flex-1 transition-[color] duration-300 hover:text-black! ${isActive ? 'text-black' : 'text-(--color-grey)!'}`}
                                    >
                                        {item.code ? `${item.code}.` : ''}
                                        {item.title}
                                    </Link>
                                );
                            })}

                            </div>

                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-[2] min-w-0 relative"
                        initial={shouldAnimateContent ? { opacity: 0 } : false}
                        animate={isSwitchingProject ? { opacity: 0 } : { opacity: 1 }}
                        transition={{
                            duration: .666,
                            ease: 'easeOut',
                        }}
                    >
                        <motion.div
                            className={`grid grid-cols-4 gap-[2px] py-[2px] top-0 left-0 w-full max-h-dvh overflow-y-auto ${activeSingleView === 'all' ? 'pointer-events-auto relative' : 'pointer-events-none absolute'}`}
                            initial={shouldAnimateContent ? { opacity: 0 } : false}
                            animate={isSwitchingProject ? { opacity: 0 } : { opacity: activeSingleView === 'all' ? 1 : 0 }}
                            transition={{
                                duration: 0.666,
                                ease: 'easeOut',
                                delay: isSingleViewModeChange && activeSingleView === 'all' ? .666 : 0,
                            }}
                        >
                            {project.images.map((img, index) => (
                                <img
                                    key={`${img.asset._id}-${index}`}
                                    src={urlFor(img).width(800).url()}
                                    alt={project.title}
                                    className="w-full object-cover cursor-pointer"
                                    onClick={() => {
                                        setActiveImageIndex(index);
                                        setActiveSingleView('single');
                                    }}
                                />
                            ))}
                        </motion.div>

                        <motion.div
                            className={`flex top-0 left-0 w-full ${activeSingleView === 'single' ? 'pointer-events-auto relative' : 'pointer-events-none absolute'}`}
                            initial={shouldAnimateContent ? { opacity: 0 } : false}
                            animate={isSwitchingProject ? { opacity: 0 } : { opacity: activeSingleView === 'single' ? 1 : 0 }}
                            transition={{
                                duration: 0.666,
                                ease: 'easeOut',
                                delay: isSingleViewModeChange && activeSingleView === 'single' ? .666 : 0,
                            }}
                        >
                            <div
                                className='relative flex-1 pt-[2px] cursor'
                                onMouseEnter={() => setIsImageCarouselPaused(true)}
                                onMouseLeave={() => setIsImageCarouselPaused(false)}
                                onClick={handleNextImage}
                            >
                                
                                {project.images.map((img, index) => (
                                    <img
                                        key={`${img.asset._id}-${index}`}
                                        src={urlFor(img).url()}
                                        alt={project.title}
                                        className={`w-full object-cover absolute ${index === activeImageIndex ? 'block' : 'hidden'}`}

                                    />
                                ))}

                            </div>

                            <div className='relative flex-1 flex pl-(--kv)'>

                                {project.images.map((_, index) => (
                                    <p
                                        key={index}
                                        onMouseEnter={() => setActiveImageIndex(index)}
                                        className={`block pr-[calc(var(--lh)/2)]! py-(--kv)! cursor-pointer ${index === activeImageIndex ? 'text-black' : 'text-(--color-grey)!'}`}
                                    >{index+1}</p>
                                ))}

                            </div>

                        </motion.div>

                    </motion.div>
                </main>
            </motion.div>
        </SiteShell>
    );
}