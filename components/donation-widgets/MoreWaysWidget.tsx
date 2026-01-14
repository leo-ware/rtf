"use client"

import CardLayout from "@/components/public-ui/CardLayout"
import { DonationWidgets } from "./DonationWidgets"
import { randomChoice } from "@/lib/utils"
import { useRef } from "react"

const MoreWaysWidget = () => {
    const widgets = useRef(randomChoice(3, Object.entries(DonationWidgets), {stable: true}))

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="text-4xl font-serif text-cinnamon">
                Other ways to support RTF
            </div>

            <div className="w-10/12 mx-auto h-fit">
                <CardLayout>
                    {widgets.current.map(([key, Widget]) => <Widget key={key} />)}
                </CardLayout>
            </div>
        </div>
    )
}

export default MoreWaysWidget;