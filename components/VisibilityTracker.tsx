'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type VisibilityMap = Record<string, number>;
type ScrollMap = Record<string, number>;
type PixelsMap = Record<string, number>;

interface VisibilityContextValue {
    percentVisible: VisibilityMap;
    percentScroll: ScrollMap;
    maxPercentVisible: VisibilityMap;
    maxPercentScroll: ScrollMap;
    pixelsScrolled: PixelsMap;
    maxPixelsScrolled: PixelsMap;
}

const VisibilityContext = createContext<VisibilityContextValue>({
    percentVisible: {},
    percentScroll: {},
    maxPercentVisible: {},
    maxPercentScroll: {},
    pixelsScrolled: {},
    maxPixelsScrolled: {},
});

export function useVisibility() {
    return useContext(VisibilityContext);
}

interface VisibilityTrackerProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function VisibilityTracker({ id, children, className = '' }: VisibilityTrackerProps) {
    const parentContext = useContext(VisibilityContext);
    const [percentVisible, setPercentVisible] = useState(0);
    const [percentScroll, setPercentScroll] = useState(0);
    const [maxPercentVisible, setMaxPercentVisible] = useState(0);
    const [maxPercentScroll, setMaxPercentScroll] = useState(0);
    const [pixelsScrolled, setPixelsScrolled] = useState(0);
    const [maxPixelsScrolled, setMaxPixelsScrolled] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Track visibility with IntersectionObserver
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const visible = Math.round(entry.intersectionRatio * 100);
                    setPercentVisible(visible);
                    setMaxPercentVisible(prev => Math.max(prev, visible));
                });
            },
            {
                threshold: Array.from({ length: 101 }, (_, i) => i / 100),
            }
        );

        observer.observe(element);

        // Track scroll progress
        const updateScrollProgress = () => {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const elementHeight = rect.height;

            // Total scrollable distance
            const totalScrollDistance = viewportHeight + elementHeight;

            // Pixels scrolled: starts at 0 when top enters viewport
            const pixels = viewportHeight - rect.top;
            const boundedPixels = Math.max(0, Math.min(totalScrollDistance, Math.round(pixels)));

            // Percent scroll
            const scrollProgress = pixels / totalScrollDistance;
            const boundedPercent = Math.max(0, Math.min(100, Math.round(scrollProgress * 100)));

            setPercentScroll(boundedPercent);
            setMaxPercentScroll(prev => Math.max(prev, boundedPercent));

            setPixelsScrolled(boundedPixels);
            setMaxPixelsScrolled(prev => Math.max(prev, boundedPixels));
        };

        updateScrollProgress();
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        window.addEventListener('resize', updateScrollProgress, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', updateScrollProgress);
            window.removeEventListener('resize', updateScrollProgress);
        };
    }, []);

    const combinedContext: VisibilityContextValue = {
        percentVisible: {
            ...parentContext.percentVisible,
            [id]: percentVisible,
        },
        percentScroll: {
            ...parentContext.percentScroll,
            [id]: percentScroll,
        },
        maxPercentVisible: {
            ...parentContext.maxPercentVisible,
            [id]: maxPercentVisible,
        },
        maxPercentScroll: {
            ...parentContext.maxPercentScroll,
            [id]: maxPercentScroll,
        },
        pixelsScrolled: {
            ...parentContext.pixelsScrolled,
            [id]: pixelsScrolled,
        },
        maxPixelsScrolled: {
            ...parentContext.maxPixelsScrolled,
            [id]: maxPixelsScrolled,
        },
    };

    return (
        <VisibilityContext.Provider value={combinedContext}>
            <div ref={ref} className={className}>
                {children}
            </div>
        </VisibilityContext.Provider>
    );
}