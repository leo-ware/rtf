"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import StorytellerCard from "./StorytellerCard"
import Callout from "@/components/public-ui/Callout"
import Carousel from "@/components/Carousel"
import Image from "next/image"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { useState, useEffect } from "react"

const OurStorytellersPage = () => {
    const [nDisplay, setNDisplay] = useState(3)

    useEffect(() => {
        const updateDisplay = () => {
            setNDisplay(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3)
        }
        updateDisplay()
        window.addEventListener("resize", updateDisplay)
        return () => window.removeEventListener("resize", updateDisplay)
    }, [])
    const peopleRaw = useQuery(api.people.listPeople, { limit: 100 })
    const people = (peopleRaw || []).map(person => {
        const imageRemote = person.image
        const image = (imageRemote && imageRemote.imageUrl)
            ? {
                src: imageRemote.imageUrl,
                alt: `portrait of ${person.name}`,
                width: imageRemote.width || 382,
                height: imageRemote.height || 315,
            }
            : undefined

        return { ...person, image }
    })

    const storytellers = people.filter(person => person.isStoryTeller)
    const photographers = people.filter(person => person.isPhotographer)
    const photographerIds = photographers.map(p => p._id)
    const photographerWorks = useQuery(
        api.images.listImagesByAuthors,
        photographerIds.length > 0 ? { authorIds: photographerIds } : "skip"
    ) ?? []

    return (
        <>
            <div className="w-11/12 mx-auto h-fit pt-12 pb-16 flex flex-col items-center justify-center gap-16">
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    <h1 className="text-[48px] font-serif text-cinnamon text-center">
                        The Storytellers
                    </h1>
                    <Callout className="text-ink">
                        Return to Freedom&apos;s story reaches far beyond the sanctuary through the voices
                        of artists, actors, writers, photographers, and public figures who believe in
                        protecting wild horses and burros. These storytellers use their platforms and
                        creative work to help bring national attention to the challenges facing
                        America&apos;s wild herds and to inspire compassion, awareness, and action.
                    </Callout>
                </div>

                {storytellers.length > 0 ? (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {storytellers.map(person => (
                            <StorytellerCard
                                key={person._id}
                                name={person.name}
                                title={person.title}
                                bio={person.bio}
                                link={person.link}
                                image={person.image}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-500 italic text-center">
                        No storytellers to display at this time. Check back soon!
                    </p>
                )}
            </div>

            {photographerWorks.length > 0 && (
                <div className="w-full">
                    <Carousel
                        items={photographerWorks.map((image) => ({
                            id: image._id,
                            widget: (
                                <div className="w-full aspect-[4/3] relative overflow-hidden">
                                    <Image
                                        src={image.url!}
                                        alt={image.altText || image.title}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                    />
                                    {image.authorNames.length > 0 && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                                            <span className="text-white text-sm font-medium">
                                                Photo by {image.authorNames.join(", ")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ),
                        }))}
                        nDisplayItems={nDisplay}
                        navigationPosition="bottom"
                        itemGap={false}
                        autoPlay="right"
                        leftButton={<FaCaretLeft size={30} className="text-cinnamon" />}
                        rightButton={<FaCaretRight size={30} className="text-cinnamon" />}
                        transitionDuration={1500}
                        autoPlayInterval={8000}
                    />
                </div>
            )}

            {photographers.length > 0 && (
                <div className="w-11/12 mx-auto pt-16 pb-12 flex flex-col items-center justify-center gap-16">
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        <h2 className="text-[48px] font-serif text-pewter text-center">
                            Photographers
                        </h2>
                        <Callout className="text-ink">
                            Through their lenses, these talented photographers capture the beauty,
                            strength, and spirit of America&apos;s wild horses and burros — bringing
                            the world closer to understanding why these iconic animals deserve
                            protection and freedom.
                        </Callout>
                    </div>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photographers.map(person => (
                            <StorytellerCard
                                key={person._id}
                                name={person.name}
                                title={person.title}
                                bio={person.bio}
                                link={person.link}
                                image={person.image}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default OurStorytellersPage
