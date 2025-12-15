"use client"

import Image from "next/image"
import React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import NewsCarousel from "@/components/NewsCarousel"
import Header from "@/components/public-ui/Header"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Button from "@/components/public-ui/Button"
import ConvexImage from "@/components/images/ConvexImage"
import { notFound } from "next/navigation"

import { Id } from "@/convex/_generated/dataModel"
import SponsorAHorseMenu from "@/components/donation-widgets/SponsorAHorseMenu"
import Link from "next/link"
import ExampleHorse from "./example-horse-image.png"

type IndividualHorsePageProps = {
    params: Promise<{
        horseId: string
    }>
}

const IndividualHorsePage = ({ params }: IndividualHorsePageProps) => {
    const resolvedParams = React.use(params)
    const animal = useQuery(api.animals.getAnimalBySlug, {
        slug: resolvedParams.horseId,
    })
    const galleryImagesRaw = useQuery(api.animals.getAnimalGalleryImages, {
        ids: animal?._id ? [animal._id] : [] as Id<"animals">[]
    })
    const galleryImages = galleryImagesRaw
        ? Object.values(galleryImagesRaw)?.[0]?.images || []
        : []

    if (animal === undefined) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        )
    }

    if (animal === null) {
        notFound()
    }

    return (
        <div className="w-full h-fit my-16 flex flex-col items-center justify-start gap-16">
            <div className="w-10/12 flex flex-col items-center justify-center gap-8">
                <div className="w-full h-fit flex gap-8 items-center justify-center">
                    <div className="relative w-1/2 h-[300px]">
                        {animal.image?.url ? (
                            <ConvexImage
                                src={animal.image.url}
                                alt={animal.name}
                                width={animal.image.width || 600}
                                height={animal.image.height || 400}
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <Image
                                src={ExampleHorse}
                                alt={animal.name}
                                className="w-full h-full object-cover object-center"
                                fill
                            />
                        )}
                    </div>
                    <div className="w-1/2">
                        <div className="text-3xl font-serif text-pewter">
                            {animal.name}
                        </div>
                        <div className="text-lg text-left text-gray-500 uppercase font-semibold">
                            {[
                                animal.gender,
                                animal.dob ? `${new Date().getFullYear() - new Date(animal.dob).getFullYear()} years old` : null,
                                animal.herd?.name,
                                animal.sanctuary
                            ].filter(Boolean).join(" | ")}
                        </div>
                        <div className="text-lg text-left">
                            {animal.description}
                        </div>
                    </div>
                </div>

                {animal.content && (
                    <div
                        className="text-lg prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: animal.content }}
                    />
                )}
            </div>

            <NewsCarousel
                title="Latest News"
                bgColor="seashell"
            />

            {galleryImages && galleryImages.length > 0 && (
                <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-4">
                    <Header color="sage-green" className="text-4xl">
                        Gallery
                    </Header>
                    <Carousel
                        nDisplayItems={1}
                        autoPlay={"right"}
                        transitionDuration={1500}
                        autoPlayInterval={6000}
                        leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                        rightButton={<FaCaretRight size={30} className="text-pewter" />}
                        items={galleryImages
                            .filter(x => !!x)
                            .filter(image => !!image.url)
                            .map((image, index) => ({
                                id: `gallery-item-${index}`,
                                widget: (
                                    <div key={index} className="relative w-full aspect-[16/9]">
                                        <ConvexImage
                                            src={image.url!}
                                            alt={image.altText || `${animal.name} gallery image ${index + 1}`}
                                            width={image.width || 800}
                                            height={image.height || 450}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                )
                            }))}
                    />
                </div>
            )}
            
            <SponsorAHorseMenu title="Explore Other Horses to Sponsor" />
        </div>
    )
}

export default IndividualHorsePage