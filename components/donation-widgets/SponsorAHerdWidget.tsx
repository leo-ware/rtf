"use client"

import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import SponsorAHerdImg from "./spirit.png"
import { useEffect, useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import SalsaDonateFormEmbed from "../SalsaDonateFormEmbed"

const SponsorAHerdWidget = ({ defaultHerdId }: { defaultHerdId?: Id<"herds"> }) => {
    const {results: herds} = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })
    const [selectedHerdId, setSelectedHerdId] = useState<Id<"herds"> | null>(null)
    const selectedHerd = herds?.find((herd) => herd._id === selectedHerdId)

    useEffect(() => {
        if (herds && herds.length > 0) {
            setSelectedHerdId(herds[0]._id)
        }
    }, [herds])

    return (
        <div className="w-[90vw] md:w-[75vw] h-fit relative bg-sage-green rounded-md overflow-hidden text-milk">
            <div className="relative w-full h-[400px] grow-0">
                <Image
                    src={SponsorAHerdImg}
                    alt="Sponsor A Herd"
                    fill
                    className="w-full h-full object-cover object-center" />
            </div>
            <div className="w-full flex flex-col gap-6 px-12 py-8 basis-0 grow">
                <div className="text-left flex flex-col gap-3">
                    <div className="text-3xl font-serif">
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
                <div className="w-full mb-6 text-milk text-left flex gap-8">
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