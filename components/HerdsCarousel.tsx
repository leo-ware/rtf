"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import Button from "@/components/public-ui/Button"
import Carousel from "@/components/Carousel"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Header from "./public-ui/Header"

const HerdCard = ({ herd, alwaysShowContent }: {
    herd: {
        name: string
        slug: string
        description?: string
        image?: { url: string | null, altText?: string } | null
    }
    alwaysShowContent?: boolean
}) => {
    return (
        <Link
            href={`/horses/our-herds?slug=${herd.slug}`}
            className="group/card relative block w-full h-[80vh] overflow-hidden"
        >
            {herd.image?.url ? (
                <Image
                    src={herd.image.url}
                    alt={herd.image.altText || herd.name}
                    fill
                    className="object-cover object-center"
                />
            ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                </div>
            )}

            {/* Brownish overlay — more opaque on hover */}
            <div className={`absolute inset-0 transition-all duration-500 ${alwaysShowContent ? "bg-amber-950/55" : "bg-stone-900/20 group-hover/card:bg-amber-950/55"}`} />

            {/* Content container — everything centered */}
            <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                {/* Title — centered, slides up on hover via translate */}
                <h3 className={`text-white text-5xl font-serif drop-shadow-lg transition-transform duration-500 ${alwaysShowContent ? "-translate-y-16" : "group-hover/card:-translate-y-16"}`}>
                    {herd.name}
                </h3>

                {/* Description + button — fade in on hover */}
                <div className={`flex flex-col items-center -mt-1 transition-all duration-500 ${alwaysShowContent ? "opacity-100" : "opacity-0 group-hover/card:opacity-100"}`}>
                    <p className="text-white text-lg leading-relaxed line-clamp-6 max-w-[90%]">
                        {herd.description || "No description available."}
                    </p>
                    <Button color="cinnamon" className="py-1.5 px-4 text-xs tracking-wide mt-5">
                        LEARN MORE ABOUT THIS RESCUE
                    </Button>
                </div>
            </div>
        </Link>
    )
}

const HerdsCarousel = () => {
    const { results: herds } = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })
    const [nDisplay, setNDisplay] = useState(3)

    useEffect(() => {
        const updateDisplay = () => {
            setNDisplay(window.innerWidth < 768 ? 1 : 3)
        }
        updateDisplay()
        window.addEventListener("resize", updateDisplay)
        return () => window.removeEventListener("resize", updateDisplay)
    }, [])

    if (!herds || herds.length === 0) {
        return null
    }

    const isMobile = nDisplay === 1
    const needsCarousel = herds.length > nDisplay

    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-6 py-12">
            <Header className="text-pewter px-6 md:px-0">
                Our Herds
            </Header>
            <div className="w-full h-fit">
                {needsCarousel ? (
                    <Carousel
                        items={herds.map((herd) => ({
                            id: herd._id,
                            widget: <HerdCard herd={herd} alwaysShowContent={isMobile} />
                        }))}
                        nDisplayItems={nDisplay}
                        autoPlay="right"
                        autoPlayInterval={8000}
                        transitionDuration={1200}
                        navigationPosition="bottom"
                        dotIndicators={true}
                        itemGap={false}
                        leftButton={<FaCaretLeft className="w-5 h-5 text-pewter" />}
                        rightButton={<FaCaretRight className="w-5 h-5 text-pewter" />}
                    />
                ) : (
                    <div className="flex justify-center">
                        {herds.map((herd) => (
                            <div key={herd._id} className="flex-1">
                                <HerdCard herd={herd} alwaysShowContent={isMobile} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HerdsCarousel
