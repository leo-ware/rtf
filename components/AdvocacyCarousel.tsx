"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Carousel from "@/components/Carousel"
import Header from "@/components/public-ui/Header"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
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
    const textRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
        const el = textRef.current
        if (el && !expanded) {
            setIsOverflowing(el.scrollHeight > el.clientHeight + 2)
        }
    }, [expanded])

    return (
        <>
            <div
                ref={textRef}
                className={cn(
                    "text-sm sm:text-base lg:text-lg text-ink",
                    !expanded && "line-clamp-6"
                )}
            >
                {children}
            </div>
            {(isOverflowing || expanded) && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle()
                    }}
                    className="text-sm text-cinnamon hover:underline mt-1 cursor-pointer"
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
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
            <div className={cn(
                "w-full flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 px-2",
                expandedSlide === title
                    ? "min-h-[540px] sm:min-h-[620px] lg:min-h-[400px]"
                    : "h-[540px] sm:h-[620px] lg:h-[400px] overflow-hidden"
            )}>
                <div className="relative shrink-0 h-[200px] sm:h-[250px] lg:h-[300px] lg:w-[48%]">
                    <ImageWithAuthorCredit
                        src={image}
                        alt={title}
                        fill
                        wrapperClassName="w-full h-full"
                        className="object-cover object-center"
                    />
                </div>
                <div className="min-w-0 lg:basis-0 lg:grow text-left flex flex-col gap-3 items-start justify-center overflow-hidden">
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
