"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PersonCard } from "../people/PersonCard"
import Carousel from "@/components/Carousel"
import Image from "next/image"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"

const OurStorytellersPage = () => {
    const peopleRaw = useQuery(api.people.listPeople, { limit: 100 });
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

    const storytellers = people.filter(person => person.isStoryTeller);
    const ambassadors = people.filter(person => person.isAmbassador);
    const storytellersWithImages = [...storytellers, ...ambassadors].filter(person => person.image);

    return (
        <div className="w-11/12 mx-auto h-fit py-12 flex flex-col items-center justify-center gap-12">
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <div className="text-[48px] font-serif text-cinnamon text-center">
                    Our Storytellers
                </div>
                <div className="w-10/12 md:w-8/12 lg:max-w-1/3 text-center text-lg italic">
                    Return to Freedom&apos;s story reaches far beyond the sanctuary through the voices
                    of artists, actors, writers, photographers, and public figures who believe in
                    protecting wild horses and burros. These storytellers use their platforms and
                    creative work to help bring national attention to the challenges facing
                    America&apos;s wild herds and to inspire compassion, awareness, and action.
                </div>
            </div>
            {storytellers.length > 0 ? (
                <div className="w-full md:w-1/2 h-fit grid grid-cols-1 md:grid-cols-2 gap-12">
                    {storytellers.map(person => (
                        <div key={person._id} className="w-full h-fit">
                            <PersonCard person={person} size="large" />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-stone-500 italic text-center">
                    No storytellers to display at this time. Check back soon!
                </p>
            )}
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <div className="text-[48px] font-serif text-pewter text-center">
                    Artists and Ambassadors
                </div>
            </div>
            {ambassadors.length > 0 ? (
                <div className="w-full md:w-1/2 h-fit grid grid-cols-1 md:grid-cols-2 gap-12">
                    {ambassadors.map(person => (
                        <div key={person._id} className="w-full h-fit">
                            <PersonCard person={person} size="medium" />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-stone-500 italic text-center">
                    No artists or ambassadors to display at this time. Check back soon!
                </p>
            )}

            {storytellersWithImages.length > 0 && (
                <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-[36px] font-serif text-pewter text-center">
                        Gallery
                    </div>
                    <div className="w-full">
                        <Carousel
                            items={storytellersWithImages.map((person) => ({
                                id: person._id,
                                widget: (
                                    <div className="w-[80vw] md:w-[60vw] lg:w-[40vw] aspect-[4/3] relative rounded-sm overflow-hidden">
                                        <Image
                                            src={person.image!.src}
                                            alt={person.image!.alt}
                                            fill
                                            className="object-cover"
                                            loader={({ src }) => src}
                                            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 60vw, 40vw"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                                            <span className="text-white text-sm font-medium">{person.name}</span>
                                        </div>
                                    </div>
                                )
                            }))}
                            nDisplayItems={1}
                            autoPlay={"right"}
                            leftButton={<FaCaretLeft size={30} className="text-cinnamon" />}
                            rightButton={<FaCaretRight size={30} className="text-cinnamon" />}
                            transitionDuration={1500}
                            autoPlayInterval={8000}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default OurStorytellersPage