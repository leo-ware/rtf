"use client"

import Image from "next/image"
import Tabs from "@/components/public-ui/Tabs"
import { useQuery, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import SponsorHerdBg from "./imgs/sponsor-herd-bg.jpg"
import SponsorAHerdDialog from "@/components/donation-widgets/SponsorAHerdDialog"

const HerdContent = ({ herdId }: { herdId: Id<"herds"> }) => {
    const herd = useQuery(api.herds.getHerd, { id: herdId })
    const timeline = useQuery(api.herds.getHerdTimeline, { herdId })

    if (!herd) {
        return <div className="text-pewter text-[20px]">Loading herd details...</div>
    }

    return (
        <div className="w-full flex flex-col items-center gap-16">
            <div className="w-8/12 flex flex-col items-center justify-center gap-4">
                <div className="text-cinnamon text-[48px] font-serif">
                    {herd.name}
                </div>

                {herd.image && (
                    <div className="relative w-full h-[500px]">
                        {herd.image.url && (
                            <Image
                                src={herd.image.url}
                                alt={herd.image.altText || herd.name}
                                className="w-full h-full object-cover object-center"
                                fill
                            />
                        )}
                    </div>
                )}

                <div className="text-ink text-lg">{herd.description}</div>
            </div>

            {herd.content && (
                <div
                    dangerouslySetInnerHTML={{ __html: herd.content }}
                    className="text-lg prose prose-lg max-w-10/12"
                />
            )}

            {timeline && timeline.length > 0 && (
                <div className="w-full flex flex-col items-center justify-center gap-8">
                    <div className="text-pewter text-[40px] font-serif">Rescue Timeline</div>
                    <div className="relative w-8/12 flex flex-col items-between gap-12">
                        <div className={`absolute top-0 left-1/2 w-1 h-full ${timeline.length > 1 && " border-l-2 border-ink"}`} />
                        {timeline.map((tm, i) => {
                            const even = i % 2 === 0
                            return (
                                <div
                                    key={tm._id}
                                    className={`w-full h-fit flex items-center justify-between gap-12
                                                ${even ? "flex-row" : "flex-row-reverse"}`}>
                                    <div className={`basis-0 grow flex flex-col
                                    ${even ? "items-end text-right" : "items-start text-left"}`}>
                                        <div className={`text-[24px] font-serif ${even ? "text-cinnamon" : "text-pewter"}`}>
                                            {tm.date}
                                        </div>
                                        <div className={`text-[24px] font-serif ${even ? "text-cinnamon" : "text-pewter"}`}>
                                            {tm.title}
                                        </div>
                                        <div className="text-ink">{tm.description}</div>
                                    </div>
                                    <div className="relative basis-0 grow h-72 flex flex-col">
                                        {tm.image && tm.image.url && (<Image
                                            src={tm.image.url}
                                            alt={tm.image.altText || tm.title}
                                            className="w-full h-full object-cover object-center"
                                            fill
                                        />)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="z-0 w-full relative">
                <Image
                    src={SponsorHerdBg}
                    alt="Sponsor Herd Background"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-bottom" fill />

                <div className="z-10 relative top-0 left-0 w-full h-full p-20 flex justify-end">
                    <div className="w-5/12 flex flex-col gap-4 items-start justify-start">
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

