"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import Button from "@/components/public-ui/Button"
import Link from "next/link"
import Hero from "@/components/public-ui/Hero"
import UpcomingEventsWidget from "@/components/UpcomingEventsWidget"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import Carousel from "@/components/Carousel"
import ConvexImage from "@/components/images/ConvexImage"
import GalleryVideoItem from "@/components/GalleryVideoItem"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"

import HeroImg from "./visit-us-hero.jpg"
import DefaultEventImage from "./defaultEventImage.png"

const VisitPage = () => {
    const programGroupsRaw = useQuery(api.programs.getPublicProgramGroups)
    const galleryItems = useQuery(api.programs.getGalleryImagesForAllPrograms)
    const status = programGroupsRaw === undefined
        ? "loading"
        : programGroupsRaw.length === 0
            ? "empty"
            : "success"

    const programGroupsSorted = (programGroupsRaw || [])
        .sort((a, b) => a.order - b.order)
        .map((group) => {
            const programLink = `/visit-us/programs/${group._id}`
            return {...group, link: programLink}
        })
    const syntheticProgramGroups = [
        {
            name: "Your Weddings and Events",
            description: "Host your wedding, fundraiser, retreat, or private gathering at our sanctuary on California's Central Coast.",
            link: "/visit-us/host-your-event",
        }
    ].map((g, i) => ({...g, _id: `synthetic-${i}`, image: undefined}))

    const programGroups = [
        ...programGroupsSorted,
        ...syntheticProgramGroups,
    ]

    const items = programGroups.map((group) => ({
        title: (
            <Link href={group.link} className="hover:underline">
                {group.name}
            </Link>
        ),
        description: (
            <div>
                <p className="my-2">{group.description}</p>
                <Link href={group.link}>
                    <Button color="cinnamon" className="py-1 px-2">Read More</Button>
                </Link>
            </div>
        ),
        image: group.image?.url || DefaultEventImage,
        imageAlt: group.image?.altText || group.name,
        authorCredit: group.image?.authorCredit,
    }))

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <div className="w-full h-fit">
                <Hero title="Programs" image={HeroImg} />

                <div className="w-full h-fit bg-seashell py-12">
                    <Header className="text-pewter px-8">Upcoming Programs and Special Events</Header>
                    <UpcomingEventsWidget />
                </div>
            </div>
            <div className="w-full py-16">
                {status === "loading" && (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                )}

                {status === "empty" && (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-lg">No program groups found</p>
                    </div>
                )}

                {status === "success" && (
                    <AlternatingPictureLayout
                        alternateTitleColors
                        items={items}
                    />
                )}
            </div>

            {galleryItems && galleryItems.length > 0 && (
                <div className="w-8/12 h-fit flex flex-col items-center justify-center gap-4 mb-16">
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
                                                    alt={item.image.altText || `Gallery image ${index + 1}`}
                                                    width={item.image.width || 800}
                                                    height={item.image.height || 450}
                                                    className="w-full h-full object-cover object-center"
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
    )
}

export default VisitPage
