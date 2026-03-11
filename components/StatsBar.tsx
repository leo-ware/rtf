"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "motion/react"
import StatsImage from "@/app/(main)/what-we-do/advocacy/random6.jpg"

const stats = [
    { value: 4000, label: "horses rescued", prefix: "", suffix: "" },
    { value: 300, label: "land restored", prefix: "", suffix: " km²" },
    { value: 3450, label: "lives changed", prefix: "", suffix: "" },
]

const AnimatedNumber = ({ value, prefix, suffix }: { value: number, prefix: string, suffix: string }) => {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        if (!isInView) return
        const duration = 2000
        const steps = 60
        const increment = value / steps
        let current = 0
        const interval = setInterval(() => {
            current += increment
            if (current >= value) {
                current = value
                clearInterval(interval)
            }
            setDisplay(Math.round(current))
        }, duration / steps)
        return () => clearInterval(interval)
    }, [isInView, value])

    return (
        <span ref={ref}>
            {prefix}{display.toLocaleString()}{suffix}
        </span>
    )
}

const StatsBar = () => {
    return (
        <div className="relative bg-slate-900 overflow-hidden">
            {/* Background horse image */}
            <div className="absolute inset-0">
                <Image
                    src={StatsImage}
                    alt=""
                    fill
                    className="object-cover object-center opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-stone-900/40 to-stone-900/70" />
                <div className="absolute inset-0 bg-red-950/20" />
            </div>

            <div className="relative z-10 py-14 md:py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="text-white/60 text-sm md:text-base tracking-[0.2em] uppercase">
                        Since 1997
                    </span>
                </motion.div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="text-white text-[48px] md:text-[56px] font-serif leading-none">
                                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            </div>
                            <div className="text-white/60 text-sm md:text-base tracking-wide">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StatsBar
