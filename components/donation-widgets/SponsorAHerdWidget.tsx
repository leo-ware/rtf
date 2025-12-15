"use client"

import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import SponsorAHerdImg from "./spirit.png"
import { useEffect, useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { Loader2 } from "lucide-react"

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
        <div className="w-full h-fit relative bg-sage-green rounded-md overflow-hidden text-milk">
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
                        Lorem ipsum dolor sit amet consectetur. Lectus nunc felis morbi volutpat massa
                        et nisl. Augue ut in odio fermentum blandit duis neque. Cursus hendrerit viverra
                        bibendum massa vulputate amet fames consequat. Learn more.
                    </div>
                </div>
                <div className="w-full mb-6 text-milk text-left flex gap-8">
                    <div className="w-1/2 flex flex-col gap-4">
                        {selectedHerd?.donateForm
                        ? (
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: selectedHerd?.donateForm || "" }} />
                            )
                            : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-milk" />
                                </div>
                            )
                        }
                        {/* <div className="flex items-center justify-between gap-4">
                            <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                                Yearly
                            </Button>
                            <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                                Monthly
                            </Button>
                            <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                                One-Time
                            </Button>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                                $15,000
                            </Button>
                            <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                                $7,500
                            </Button>
                            <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                                $3,750
                            </Button>
                            <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                                $1,250
                            </Button>
                        </div>
                        <div className="flex mt-4 flex-col gap-1 items-start">
                            <div className="text-lg uppercase font-semibold text-white">Other Amount</div>
                            <div className="w-full flex items-center justify-between">
                                <div className="flex w-36 h-8 bg-milk rounded-sm overflow-hidden">
                                    <div className="h-full px-4 w-fit bg-cinnamon text-white flex items-center justify-center">
                                        $
                                    </div>
                                    <input type="number" className="h-full w-1/2 bg-transparent text-right" />
                                </div>
                                <Button color="cinnamon" className="h-8 flex items-center justify-center rounded-sm px-4">
                                    Next
                                </Button>
                            </div>
                            <div className="text-lg text-white">
                                Donation includes: Certificate, Sanctuary Tour
                            </div>
                        </div> */}
                    </div>
                    <div className="w-1/2 flex flex-col gap-2">
                        <div className="text-2xl font-serif text-milk">Hero Sponsor</div>
                        <div className="text-lg text-milk">
                            For only $8.22 a day, your Freedom Sponsorship provides full care and feed for a
                            rescued wild horse every month. Freedom Sponsors also receive a complimentary photo
                            safari /herd immersion or sanctuary tour for two<br />annually!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SponsorAHerdWidget;