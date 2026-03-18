"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { cn, range } from "@/lib/utils"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"

type CarouselAction = 'left' | 'right'

type CarouselProps = {
    items: { id: string, widget: React.ReactNode }[]
    nDisplayItems: number
    className?: string
    autoPlay?: CarouselAction | false
    autoPlayInterval?: number
    transitionDuration?: number
    leftButton?: React.ReactNode
    rightButton?: React.ReactNode
    controls?: boolean
    navigationPosition?: "sides" | "bottom"
    dotIndicators?: boolean
    itemGap?: boolean
    onIndexChange?: (index: number) => void
}

const Carousel = ({
    className,
    items: initialItems,
    nDisplayItems,
    autoPlay = false,
    autoPlayInterval = 3000,
    transitionDuration = 300,
    leftButton,
    rightButton,
    controls = true,
    navigationPosition = "sides",
    dotIndicators = true,
    itemGap = true,
    onIndexChange,
}: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState<CarouselAction | null>(null)
    const [actionQueue, setActionQueue] = useState<CarouselAction[]>([])
    const isSingleItem = initialItems.length <= 1
    const [autoplayAction, setAutoplayAction] = useState<CarouselAction | null>(isSingleItem ? null : (autoPlay || null))

    const items = useMemo(() => {
        if (isSingleItem) return initialItems
        return initialItems.concat(initialItems.map(item => ({ ...item, id: `${item.id}-copy` })))
    }, [initialItems, isSingleItem])

    const normalizeIndex = (index: number) => (index + items.length) % items.length

    const someUserAction = useRef(false)
    const enqueueAction = (action: CarouselAction, _user: boolean = true) => {
        if (_user && !someUserAction.current) {
            // if this is the first user action, turn off auto play
            // and wipe any actions in the queue
            someUserAction.current = true
            setActionQueue([action])
            setAutoplayAction(null)
        } else {
            setActionQueue((prev) => [...prev, action])
        }
    }

    const fireAction = (action: CarouselAction) => {
        if (isTransitioning) return
        setIsTransitioning(action)
        const nextIndex = action === 'left'
            ? (currentIndex - 1 + items.length) % items.length
            : (currentIndex + 1) % items.length
        setTimeout(() => {
            setCurrentIndex(nextIndex)
            onIndexChange?.(initialItems.length > 0 ? nextIndex % initialItems.length : 0)
            setIsTransitioning(null)
        }, transitionDuration)
    }

    // Auto-play functionality
    const autoplayRef = useRef<NodeJS.Timeout | null>(null)
    const clearAutoplay = () => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current)
            autoplayRef.current = null
        }
    }
    useEffect(() => {
        clearAutoplay()
        if (autoplayAction) {
            autoplayRef.current = setInterval(() => {
                enqueueAction(autoplayAction, false)
            }, autoPlayInterval)
            return () => clearAutoplay()
        }
    }, [autoplayAction, autoPlayInterval])

    // Handle action queue
    useEffect(() => {
        if (actionQueue.length === 0 || isTransitioning) return
        const action = actionQueue.shift()
        if (action) {
            fireAction(action)
        }
    }, [actionQueue, isTransitioning])

    const displayItems = range(currentIndex - 1, currentIndex + nDisplayItems + 1)
        .map((index) => normalizeIndex(index))
        .map((index) => items[index])

    const LeftButton = leftButton || <FaCaretLeft size={30} className="text-pewter" />
    const RightButton = rightButton || <FaCaretRight size={30} className="text-pewter" />

    const activeDotIndex = initialItems.length > 0 ? currentIndex % initialItems.length : 0

    if (isSingleItem) {
        return (
            <div className={cn("w-full flex items-center justify-center", className)}>
                {initialItems[0]?.widget}
            </div>
        )
    }

    const useBottomNav = navigationPosition === "bottom"

    const slidingContent = (
        <div className={cn("relative overflow-hidden", useBottomNav ? "w-full" : "w-full md:basis-0 md:grow")}>
            <div
                className="relative flex"
                style={{
                    left: `${(
                        isTransitioning === null
                            ? -1 / nDisplayItems
                            : isTransitioning === 'left'
                                ? 0
                                : -2 / nDisplayItems
                    ) * 100}%`,
                    transition: !!isTransitioning
                        ? `left ${transitionDuration}ms ease-in-out`
                        : undefined,
                    width: `${(100 / nDisplayItems) * (nDisplayItems + 2)}%`
                }}
            >
                {displayItems.map((item) => (
                    <div
                        key={item.id}
                        className={cn("flex-shrink-0 flex justify-center items-center", itemGap && "px-2")}
                        style={{ width: `${100 / (nDisplayItems + 2)}%` }}
                    >
                        {item.widget}
                    </div>
                ))}
            </div>
        </div>
    )

    const bottomControls = controls && (
        <div className={cn("flex items-center justify-center gap-3", !useBottomNav && "md:hidden")}>
            <button
                onClick={() => enqueueAction('left')}
                className="shrink-0 outline-none"
                aria-label="Previous item"
            >
                {LeftButton}
            </button>
            {dotIndicators && initialItems.map((item, index) => (
                <button
                    key={item.id}
                    className={cn(
                        "w-2.5 h-2.5 rounded-full transition-colors duration-200",
                        index === activeDotIndex ? "bg-pewter" : "bg-gray-300"
                    )}
                    aria-label={`Go to item ${index + 1}`}
                    onClick={() => {
                        const diff = index - activeDotIndex
                        if (diff === 0) return
                        const action: CarouselAction = diff > 0 ? 'right' : 'left'
                        const steps = Math.abs(diff)
                        for (let i = 0; i < steps; i++) {
                            enqueueAction(action)
                        }
                    }}
                />
            ))}
            <button
                onClick={() => enqueueAction('right')}
                className="shrink-0 outline-none"
                aria-label="Next item"
            >
                {RightButton}
            </button>
        </div>
    )

    if (useBottomNav) {
        return (
            <div className={cn("w-full flex flex-col items-center gap-4", className)}>
                {slidingContent}
                {bottomControls}
            </div>
        )
    }

    return (
        <div className={cn("w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2", className)}>
            {controls && (
                <button
                    onClick={() => enqueueAction('left')}
                    className="hidden md:block grow-0 shrink-0 basis-fit h-fit pr-2 rounded-full outline-none"
                    aria-label="Previous item"
                >
                    {LeftButton}
                </button>
            )}

            {slidingContent}

            {controls && (
                <button
                    onClick={() => enqueueAction('right')}
                    className="hidden md:block grow-0 shrink-0 basis-fit h-fit pl-2 rounded-full outline-none"
                    aria-label="Next item"
                >
                    {RightButton}
                </button>
            )}

            {bottomControls}
        </div>
    )
}

export default Carousel