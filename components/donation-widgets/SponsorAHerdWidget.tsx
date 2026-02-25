"use client"

import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import SponsorAHerdImg from "./imgs/spirit.png"
import { useEffect, useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import SalsaDonateFormEmbed from "../SalsaDonateFormEmbed"
import { DialogClose } from "@/components/public-ui/Dialog"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import { IoMdClose } from "react-icons/io"

const SponsorAHerdWidget = ({ defaultHerdId }: { defaultHerdId?: Id<"herds"> }) => {
    const {results: herds} = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })
    const [selectedHerdId, setSelectedHerdId] = useState<Id<"herds"> | null>(null)
    const selectedHerd = herds?.find((herd) => herd._id === selectedHerdId)

    useEffect(() => {
        trackEvent(AnalyticsEvents.SPONSOR_HERD_DIALOG_OPENED, {
            defaultHerdId: defaultHerdId || undefined,
        })
    }, [])

    useEffect(() => {
        if (herds && herds.length > 0) {
            setSelectedHerdId(herds[0]._id)
        }
    }, [herds])

    return (
        <div className="w-full md:w-[75vw] min-h-full md:min-h-0 md:h-auto relative bg-sage-green md:rounded-md text-milk">
            {/* Close button - fixed on mobile for always-visible access */}
            <DialogClose className="fixed md:absolute top-4 right-4 z-20 text-white text-2xl">
                <IoMdClose />
            </DialogClose>

            <div className="relative w-full h-[200px] md:h-[400px] shrink-0">
                <ImageWithAuthorCredit
                    src={SponsorAHerdImg}
                    alt="Sponsor A Herd"
                    fill
                    className="w-full h-full object-cover object-center"
                    wrapperClassName="w-full h-full" />
            </div>
            <div className="w-full flex flex-col gap-4 md:gap-6 px-4 py-4 md:px-12 md:py-8 basis-0 grow">
                <div className="text-left flex flex-col gap-2 md:gap-3">
                    <div className="text-xl md:text-3xl font-serif">
                        Sponsor A Herd
                    </div>
                    <select
                        className="w-fit uppercase font-semibold"
                        value={selectedHerdId ?? undefined}
                        onChange={(e) => setSelectedHerdId(e.target.value as Id<"herds">)}>
                        {herds?.map((herd) => (
                            <option key={herd._id} value={herd._id}>
                                {herd.name}
                            </option>
                        ))}
                    </select>
                    <div className="text-lg">
                        {selectedHerd?.description}
                    </div>
                </div>
                <div className="w-full mb-4 md:mb-6 text-milk text-left flex gap-4 md:gap-8">
                    {selectedHerd?.donationFormId && (
                        <div className="w-full h-fit px-[-10px]">
                            <SalsaDonateFormEmbed donationFormId={selectedHerd.donationFormId} />
                        </div>
                    )}
                    {selectedHerd && !selectedHerd.donationFormId && (
                        <div className="text-lg">
                            Donations have not been configured for this herd.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SponsorAHerdWidget;