"use client"

import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Image from "next/image"

import BrosChilling from "@/public/img/bros-chilling.png"
import Carosel from "@/components/Carousel"

const articles = [
    {
        outlet: "Bloodhorse Daily",
        title: "Mustang Movie a Fine Fit With SAFE ACT Campaign",
        date: "September 20, 2025",
        image: BrosChilling,
        link: "/news/article/mustang-movie-a-fine-fit-with-safe-act-campaign"
    },
    {
        outlet: "Lorem Ipsum",
        title: "Lorem Ipsum Dolor Sit Amet",
        date: "September 20, 2025",
        image: BrosChilling,
        link: "/news/article/lorem-ipsum-dolor-sit-amet"
    },
    {
        outlet: "Gallium est in elementis",
        title: "Quod licet Iovi, non licet homini",
        date: "September 20, 2025",
        image: BrosChilling,
        link: "/news/article/gallium-est-in-elementis"
    }
]

const NewsCarousel = () => {

    const items = articles.map((article) => ({
        id: article.link,
        widget: (
            <div className="w-[75vw] h-[200px] flex">
                <div className="w-1/2 h-full overflow-hidden">
                    <Image
                        src={article.image}
                        alt="Image for news article"
                        className="w-full h-full object-cover" />
                </div>
                <div className="w-1/2 h-full bg-white flex flex-col items-center justify-center">
                    <div className="w-3/4 h-fit border-l-4 border-burnt-orange pl-4 py-2 gap-2">
                        <div className="text-[12px] text-ink uppercase font-bold">
                            {article.outlet}
                        </div>
                        <div className="text-lg font-bold text-pewter">
                            {article.title}
                        </div>
                        <div className="text-sm">
                            {article.date}
                        </div>
                    </div>
                </div>
            </div>
        )
    }))

    return (
        <div className="w-full h-fit py-8 bg-seashell flex flex-col items-center justify-center gap-4">
            <div className="text-3xl font-bold text-pewter">RTF in the News</div>
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