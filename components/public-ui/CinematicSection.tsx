"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import { ReactNode, useRef } from "react"
import { StaticImageData } from "next/image"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"

type CinematicSectionProps = {
    image: StaticImageData
    imageAlt: string
    title: string
    children: ReactNode
    titleSize?: string
    textSize?: string
}

const CinematicSection = ({
    image,
    imageAlt,
    title,
    children,
    titleSize = "text-[70px]",
    textSize = "text-[22px] md:text-[24px]",
}: CinematicSectionProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })
    const shouldReduceMotion = useReducedMotion()

    if (shouldReduceMotion) {
        return (
            <div className="w-full relative h-screen flex items-center justify-center overflow-hidden">
                <ImageWithAuthorCredit
                    src={image}
                    alt={imageAlt}
                    fill
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    wrapperClassName="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 max-w-4xl">
                    <div className={`${titleSize} font-serif text-white text-center`}>{title}</div>
                    <div className={`${textSize} text-white text-center leading-relaxed`}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={ref}
            className="w-full relative h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Image — scales in from slightly zoomed with a slow Ken Burns drift */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1.15, opacity: 0 }}
                animate={isInView ? { scale: 1.02, opacity: 1 } : { scale: 1.15, opacity: 0 }}
                transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <ImageWithAuthorCredit
                    src={image}
                    alt={imageAlt}
                    fill
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    wrapperClassName="absolute inset-0 w-full h-full"
                />
            </motion.div>

            {/* Overlay — fades in alongside the image */}
            <motion.div
                className="absolute inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
            />

            {/* Text content — staggers in after the image */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 max-w-4xl">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={isInView
                        ? { opacity: 1, y: 0, filter: "blur(0px)" }
                        : { opacity: 0, y: 30, filter: "blur(8px)" }
                    }
                    transition={{
                        duration: 0.9,
                        delay: 0.8,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    <div className={`${titleSize} font-serif text-white text-center`}>{title}</div>
                </motion.div>

                {/* Body text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{
                        duration: 0.9,
                        delay: 1.2,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    <div className={`${textSize} text-white text-center leading-relaxed`}>
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default CinematicSection
