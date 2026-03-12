"use client"

import { StaticImageData } from "next/image"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import ScrollReveal from "./ScrollReveal"
import Button from "./Button"
import Link from "next/link"

type AlternatingPictureLayoutProps = {
    items: {
        superTitle?: React.ReactNode
        title?: React.ReactNode
        description: React.ReactNode
        image: StaticImageData | string
        imageAlt?: string
        authorCredit?: string
        buttonLabel?: string
        buttonHref?: string
    }[]
    alternateTitleColors?: boolean
    showDivider?: boolean
    imageMode?: "natural" | "standardized"
    className?: string
}

const AlternatingPictureLayout = ({
    items,
    alternateTitleColors = false,
    showDivider = false,
    imageMode = "standardized",
    className
}: AlternatingPictureLayoutProps) => {
    const titleColor = (idx: number) => {
        if (alternateTitleColors) {
            return ["text-pewter", "text-sage-green", "text-cinnamon"][idx % 3]
        }
        return "text-sage-green"
    }

    return (
        <div className={`relative w-10/12 mx-auto h-fit flex flex-col gap-16 ${className ?? ""}`}>
            {showDivider && (
                <div className="absolute top-0 left-0 w-1/2 h-full border-r-2 border-ink hidden lg:block" />
            )}
            {items.map((item, index) => {
                const isEven = index % 2 === 0
                const textOrder = isEven ? "lg:order-last" : "lg:order-first"
                const textAlign = isEven ? "lg:text-left lg:items-start" : "lg:text-right lg:items-end"
                const gapSize = showDivider ? "gap-20" : "gap-8"

                return (
                    <div
                        key={`${item.title}-${index}`}
                        className={`w-full h-fit flex flex-col lg:flex-row items-center justify-center ${gapSize}`}
                    >
                        <ScrollReveal
                            variant={isEven ? "slide-left" : "slide-right"}
                            className={imageMode === "standardized"
                                ? "w-full lg:w-1/2 h-fit max-h-[400px] aspect-square relative rounded-sm overflow-hidden"
                                : "w-full lg:w-1/2 h-fit flex items-center justify-center rounded-sm overflow-hidden"
                            }
                        >
                            {imageMode === "standardized" ? (
                                <ImageWithAuthorCredit
                                    src={item.image}
                                    alt={item.imageAlt || ""}
                                    fill
                                    className="w-full h-full object-cover object-center rounded-sm"
                                    wrapperClassName="w-full h-full"
                                    authorCredit={item.authorCredit}
                                />
                            ) : (
                                <ImageWithAuthorCredit
                                    src={item.image}
                                    alt={item.imageAlt || ""}
                                    width={1200}
                                    height={900}
                                    className="w-full h-auto max-h-[500px] object-contain rounded-sm"
                                    wrapperClassName="w-full"
                                    authorCredit={item.authorCredit}
                                />
                            )}
                        </ScrollReveal>
                        <ScrollReveal
                            variant="fade-up"
                            className={`lg:w-1/2 flex flex-col gap-4 text-left lg:text-center px-4 lg:px-0 items-start lg:items-center ${textAlign} ${textOrder}`}
                        >
                            {item.superTitle && (
                                <div className="text-xl lg:text-[25px] text-ink">
                                    {item.superTitle}
                                </div>
                            )}
                            {item.title && (
                                <div className={`text-[28px] lg:text-[36px] font-serif ${titleColor(index)}`}>
                                    {item.title}
                                </div>
                            )}
                            <div className={`w-full text-base lg:text-[20px] flex flex-col gap-4 items-center ${isEven ? "lg:items-start [&>div]:lg:flex [&>div]:lg:flex-col [&>div]:lg:items-start" : "lg:items-end [&>div]:lg:flex [&>div]:lg:flex-col [&>div]:lg:items-end"}`}>
                                {item.description}
                            </div>
                            {item.buttonLabel && item.buttonHref && (
                                <Link href={item.buttonHref}>
                                    <Button size="large" color="cinnamon">
                                        {item.buttonLabel}
                                    </Button>
                                </Link>
                            )}
                        </ScrollReveal>
                    </div>
                )
            })}
        </div>
    )
}

export default AlternatingPictureLayout
