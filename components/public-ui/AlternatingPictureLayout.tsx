"use client"

import { StaticImageData } from "next/image"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import ScrollReveal from "./ScrollReveal"

type AlternatingPictureLayoutProps = {
    items: {
        superTitle?: React.ReactNode
        title?: React.ReactNode
        description: React.ReactNode
        image: StaticImageData | string
        imageAlt?: string
        authorCredit?: string
    }[]
    alternateTitleColors?: boolean
    showDivider?: boolean
    imageMode?: "natural" | "standardized"
}

const AlternatingPictureLayout = ({
    items,
    alternateTitleColors = false,
    showDivider = false,
    imageMode = "standardized"
}: AlternatingPictureLayoutProps) => {
    const titleColor = (idx: number) => {
        if (alternateTitleColors) {
            return ["text-pewter", "text-sage-green", "text-cinnamon"][idx % 3]
        }
        return "text-sage-green"
    }

    return (
        <div className="relative w-full mx-auto h-fit flex flex-col gap-16">
            {showDivider && (
                <div className="absolute top-0 left-0 w-1/2 h-full border-r-2 border-ink" />
            )}
            {items.map((item, index) => {
                const isEven = index % 2 === 0
                const textOrder = isEven ? "md:order-last" : "md:order-first"
                const textAlign = isEven ? "md:text-left md:items-start" : "md:text-right md:items-end"
                const gapSize = showDivider ? "gap-20" : "gap-8"

                return (
                    <div
                        key={`${item.title}-${index}`}
                        className={`w-full h-fit flex flex-col md:flex-row items-center justify-center ${gapSize}`}
                    >
                        <ScrollReveal
                            variant={isEven ? "slide-left" : "slide-right"}
                            className={imageMode === "standardized"
                                ? "md:w-1/2 h-fit max-h-[400px] aspect-square relative"
                                : "md:w-1/2 h-fit flex items-center justify-center"
                            }
                        >
                            {imageMode === "standardized" ? (
                                <ImageWithAuthorCredit
                                    src={item.image}
                                    alt={item.imageAlt || ""}
                                    fill
                                    className="w-full h-full object-cover object-center"
                                    wrapperClassName="w-full h-full"
                                    authorCredit={item.authorCredit}
                                />
                            ) : (
                                <ImageWithAuthorCredit
                                    src={item.image}
                                    alt={item.imageAlt || ""}
                                    width={1200}
                                    height={900}
                                    className="w-full max-h-[800px] h-auto object-contain"
                                    authorCredit={item.authorCredit}
                                />
                            )}
                        </ScrollReveal>
                        <ScrollReveal
                            variant="fade-up"
                            className={`md:w-1/2 flex flex-col gap-4 text-center px-4 md:px-0 ${textAlign} ${textOrder}`}
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
                            <div className={`w-full text-base md:text-[20px] flex flex-col gap-4 items-center ${isEven ? "md:items-start [&>div]:md:flex [&>div]:md:flex-col [&>div]:md:items-start" : "md:items-end [&>div]:md:flex [&>div]:md:flex-col [&>div]:md:items-end"}`}>
                                {item.description}
                            </div>
                        </ScrollReveal>
                    </div>
                )
            })}
        </div>
    )
}

export default AlternatingPictureLayout
