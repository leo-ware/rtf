"use client"

import { motion, useReducedMotion, Variants } from "motion/react"
import { ReactNode, useState, useEffect } from "react"

type AnimationVariant = "fade-up" | "fade-in" | "fade-down" | "slide-left" | "slide-right" | "scale" | "none"

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const
type Breakpoint = keyof typeof breakpoints

type ScrollRevealProps = {
    children: ReactNode
    variant?: AnimationVariant
    delay?: number
    duration?: number
    className?: string
    once?: boolean
    amount?: number | "some" | "all"
    disableBelow?: Breakpoint
}

const variants: Record<AnimationVariant, Variants> = {
    "fade-up": {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    },
    "fade-down": {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0 }
    },
    "fade-in": {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    },
    "slide-left": {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 }
    },
    "slide-right": {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 }
    },
    "scale": {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    },
    "none": {
        hidden: {},
        visible: {}
    }
}

const ScrollReveal = ({
    children,
    variant = "fade-up",
    delay = 0,
    duration = 0.6,
    className = "",
    once = true,
    amount = 0.2,
    disableBelow,
}: ScrollRevealProps) => {
    const shouldReduceMotion = useReducedMotion()

    const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false)
    useEffect(() => {
        if (!disableBelow) return
        const mq = window.matchMedia(`(max-width: ${breakpoints[disableBelow] - 1}px)`)
        setIsBelowBreakpoint(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsBelowBreakpoint(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [disableBelow])

    const disabled = shouldReduceMotion || isBelowBreakpoint

    if (disabled) {
        return <div className={className}>{children}</div>
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={variants[variant]}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default ScrollReveal
