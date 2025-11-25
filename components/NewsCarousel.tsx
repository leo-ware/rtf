"use client"

import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { FunctionReturnType } from "convex/server"

import BrosChilling from "@/public/img/bros-chilling.png"
import Carosel from "@/components/Carousel"

type Article = FunctionReturnType<typeof api.articles.getArticlesByTags>[number]

type NewsCarouselProps = {
    title?: string
    bgColor?: string
    herdId?: Id<"herds">
    animalId?: Id<"animals">
    topic?: "conservation" | "sanctuary" | "advocacy" | "education" | "herd-management" | "population-management" | "roundups" | "horse-slaughter" | "spirit"
}

const NewsCarousel = ({
    title = "Latest News", 
    bgColor = "seashell",
    herdId,
    animalId,
    topic
}: NewsCarouselProps) => {
    const articles = useQuery(api.articles.getArticlesByTags, {
        herdId,
        animalId,
        topic,
        limit: 6,
    })

    if (!articles || articles.length === 0) {
        return null
    }
    
    const items = articles.map((article: Article) => {
        const formattedDate = article.publishedAt 
            ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
            : new Date(article._creationTime).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })

        return {
            id: article._id,
            widget: (
                <Link href={`/news/article/${article.slug}`}>
                    <div className="w-full md:w-[75vw] h-[300px] md:h-[200px] flex md:flex-row flex-col stretch cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="basis-0 grow overflow-hidden">
                            <Image
                                src={article.image?.url || BrosChilling}
                                alt={article.image?.altText || "Article image"}
                                width={400}
                                height={300}
                                className="w-full h-full object-cover" />
                        </div>
                        <div className="basis-0 grow bg-white flex flex-col items-center justify-center">
                            <div className="w-3/4 h-fit md:border-l-4 border-burnt-orange md:pl-4 py-2 gap-2">
                                <div className="text-[12px] text-ink uppercase font-bold">
                                    Return to Freedom News
                                </div>
                                <div className="text-lg font-bold text-pewter">
                                    {article.title}
                                </div>
                                <div className="text-sm">
                                    {formattedDate}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        }
    })

    return (
        <div className={`w-full h-fit pt-12 pb-16 flex flex-col items-center justify-center gap-4 bg-${bgColor}`}>
            <div className="text-4xl font-serif text-cinnamon">{title}</div>
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