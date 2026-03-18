"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import Link from "next/link"
import { HiArrowRight } from "react-icons/hi2"

type TextCyclerProps = {
    words: string[]
    hrefs?: string[]
    interval?: number
    pause?: number
    className?: string
    hideUnderline?: boolean
}

const TextCycler = ({ words, hrefs, interval = 800, pause = 3500, className, hideUnderline }: TextCyclerProps) => {
    const [index, setIndex] = useState(0)
    const shouldReduceMotion = useReducedMotion()

    const longestWord = useMemo(
        () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
        [words]
    )

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length)
        }, interval + pause)
        return () => clearInterval(id)
    }, [words.length, interval, pause])

    const currentWord = words[index]
    const currentHref = hrefs?.[index]

    const progressBar = shouldReduceMotion ? (
        <div
            className="absolute bottom-[0.05em] left-0 w-full h-[3px] bg-white"
        />
    ) : (
        <motion.div
            key={index}
            className="absolute bottom-[0.05em] left-0 w-full h-[3px] bg-white origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: interval / 1000, ease: "linear" }}
        />
    )

    const wordWithBar = (
        <span className="relative">
            {currentWord}
            {!hideUnderline && progressBar}
        </span>
    )

    const wordContent = currentHref ? (
        <Link
            href={currentHref}
            className="group/link inline-flex items-center"
        >
            {wordWithBar}
            <span className="inline-flex overflow-hidden w-0 group-hover/link:w-[1em] transition-all duration-300 items-center translate-y-[3px]">
                <HiArrowRight className="shrink-0 text-[0.55em] translate-x-[-100%] group-hover/link:translate-x-[0.5em] opacity-0 group-hover/link:opacity-100 [stroke-width:2] transition-all duration-300" />
            </span>
        </Link>
    ) : (
        wordWithBar
    )

    return (
        <span className={`relative inline-block text-center md:text-left ${className ?? ""}`}>
            {/* Invisible sizer: longest word sets the container width (desktop only) */}
            <span className="invisible hidden lg:inline-block" aria-hidden="true">
                {longestWord}
            </span>
            {/* Visible animated word, absolutely positioned on desktop, static on mobile */}
            <span className="lg:absolute lg:inset-0">
                {shouldReduceMotion ? (
                    <span className="inline-block">
                        {wordContent}
                    </span>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentWord}
                            className="inline-block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {wordContent}
                        </motion.span>
                    </AnimatePresence>
                )}
            </span>
        </span>
    )
}

export default TextCycler
