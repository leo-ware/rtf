"use client"

import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formatDate } from "@/lib/utils"

import BrosChilling from "@/public/img/bros-chilling.png"
import Carosel from "@/components/Carousel"

type TopicType = "homepage" | "conservation" | "sanctuary" | "advocacy" | "education" | "herd_management" | "population_management" | "roundups" | "horse_slaughter" | "spirit"

type NewsCarouselProps = {
    title?: string
    bgColor?: string
    herdId?: Id<"herds">
    animalId?: Id<"animals">
    topic?: TopicType
    preventFallback?: boolean
}

const NewsCarousel = ({
    title = "Latest News",
    bgColor = "seashell",
    topic,
    preventFallback = false,
}: NewsCarouselProps) => {
    const [topicState, setTopicState] = useState<TopicType | undefined>(topic)

    const { results: topicArticles, status } = usePaginatedQuery(api.articleMetadata.carouselSearch, {
        topic: topicState,
    }, { initialNumItems: 4 })

    const articles = topicArticles

    useEffect(() => {
        setTopicState(topic)
    }, [topic])

    // if we can't find any articles for this topic, fallback to loading any articles we can find
    useEffect(() => {
        if (status !== "LoadingFirstPage" && articles.length === 0 && !preventFallback) {
            setTopicState(undefined)
        }
    }, [status, articles])

    if (!articles || articles.length === 0) {
        return null
    }

    const items = articles.map((article) => {
        const formattedDate = article.date
            ? formatDate(new Date(article.date))
            : formatDate(new Date(article._creationTime))

        return {
            id: article._id,
            widget: (
                <Link href={article.link}>
                    <div className={`
                        w-full sm:w-[75vw] h-[80vh] sm:h-[300px]
                        flex flex-col sm:flex-row stretch
                        cursor-pointer hover:opacity-90 transition-opacity
                        `}>
                        <div className="h-5/12 sm:h-full basis-0 grow overflow-hidden">
                            <Image
                                src={article.image?.url || BrosChilling}
                                alt={article.image?.altText || "Article image"}
                                width={article.image?.width || 400}
                                height={article.image?.height || 300}
                                className="w-full h-full object-cover" />
                        </div>
                        <div className="basis-0 grow bg-white flex flex-col items-center justify-center">
                            <div className="w-3/4 h-fit md:border-l-4 border-burnt-orange md:pl-4 py-2 flex flex-col justify-start gap-2">
                                <div className="text-sm">
                                    {formattedDate}
                                </div>
                                <div className="text-[12px] text-ink uppercase font-semibold tracking-wider leading-tight">
                                    Return to Freedom News
                                </div>
                                <div className="text-[20px] md:text-[28px] font-serif text-pewter line-clamp-2">
                                    {article.title}
                                </div>
                                <div className="text-[14px] md:text-[16px] text-ink line-clamp-3">
                                    {article.excerpt}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        }
    })

    return (
        <div className={`w-full h-fit pt-12 pb-16 flex flex-col items-center justify-center gap-6 bg-${bgColor}`}>
            <div className="px-4 text-[32px] md:text-[48px] font-serif text-cinnamon underline decoration-cinnamon decoration-2 underline-offset-8 md:underline-offset-12">
                {title}
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <Carosel
                    items={items}
                    nDisplayItems={1}
                    autoPlay={"right"}
                    leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                    rightButton={<FaCaretRight size={30} className="text-pewter" />}
                    transitionDuration={1500}
                    autoPlayInterval={6000}
                />
            </div>
        </div>
    )
}

export default NewsCarousel