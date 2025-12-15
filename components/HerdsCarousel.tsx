"use client"

import Image from "next/image"
import Link from "next/link"
import Button from "@/components/public-ui/Button"
import Carousel from "@/components/Carousel"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"

const HerdsCarousel = () => {
    const {results: herds} = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })

    if (!herds || herds.length === 0) {
        return null
    }

    const carouselItems = herds.map((herd) => ({
        id: herd._id,
        widget: (
            <div className="w-full h-fit flex items-center justify-center gap-6">
                <div className="relative w-1/2 h-[450px]">
                    {(herd.image && herd.image.url) ? (
                        <Image
                            src={herd.image.url}
                            alt={herd.image.altText || herd.name}
                            className="w-full h-full object-cover object-center"
                            fill
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                        </div>
                    )}
                </div>
                <div className="w-1/2 h-fit flex flex-col items-start justify-center gap-2">
                    <div className="text-pewter text-3xl font-serif">
                        {herd.name}
                    </div>
                    <div className="text-lg text-left">
                        {herd.description || "No description available."}
                    </div>
                    <Link href={`/horses/our-herds?slug=${herd.slug}`}>
                        <Button color="cinnamon" className="py-1 px-4">
                            LEARN MORE ABOUT THE {herd.name.toUpperCase()}
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }))

    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
            <div className="text-sage-green text-[48px] font-serif">
                Our Herds
            </div>
            <div className="w-full h-fit">
                <div className="w-10/12 mx-auto h-fit">
                    <Carousel 
                        items={carouselItems}
                        nDisplayItems={1}
                        autoPlay="right"
                        autoPlayInterval={5000}
                        leftButton={<FaCaretLeft className="w-8 h-8 text-pewter" />}
                        rightButton={<FaCaretRight className="w-8 h-8 text-pewter" />}
                    />
                </div>
            </div>
        </div>
    )
}

export default HerdsCarousel
