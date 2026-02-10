"use client"

import { StaticImageData } from "next/image"
import Image from "next/image"
import ScrollReveal from "./ScrollReveal"

type AlternatingPictureLayoutProps = {
    items: {
        superTitle?: React.ReactNode
        title?: React.ReactNode
        description: React.ReactNode
        image: StaticImageData
    }[]
    alternateTitleColors?: boolean
    dividerColor?: string
}

const AlternatingPictureLayout = ({
    items,
    alternateTitleColors = false,
    dividerColor = undefined
}: AlternatingPictureLayoutProps) => {
    const titleColor = (idx: number) => {
        if (alternateTitleColors) {
            return ["text-pewter", "text-sage-green", "text-cinnamon"][idx % 3]
        }
        return "text-sage-green"
    }

    return (
        <div className="relative w-full md:w-10/12 mx-auto h-fit flex flex-col gap-16">
            {dividerColor && (
                <div className={`absolute top-0 left-0 w-1/2 h-full border-r-2 border-${dividerColor}`} />
            )}
            {items.map((item, index) => {
                const isEven = index % 2 === 0
                const flexDirection = isEven ? "md:flex-row-reverse" : "md:flex-row"
                const textAlign = isEven ? "md:text-left md:items-start" : "md:text-right md:items-end"
                const gapSize = dividerColor ? "gap-20" : "gap-8"

                return (
                    <div
                        key={`${item.title}-${index}`}
                        className={`w-full h-fit flex flex-col items-center justify-center ${flexDirection} ${gapSize}`}
                    >
                        <ScrollReveal
                            variant="fade-up"
                            className={`basis-0 grow flex flex-col gap-4 text-center px-4 md:px-0 ${textAlign}`}
                        >
                            {item.superTitle && (
                                <div className="text-xl md:text-[25px] text-ink">
                                    {item.superTitle}
                                </div>
                            )}
                            {item.title && (
                                <div className={`text-[28px] md:text-[36px] font-serif ${titleColor(index)}`}>
                                    {item.title}
                                </div>
                            )}
                            <div className={`text-base md:text-[20px] flex flex-col gap-4 items-center justify-center ${isEven ? "md:items-start" : "md:items-end"}`}>
                                {item.description}
                            </div>
                        </ScrollReveal>
                        <ScrollReveal
                            variant={isEven ? "slide-left" : "slide-right"}
                            className="basis-0 grow h-fit max-h-[400px] aspect-square relative"
                        >
                            <Image
                                src={item.image}
                                alt="Alternate Picture Layout Image"
                                className="w-full h-full object-contain"
                            />
                        </ScrollReveal>
                    </div>
                )
            })}
        </div>
    )
}

export default AlternatingPictureLayout
