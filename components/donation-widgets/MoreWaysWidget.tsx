"use client"

import CardLayout from "@/components/public-ui/CardLayout"
import DonatePathwayCard from "./DonatePathwayCard"
import { randomChoice } from "@/lib/utils"
import { useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const MoreWaysWidget = () => {
    const pathways = useQuery(api.donatePathways.listPublicDonatePathways)
    const selectedRef = useRef<NonNullable<typeof pathways> | null>(null)

    if (!pathways) return null

    if (selectedRef.current === null) {
        selectedRef.current = randomChoice(3, pathways, { stable: true })
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="text-4xl font-serif text-cinnamon">
                Other ways to support RTF
            </div>

            <div className="w-10/12 mx-auto h-fit">
                <CardLayout>
                    {selectedRef.current.map((pathway) => (
                        <DonatePathwayCard key={pathway._id} pathway={pathway} />
                    ))}
                </CardLayout>
            </div>
        </div>
    )
}

export default MoreWaysWidget;
