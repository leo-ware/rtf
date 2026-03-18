"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Carousel from "@/components/Carousel"
import Header from "@/components/public-ui/Header"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Button from "@/components/public-ui/Button"
import { cn } from "@/lib/utils"
import { StaticImageData } from "next/image"

type CarouselSlide = {
    title: string
    description: React.ReactNode
    image: StaticImageData
}

type AdvocacyCarouselProps = {
    items: CarouselSlide[]
}

const ExpandableText = ({
    children,
    expanded,
    onToggle,
}: {
    children: React.ReactNode
    expanded: boolean
    onToggle: () => void
}) => {
    const outerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
        const outer = outerRef.current
        const inner = innerRef.current
        if (outer && inner) {
            // Check if the inner content is taller than the clamped container
            setIsOverflowing(inner.scrollHeight > outer.clientHeight + 2)
        }
    }, [children])

    return (
        <>
            <div
                ref={outerRef}
                className={cn(
                    "text-sm sm:text-base lg:text-lg text-ink",
                    "overflow-hidden transition-[max-height] duration-500 ease-in-out",
                    !expanded && "max-h-[9em]"
                )}
                style={expanded ? { maxHeight: innerRef.current?.scrollHeight ?? 2000 } : undefined}
            >
                <div ref={innerRef}>
                    {children}
                </div>
            </div>
            {(isOverflowing || expanded) && (
                <div
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle()
                    }}
                    className="mt-1 cursor-pointer"
                >
                    <Button color="cinnamon">
                        {expanded ? "Show Less" : "Read More"}
                    </Button>
                </div>
            )}
        </>
    )
}

const AdvocacyCarousel = ({ items }: AdvocacyCarouselProps) => {
    const [expandedSlide, setExpandedSlide] = useState<string | null>(null)

    const handleIndexChange = useCallback(() => {
        setExpandedSlide(null)
    }, [])

    const carouselItems = items.map(({ title, description, image }) => ({
        id: title,
        widget: (
            <div className="w-full flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 px-2 min-h-[540px] sm:min-h-[620px] lg:min-h-[400px]">
                <div className="relative shrink-0 h-[200px] sm:h-[250px] lg:h-[300px] lg:w-[48%]">
                    <ImageWithAuthorCredit
                        src={image}
                        alt={title}
                        fill
                        wrapperClassName="w-full h-full"
                        className="object-cover object-center"
                    />
                </div>
                <div className="relative min-w-0 lg:basis-0 lg:grow text-left flex flex-col gap-3 items-start justify-center">
                    <Header level={2} className="!text-left">
                        {title}
                    </Header>
                    <ExpandableText
                        expanded={expandedSlide === title}
                        onToggle={() =>
                            setExpandedSlide((prev) =>
                                prev === title ? null : title
                            )
                        }
                    >
                        {description}
                    </ExpandableText>
                </div>
            </div>
        ),
    }))

    return (
        <Carousel
            nDisplayItems={1}
            autoPlay={false}
            leftButton={<FaCaretLeft size={30} className="text-pewter" />}
            rightButton={<FaCaretRight size={30} className="text-pewter" />}
            items={carouselItems}
            onIndexChange={handleIndexChange}
        />
    )
}

export default AdvocacyCarousel
