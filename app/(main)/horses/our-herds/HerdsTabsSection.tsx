"use client"

import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import Tabs from "@/components/public-ui/Tabs"
import { useQuery, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import SponsorHerdBg from "./imgs/sponsor-herd-bg.jpg"
import SponsorAHerdDialog from "@/components/donation-widgets/SponsorAHerdDialog"
import { ArticleRenderer } from "@/components/ArticleRenderer"
import { useEffect } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const HerdContent = ({ herdId }: { herdId: Id<"herds"> }) => {
    const herd = useQuery(api.herds.getHerd, { id: herdId })
    const timeline = useQuery(api.herds.getHerdTimeline, { herdId })

    useEffect(() => {
        if (herd) {
            trackEvent(AnalyticsEvents.HERD_PROFILE_VIEWED, { name: herd.name, herdId })
        }
    }, [herd, herdId])

    if (!herd) {
        return <div className="text-pewter text-[20px]">Loading herd details...</div>
    }

    return (
        <div className="w-full flex flex-col items-center gap-16">
            <div className="w-11/12 md:w-8/12 flex flex-col items-center justify-center gap-4">
                <div className="text-cinnamon text-[48px] font-serif">
                    {herd.name}
                </div>

                {herd.image && (
                    <div className="relative w-full h-[500px]">
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
                                        <div className="text-ink">{tm.description}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="w-full relative">
                <ImageWithAuthorCredit
                    src={SponsorHerdBg}
                    alt="Sponsor Herd Background"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-bottom"
                    fill
                    wrapperClassName="z-0 absolute top-0 left-0 w-full h-full" />

                <div className="z-10 relative top-0 left-0 w-full h-full p-8 md:p-20 flex justify-start md:justify-end">
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
            </div>
        </div>
    )
}

const HerdsTabsSection = ({ defaultSlug }: { defaultSlug?: string }) => {
    const { results: herds } = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })

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
        />
    )
}

export default HerdsTabsSection

