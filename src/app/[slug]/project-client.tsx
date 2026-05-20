'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { urlFor } from '@/sanity/helper';
import SiteShell from '../components/site-shell';

let hasAnimatedProjectList = false;
let isProjectSwitch = false;
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
    const [isLeaving, setIsLeaving] = useState(false);
    const [pendingSlug, setPendingSlug] = useState<string | null>(null);
    const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImageCarouselPaused, setIsImageCarouselPaused] = useState(false);
    const [activeSingleView, setActiveSingleView] = useState<'all' | 'single'>('all');
    const previousSingleViewRef = useRef<'all' | 'single'>(activeSingleView);
    const switchTimeoutRef = useRef<number | null>(null);
    const hoverIntervalRef = useRef<number | null>(null);
    const isSwitchingProject = pendingSlug !== null;
    // const isSingleViewModeChange = previousSingleViewRef.current !== activeSingleView;

    useEffect(() => {
        return () => {
            if (switchTimeoutRef.current !== null) {
                window.clearTimeout(switchTimeoutRef.current);
            }

            if (hoverIntervalRef.current !== null) {
                window.clearInterval(hoverIntervalRef.current);
            }
        };
    }, []);

    const handleGoHome = () => {
        if (isLeaving) return;
        setIsLeaving(true);
        window.setTimeout(() => {
            hasAnimatedProjectList = false;
            router.push('/?from=close');
        }, 666);
    };

    const [shouldAnimateList] = useState(() => {
        const nextValue = !hasAnimatedProjectList;
        hasAnimatedProjectList = true;
        return nextValue;
    });

    const [shouldAnimateContent] = useState(() => {
        const animate = !isProjectSwitch;
        isProjectSwitch = false;
        return animate;
    });

    const handleProjectSwitch = (slug: string) => {
        if (isLeaving || slug === project.slug || pendingSlug) return;

        isProjectSwitch = true;
        router.push(`/${slug}`);
    };

    const handleNextImage = () => {
        if (project.images.length <= 1) return;
        setActiveImageIndex((prev) => (prev + 1) % project.images.length);
    };

    // const startHoverImageCarousel = () => {
    //     if (project.images.length <= 1) return;

    //     if (hoverIntervalRef.current !== null) {
    //         window.clearInterval(hoverIntervalRef.current);
    //     }

    //     hoverIntervalRef.current = window.setInterval(() => {
    //         setActiveImageIndex((prev) => (prev + 1) % project.images.length);
    //     }, 333);
    // };

    // const stopHoverImageCarousel = () => {
    //     if (hoverIntervalRef.current === null) return;

    //     window.clearInterval(hoverIntervalRef.current);
    //     hoverIntervalRef.current = null;
    // };

    useEffect(() => {
        const from = new URLSearchParams(window.location.search).get('from');

        if (from) {
            router.replace(pathname, { scroll: false });
        }
    }, [pathname, router]);

    useEffect(() => {
        setActiveImageIndex(0);
        // stopHoverImageCarousel();
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
                transition={{ duration: 0.666 }}
                className={isLeaving ? 'pointer-events-none' : ''}
            >

                <main className="lg:flex">

                    {/* list */}

                    <motion.div
                        // className={`flex-1 duration-666 ${activeSingleView === 'single' ? 'opacity-0!' : 'delay-666'}`}
                        className={`flex-1`}
                        initial={shouldAnimateList ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.666 }}
                    >

                        {/* <div className='flex lg:flex-row flex-row-reverse justify-between absolute lg:w-1/3 top-0 w-full top-(--kv) my-(--kv) lg:pl-(--kv) px-(--kv)'> */}
                        <div className='flex lg:gap-x-0 gap-x-[2px] flex-row justify-between absolute lg:w-1/3 top-0 w-full top-(--kv) my-(--kv) lg:pl-(--kv) px-(--kv)'>

                            <div className='flex-1'>

                            <h6
                                onClick={handleGoHome}
                                className="cursor-pointer duration-333! w-fit uppercase hover:opacity-100!"
                            >
                                Close
                            </h6>

                            </div>

                            {/* <div className='hidden lg:flex flex-2 flex-col items-start'> */}
                            <div className='flex lg:flex-2 flex-1 flex-col items-start'>

                                {projects.map((item) => {
                                    const activeSlug = pendingSlug ?? project.slug;
                                    const isActive = item.slug === activeSlug;

                                    return (
                                        <Link
                                            key={item.slug}
                                            href={`/${item.slug}`}
                                            onMouseEnter={() => setHoveredProjectSlug(item.slug)}
                                            onMouseLeave={() => setHoveredProjectSlug(null)}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                handleProjectSwitch(item.slug);
                                            }}
                                            className={`flex-1 duration-333 ${hoveredProjectSlug !== null ? (hoveredProjectSlug === item.slug ? 'opacity-100' : 'opacity-40') : (isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100')}`}
                                        >
                                            {item.code ? `${item.code}.` : ''}
                                            {item.title}
                                        </Link>
                                    );
                                })}

                            </div>

                            {/* <div className='lg:hidden flex'>

                                {(() => {
                                    const activeSlug = pendingSlug ?? project.slug;
                                    const activeProject = projects.find((item) => item.slug === activeSlug);
                                    return activeProject ? (
                                        <p className='flex-1'>
                                            {activeProject.code ? `${activeProject.code}.` : ''}
                                            {activeProject.title}
                                        </p>
                                    ) : null;
                                })()}

                            </div> */}

                        </div>
                    </motion.div>


                    <motion.div
                        className="flex-2 lg:pl-[5px]"
                        initial={shouldAnimateContent ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: .666,
                        }}
                    >

                        {/* all */}

                        <motion.div
                            // className={`flex lg:py-[2px] lg:px-0 px-[2px] w-full max-h-dvh pt-[calc(var(--lh)+(var(--kv)*2))] overflow-y-auto ${activeSingleView === 'all' ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            className={`flex lg:py-[2px] lg:px-0 px-[2px] w-full max-h-dvh pt-[33.333dvh] overflow-y-auto ${activeSingleView === 'all' ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            initial={shouldAnimateContent ? { opacity: 0 } : false}
                            // animate={isSwitchingProject ? { opacity: 0 } : { opacity: activeSingleView === 'all' ? 1 : 0 }}
                            animate={isSwitchingProject ? { opacity: 1 } : { opacity: activeSingleView === 'all' ? 1 : 1 }}
                            transition={{
                                duration: 0.666,
                                // delay: isSingleViewModeChange && activeSingleView === 'all' ? .666 : 0,
                            }}
                        >

                            <div className='grid lg:grid-cols-4 grid-cols-2 gap-[2px] flex-2'>
                                {project.images.map((img, index) => (
                                    <img
                                        key={`${img.asset._id}-${index}`}
                                        src={urlFor(img).width(800).url()}
                                        alt={project.title}
                                        className="w-full object-cover cursor-zoom-in relative z-5"
                                        onClick={() => {
                                            setActiveImageIndex(index);
                                            setActiveSingleView('single');
                                        }}
                                    />
                                ))}
                            </div>

                        </motion.div>

                        {/* single */}

                        <motion.div
                            className={`z-100 bg-[color-mix(in_srgb,var(--color-positive)_90%,transparent)] flex lg:flex-row flex-col lg:justify-center top-0 left-0 lg:px-0 px-[2px] lg:py-[2px] left-0 w-screen h-dvh cursor-zoom-out absolute ${activeSingleView === 'single' ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            initial={shouldAnimateContent ? { opacity: 0 } : false}
                            animate={isSwitchingProject ? { opacity: 0 } : { opacity: activeSingleView === 'single' ? 1 : 0 }}
                            transition={{
                                duration: 0.666,
                                // delay: isSingleViewModeChange && activeSingleView === 'single' ? .666 : 0,
                            }}
                            onClick={(event) => {
                                if (event.target === event.currentTarget) {
                                    setActiveSingleView('all');
                                }
                            }}
                        >

                            {/* <div className='lg:absolute flex lg:flex-col flex-row-reverse justify-between w-full top-0 left-0 lg:items-start z-10 lg:pt-(--kv) pt-[calc(var(--kv)*3+var(--lh))] px-(--kv)'> */}
                            <div className='lg:absolute flex flex-col justify-between w-full top-0 left-0 items-start z-10 pt-(--kv) px-(--kv)'>

                                <h6
                                    className='mb-(--kv) block cursor-pointer hover:opacity-100! duration-333!'
                                    onClick={() => setActiveSingleView('all')}
                                >
                                    Back
                                </h6>

                                <div className='flex pb-(--kv)'>

                                    {project.images.map((_, index) => (
                                        <p
                                            key={index}
                                            onMouseEnter={() => setActiveImageIndex(index)}
                                            className={` block pr-[calc(var(--lh)/2)]! duration-0! lg:py-(--kv)! pt-(--kv)! cursor-ew-resize ${index === activeImageIndex ? 'opacity-100' : 'opacity-40'}`}
                                        >{index + 1}</p>
                                    ))}

                                </div>

                            </div>

                            <div
                                className='lg:h-full relative'
                                onClick={() => {
                                    handleNextImage();
                                }}
                            >

                                {project.images.map((img, index) => (
                                    <img
                                        key={`${img.asset._id}-${index}`}
                                        src={urlFor(img).url()}
                                        alt={project.title}
                                        className={`lg:w-auto lg:h-full h-auto w-full object-cover select-none cursor-e-resize ${index === activeImageIndex ? 'block' : 'hidden'}`}
                                    />
                                ))}

                            </div>

                        </motion.div>

                    </motion.div>
                </main>
            </motion.div>
        </SiteShell>
    );
}
