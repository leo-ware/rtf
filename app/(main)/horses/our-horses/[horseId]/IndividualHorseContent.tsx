"use client"

import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import NewsCarousel from "@/components/NewsCarousel"
import Header from "@/components/public-ui/Header"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Button from "@/components/public-ui/Button"
import ConvexImage from "@/components/images/ConvexImage"
import GalleryVideoItem from "@/components/GalleryVideoItem"
import { notFound } from "next/navigation"
import { horseDetailsString } from "@/lib/utils"
import SponsorAHorseDialog from "@/components/donation-widgets/SponsorAHorseDialog"

import { Id } from "@/convex/_generated/dataModel"
import SponsorAHorseMenu from "@/components/donation-widgets/SponsorAHorseMenu"
import ExampleHorse from "./example-horse-image.png"
import { ArticleRenderer } from "@/components/ArticleRenderer"
import { useEffect } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

type IndividualHorseContentProps = {
    horseSlug: string
}

const IndividualHorseContent = ({ horseSlug }: IndividualHorseContentProps) => {
    const animal = useQuery(api.animals.getAnimalBySlug, {
        slug: horseSlug,
    })
    const galleryItemsRaw = useQuery(api.animals.getAnimalGalleryItems, {
        ids: animal?._id ? [animal._id] : [] as Id<"animals">[]
    })
    const galleryItems = galleryItemsRaw
        ? Object.values(galleryItemsRaw)?.[0]?.items || []
        : []

    useEffect(() => {
        if (animal) {
            trackEvent(AnalyticsEvents.HORSE_PROFILE_VIEWED, { name: animal.name, slug: horseSlug })
        }
    }, [animal, horseSlug])

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
                    <div className="relative w-1/2 h-[300px] overflow-hidden rounded-sm">
                        {animal.image?.url ? (
                            <ConvexImage
                                src={animal.image.url}
                                alt={animal.name}
                                width={animal.image.width || 600}
                                height={animal.image.height || 400}
                                className="w-full h-full object-cover object-center"
                                authorCredit={animal.image.authorCredit}
                            />
                        ) : (
                            <ImageWithAuthorCredit
                                src={ExampleHorse}
                                alt={animal.name}
                                className="w-full h-full object-cover object-center"
                                fill
                                wrapperClassName="w-full h-full"
                            />
                        )}
                    </div>
                    <div className="w-1/2 flex flex-col items-start justify-center gap-2">
                        <div className="text-3xl font-serif text-pewter">
                            {animal.name}
                        </div>
                        <div className="text-lg text-left text-gray-500 uppercase font-semibold">
                            {horseDetailsString(animal as any)}
                        </div>
                        <div className="text-lg text-left">
                            {animal.description}
                        </div>
                        <SponsorAHorseDialog animalId={animal._id}>
                            <Button color="cinnamon" size="medium">
                                Sponsor {animal.name}
                            </Button>
                        </SponsorAHorseDialog>
                    </div>
                </div>

                {animal.content && (
                    <ArticleRenderer
                        content={animal.content}
                        className="text-lg prose prose-lg max-w-none"
                    />
                )}

                {galleryItems && galleryItems.length > 0 && (
                    <div className="w-8/12 h-fit flex flex-col items-center justify-center gap-4 mt-8">
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
                            items={galleryItems
                                .filter(item => !!item)
                                .map((item, index) => {
                                    if (item.type === "image" && item.image?.url) {
                                        return {
                                            id: `gallery-item-${index}`,
                                            widget: (
                                                <div key={index} className="relative w-full aspect-[16/9]">
                                                    <ConvexImage
                                                        src={item.image.url}
                                                        alt={item.image.altText || `${animal.name} gallery image ${index + 1}`}
                                                        width={item.image.width || 800}
                                                        height={item.image.height || 450}
                                                        className="w-full h-full object-cover object-center"
                                                        authorCredit={"authorCredit" in item.image ? (item.image.authorCredit as string | undefined) : undefined}
                                                    />
                                                </div>
                                            )
                                        }
                                    } else if (item.type === "video" && item.videoSource && item.videoId) {
                                        return {
                                            id: `gallery-item-${index}`,
                                            widget: (
                                                <GalleryVideoItem
                                                    key={index}
                                                    videoSource={item.videoSource}
                                                    videoId={item.videoId}
                                                    videoTitle={item.videoTitle}
                                                    thumbnailUrl={item.thumbnailUrl}
                                                />
                                            )
                                        }
                                    }
                                    return null
                                })
                                .filter(item => item !== null)}
                        />
                    </div>
                )}
            </div>

            <NewsCarousel
                title="Latest News"
                bgColor="seashell"
            />

            <SponsorAHorseMenu
                title="Explore Other Horses to Sponsor"
                excludeAnimalIds={[animal._id]}
            />
        </div>
    )
}

export default IndividualHorseContent
