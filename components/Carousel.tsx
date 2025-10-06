"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { cn, range } from "@/lib/utils"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

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
}

const Carousel = ({
    className,
    items: initialItems,
    nDisplayItems,
    autoPlay = 'right',
    autoPlayInterval = 3000,
    transitionDuration = 300,
    leftButton,
    rightButton,
    controls = true,
}: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState<CarouselAction | null>(null)
    const [actionQueue, setActionQueue] = useState<CarouselAction[]>([])
    const [autoplayAction, setAutoplayAction] = useState<CarouselAction | null>(autoPlay || null)

    const items = useMemo(() => {
        return initialItems.concat(initialItems.map(item => ({ ...item, id: `${item.id}-copy` })))
    }, [initialItems])

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

    const LeftButton = leftButton || <FaArrowLeft className="w-4 h-4" />
    const RightButton = rightButton || <FaArrowRight className="w-4 h-4" />

    return (
        <div className={cn("w-full h-full flex items-center justify-center gap-2", className)}>
            {controls && (
                <button
                    onClick={() => enqueueAction('left')}
                    className="grow-0 shrink-0 basis-fit h-fit p-2 rounded-full"
                    aria-label="Previous item"
                >
                    {LeftButton}
                </button>
            )}

            <div className="relative basis-0 grow overflow-hidden">
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
                    {displayItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 flex items-center justify-center px-2"
                            style={{ width: `${100 / (nDisplayItems + 2)}%` }}
                        >
                            {item.widget}
                        </div>
                    ))}
                </div>
            </div>

            {controls && (
                <button
                    onClick={() => enqueueAction('right')}
                    className="grow-0 shrink-0 basis-fit h-fit p-2 rounded-full"
                    aria-label="Next item"
                >
                    {RightButton}
                </button>
            )}

        </div>
    )
}

export default Carousel