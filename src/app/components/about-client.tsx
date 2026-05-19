'use client';

import { useEffect, useRef, useState } from 'react';

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

interface AboutProps {
    data: {
        about: {
            title: string;
            description: string;
            listening?: Array<{ label: string; url: string }>;
            clients?: string[];
            contactLinks?: Array<{ label: string; url: string }>;
        };
        latestUpdate?: string;
    };
}

type AboutLink = {
    label: string;
    url: string;
};

export default function AboutClient({ data }: AboutProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [maxHeight, setMaxHeight] = useState('0px');
    const contentRef = useRef<HTMLDivElement>(null);

    const about = data?.about;
    const latestUpdate = data?.latestUpdate;

    useEffect(() => {
        const handleAboutToggle = () => {
            setIsOpen(prev => !prev);
        };

        window.addEventListener('aboutToggle', handleAboutToggle);
        return () => window.removeEventListener('aboutToggle', handleAboutToggle);
    }, []);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('aboutStateChange', { detail: { isOpen } }));
    }, [isOpen]);

    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                setMaxHeight(`${contentRef.current.scrollHeight}px`);
            } else {
                setMaxHeight('0px');
            }
        }
    }, [isOpen]);

    if (!about) return null;

    return (
        <>
            <div
            ref={contentRef} 
                //   id="about" 
                className="bg-(--color-positive) fixed bottom-0 z-11 overflow-hidden duration-1000"
                style={{ maxHeight }}
            >
                <div className="px-[5px] pt-(--kv)">
                    {latestUpdate && (
                        <h6 className="mb-(--kv)!">Last update: {formatDate(latestUpdate)}</h6>
                    )}
                    <h1>
                        {/* <span>Javi Dardo </span> */}
                        {about.description}
                    </h1>
                    
                </div>

                    <div className="flex flex-wrap lg:items-end p-(--kv) lg:pt-[46px] pt-[36px]">
                        
                        <div className="lg:flex-1 w-full lg:order-first order-last">
                            {about.listening && about.listening.length > 0 && (
                                <>
                                    <h6 className="">Listening</h6>
                                    {about.listening.map((item: AboutLink, i: number) => (
                                        <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className='w-fit hover:opacity-40'>
                                            {item.label}
                                        </a>
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="flex-1 relative">
                            {about.contactLinks && about.contactLinks.length > 0 && (
                                <>
                                    <h6 className="lg:absolute lg:right-full lg:bottom-0 lg:pr-(--kv)!">Contact</h6>
                                    {about.contactLinks.map((link: AboutLink, i: number) => (
                                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className='w-fit hover:opacity-40'>
                                            {link.label}
                                        </a>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* <div className="flex-1 relative lg:mb-0 mb-[calc(36px-var(--kv))]"> */}
                        <div className="flex-1 relative lg:mb-0 mb-[36px]">
                            {about.clients && about.clients.length > 0 && (
                                <>
                                    <h6 className="lg:absolute lg:right-full lg:bottom-0 lg:pr-(--kv)! whitespace-nowrap">Selected clients</h6>
                                    <div>
                                        {about.clients.map((client: string, i: number) => (
                                            <p key={i}>{client}</p>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            <div 
                onClick={() => setIsOpen(false)}
            className={`fixed top-0 left-0 w-screen h-dvh bg-white mix-blend-difference z-9 duration-666 ${isOpen ? 'pointer-events-auto opacity-100 delay-333' : 'pointer-events-none opacity-0'}`}>

            </div>
        </>
    );
}
