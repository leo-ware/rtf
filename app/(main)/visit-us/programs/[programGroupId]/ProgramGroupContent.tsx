"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import DefaultHeroImage from "./default-program-image.png"
import DefaultEventImage from "./default-event-image.jpg"
import ConvexImage from "@/components/images/ConvexImage"
import Header from "@/components/public-ui/Header"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import RegisterButton from "@/components/RegisterButton"
import Button from "@/components/public-ui/Button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Doc } from "@/convex/_generated/dataModel"
import Carousel from "@/components/Carousel"
import GalleryVideoItem from "@/components/GalleryVideoItem"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"

type ProgramGroupContentProps = {
    programGroupId: Id<"programGroups">
}

const ProgramGroupContent = ({ programGroupId }: ProgramGroupContentProps) => {
    const programGroup = useQuery(
        api.programs.getProgramGroupById,
        { id: programGroupId }
    )

    const galleryItems = useQuery(
        api.programs.getGalleryImagesForProgramGroup,
        { programGroupId }
    )

    const [openIdx, setOpenIdx] = useState<number | undefined>(undefined)

    if (programGroup === null) {
        return notFound()
    }

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">

            <div className="relative w-full h-[50vh]">
                {programGroup?.image?.url ? (
                    <ConvexImage
                        src={programGroup?.image?.url || ""}
                        imageId={programGroup?.image?._id}
                        alt={programGroup?.image?.altText || ""}
                        width={programGroup?.image?.width || 0}
                        height={programGroup?.image?.height || 0}
                        className="w-full h-full object-cover"
                        authorCredit={programGroup?.image?.authorCredit}
                    />
                ) : (
                    <ImageWithAuthorCredit
                        src={DefaultHeroImage}
                        alt="Default Event Image"
                        className="w-full h-full object-cover"
                        fill
                        wrapperClassName="w-full h-full"
                    />
                )}
            </div>

            <div className="w-10/12 h-fit mx-auto pb-12 flex flex-col items-center justify-center gap-16">
                <Header level={1} className="text-pewter w-full">
                    {programGroup?.name || ""}
                </Header>
                {programGroup?.programs && programGroup?.programs.length > 0
                    ? (<div className="w-full h-full flex flex-col items-center justify-center gap-12">
                        {programGroup?.programs.map((program, i) => {
                            const isOpen = openIdx === i
                            const openSelf = () => setOpenIdx(i)
                            const closeSelf = () => setOpenIdx(undefined)

                            return (
                                <div key={program._id} className="w-full flex gap-6 items-start justify-center">
                                    <div className="relative basis-[40%] aspect-[4/3] rounded-sm overflow-hidden">
                                        {program.image?.url ? (
                                            <ConvexImage
                                                src={program.image?.url || ""}
                                                imageId={program.image?._id}
                                                alt={program.image?.altText || ""}
                                                width={program.image?.width || 0}
                                                height={program.image?.height || 0}
                                                className="w-full h-full object-cover"
                                                authorCredit={program.image?.authorCredit}
                                            />
                                        ) : (
                                            <ImageWithAuthorCredit
                                                src={DefaultEventImage}
                                                alt="Default Event Image"
                                                className="w-full h-full object-cover"
                                                fill
                                                wrapperClassName="w-full h-full"
                                            />
                                        )}
                                    </div>

                                    <div className="basis-0 grow flex flex-col gap-4 text-[20px]">
                                        <Header level={2} className="text-sage-green text-left md:text-left">{program.name}</Header>
                                        <p>{program.description}</p>
                                        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                            <div className="overflow-hidden">
                                                <div className="flex flex-col gap-4 pt-1">
                                                    <div>
                                                        <div dangerouslySetInnerHTML={{ __html: program.details }} />
                                                        {program.ticketPriceText && (
                                                            <div className="text-lg text-pewter mt-4">
                                                                {program.ticketPriceText}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(() => {
                                                        const now = Date.now()
                                                        const upcoming = (program.events ?? [])
                                                            .filter((e: Doc<"events">) => e.dateNumber > now)
                                                            .sort((a: Doc<"events">, b: Doc<"events">) => a.dateNumber - b.dateNumber)
                                                            .slice(0, 3)

                                                        if (upcoming.length === 0) return null

                                                        return (
                                                            <div className="flex flex-wrap gap-3">
                                                                {upcoming.map((event: Doc<"events">) => {
                                                                    const start = new Date(event.startDate)
                                                                    const inactive = event.status === "cancelled" || event.status === "sold_out"
                                                                    return (
                                                                        <Link
                                                                            key={event._id}
                                                                            href={`/visit-us/events/${event._id}`}
                                                                            className={`rounded-lg border-2 border-cinnamon bg-white px-4 py-3 text-center transition-colors ${inactive ? "" : "hover:bg-cinnamon/5"}`}
                                                                        >
                                                                            <div className={`text-[15px] font-semibold text-cinnamon ${inactive ? "line-through opacity-50" : ""}`}>
                                                                                {formatDate(start, { includeYear: false })}
                                                                            </div>
                                                                            <div className={`text-[13px] text-gray-400 ${inactive ? "line-through opacity-50" : ""}`}>
                                                                                {start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            </div>
                                                                            {event.status === "cancelled" && (
                                                                                <div className="text-[12px] text-gray-400 uppercase mt-1">Cancelled</div>
                                                                            )}
                                                                            {event.status === "sold_out" && (
                                                                                <div className="text-[12px] text-gray-400 uppercase mt-1">Sold Out</div>
                                                                            )}
                                                                        </Link>
                                                                    )
                                                                })}
                                                            </div>
                                                        )
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-start gap-2">
                                            <Button
                                                onClick={isOpen ? closeSelf : openSelf}
                                                color="cinnamon"
                                                variant="outline"
                                                size="large"
                                                >
                                                {isOpen ? "Show Less" : "Show More"}
                                            </Button>
                                            <RegisterButton programId={program._id} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-lg">No programs found</p>
                        </div>
                    )
                }
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
                                                    imageId={item.image._id}
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

export default ProgramGroupContent
