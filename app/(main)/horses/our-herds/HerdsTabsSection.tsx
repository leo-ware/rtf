"use client"

import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import Tabs from "@/components/public-ui/Tabs"
import { useQuery, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import SponsorHerdBg from "./imgs/sponsor-herd-bg.jpg"
import SponsorAHerdDialog from "@/components/donation-widgets/SponsorAHerdDialog"
import BlurredImageCard from "@/components/public-ui/BlurredImageCard"
import { ArticleRenderer } from "@/components/ArticleRenderer"
import Carousel from "@/components/Carousel"
import ConvexImage from "@/components/images/ConvexImage"
import GalleryVideoItem from "@/components/GalleryVideoItem"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { useEffect } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const HerdContent = ({ herdId }: { herdId: Id<"herds"> }) => {
    const herd = useQuery(api.herds.getHerd, { id: herdId })
    const timeline = useQuery(api.herds.getHerdTimeline, { herdId })
    const galleryItemsRaw = useQuery(api.herds.getHerdGalleryItems, { ids: [herdId] })
    const galleryItems = galleryItemsRaw?.[0]?.items || []

    useEffect(() => {
        if (herd) {
            trackEvent(AnalyticsEvents.HERD_PROFILE_VIEWED, { name: herd.name, herdId })
        }
    }, [herd, herdId])

    if (!herd) {
        return <div className="text-pewter text-[20px]">Loading herd details...</div>
    }

    return (
        <div className="w-full flex flex-col items-center gap-24 md:gap-32">
            <div className="w-11/12 md:w-8/12 flex flex-col items-center justify-center gap-4">
                <div className="text-cinnamon text-[48px] font-serif">
                    {herd.name}
                </div>

                {herd.image && (
                    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                        {herd.image.url && (
                            <ImageWithAuthorCredit
                                src={herd.image.url}
                                alt={herd.image.altText || herd.name}
                                className="w-full h-full object-cover object-center"
                                fill
                                wrapperClassName="w-full h-full"
                                authorCredit={herd.image.authorCredit}
                            />
                        )}
                    </div>
                )}

                <div className="text-ink text-lg">{herd.description}</div>
            </div>

            {herd.content && (
                <ArticleRenderer
                    content={herd.content}
                    className="text-lg prose prose-lg max-w-10/12"
                />
            )}

            {timeline && timeline.length > 0 && (
                <div className="w-full flex flex-col items-center justify-center gap-8">
                    <div className="text-pewter text-[40px] font-serif">Rescue Timeline</div>
                    <div className="relative w-11/12 md:w-8/12 flex flex-col items-between gap-12">
                        <div className={`hidden md:block absolute top-0 left-1/2 w-1 h-full ${timeline.length > 1 && " border-l-2 border-ink"}`} />
                        {timeline.map((tm, i) => {
                            const even = i % 2 === 0
                            return (
                                <div
                                    key={tm._id}
                                    className={`w-full h-fit flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12
                                                ${even ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    <div className="relative w-full md:basis-0 md:grow h-56 md:h-72 flex flex-col">
                                        {tm.image && tm.image.url && (<ImageWithAuthorCredit
                                            src={tm.image.url}
                                            alt={tm.image.altText || tm.title}
                                            className="w-full h-full object-cover object-center"
                                            fill
                                            wrapperClassName="w-full h-full"
                                            authorCredit={tm.image.authorCredit}
                                        />)}
                                    </div>
                                    <div className={`w-full md:w-auto md:basis-0 md:grow flex flex-col items-start text-left
                                    ${even ? "md:items-end md:text-right" : "md:items-start md:text-left"}`}>
                                        <div className={`text-[24px] font-serif ${even ? "text-cinnamon" : "text-pewter"}`}>
                                            {tm.date}
                                        </div>
                                        <div className={`text-[24px] font-serif ${even ? "text-cinnamon" : "text-pewter"}`}>
                                            {tm.title}
                                        </div>
                                        <ArticleRenderer content={tm.description} className="text-ink" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {galleryItems && galleryItems.length > 0 && (
                <div className="w-11/12 md:w-8/12 h-fit flex flex-col items-center justify-center gap-4">
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
                                                    alt={item.image.altText || `${herd.name} gallery image ${index + 1}`}
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

            <BlurredImageCard
                image={SponsorHerdBg}
                className="w-11/12 md:w-8/12 mx-auto"
            >
                <div className="w-full h-full p-8 md:p-20 flex justify-start md:justify-end">
                    <div className="w-full md:w-5/12 flex flex-col gap-4 items-start justify-start">
                        <div className="text-white text-[40px] text-left font-serif">
                            Sponsor the {herd.name}
                        </div>
                        <div className="text-white text-[20px] text-left">
                            Your sponsorship helps provide food, shelter, and care for the {herd.name}.
                        </div>
                        <SponsorAHerdDialog title={`Sponsor the ${herd.name}`} defaultHerdId={herd._id} />
                    </div>
                </div>
            </BlurredImageCard>
        </div>
    )
}

const HerdsTabsSection = ({ defaultSlug, onHerdChange }: { defaultSlug?: string, onHerdChange?: (herdId: Id<"herds">) => void }) => {
    const { results: herds } = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })

    useEffect(() => {
        if (!onHerdChange || !herds || herds.length === 0) return
        const initial = defaultSlug
            ? herds.find(h => h.slug === defaultSlug) ?? herds[0]
            : herds[0]
        onHerdChange(initial._id)
    }, [herds, defaultSlug, onHerdChange])

    if (!herds) {
        return (
            <div className="w-full h-fit py-16 flex items-center justify-center">
                <div className="text-pewter text-[24px]">Loading herds...</div>
            </div>
        )
    }

    if (herds.length === 0) {
        return (
            <div className="w-full h-fit py-16 flex items-center justify-center">
                <div className="text-pewter text-[24px]">No herds found.</div>
            </div>
        )
    }

    const tabItems = herds.map((herd) => ({
        id: herd._id,
        title: herd.name,
        content: <HerdContent herdId={herd._id} />
    }))

    const defaultTabSelector = defaultSlug
        ? (item: { id: string, title: string, content: React.ReactNode }) => {
            const herd = herds.find(h => h._id === item.id)
            return herd?.slug === defaultSlug
        }
        : undefined

    return (
        <Tabs
            items={tabItems}
            defaultTabSelector={defaultTabSelector}
            onTabChange={(id) => onHerdChange?.(id as Id<"herds">)}
        />
    )
}

export default HerdsTabsSection

