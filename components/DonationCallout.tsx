"use client"

import { ReactNode } from "react"
import { StaticImageData } from "next/image"
import Link from "next/link"
import BlurredImageCard from "./public-ui/BlurredImageCard"
import GenericDonateDialogue from "./donation-widgets/GenericDonateDialogue"
import Button from "./public-ui/Button"
import { Id } from "@/convex/_generated/dataModel"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import { cn } from "@/lib/utils"

export const DonationCalloutGrid = ({ children, className }: { children: ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr_auto] gap-4", className)}>
        {children}
    </div>
)

type DonationCalloutProps = {
    image: StaticImageData
    heading: string | ReactNode
    description: string
    // CTA — exactly one of these:
    donatePathway?: string
    donationFormId?: Id<"donationForms">
    link?: string
    buttonText?: string
    buttonColor?: string
    // Layout
    align?: "center" | "left"
    gridAligned?: boolean
    className?: string
    // Analytics
    analyticsName?: string
}

const DonationCallout = ({
    image,
    heading,
    description,
    donatePathway,
    donationFormId,
    link,
    buttonText = "Donate Now",
    buttonColor = "cinnamon",
    align = "center",
    gridAligned = false,
    className,
    analyticsName,
}: DonationCalloutProps) => {
    const isCenter = align === "center"

    const handleClick = () => {
        if (analyticsName) {
            trackEvent(AnalyticsEvents.DONATION_CALLOUT_CLICKED, {
                name: analyticsName,
                ctaType: link ? "link" : "donate_dialog",
            })
        }
    }

    const button = (
        <Button color={buttonColor} className="px-4" onClick={handleClick}>
            {buttonText}
        </Button>
    )

    const cta = link ? (
        <Link href={link}>
            {button}
        </Link>
    ) : (
        <GenericDonateDialogue
            defaultPathwayName={donatePathway}
            donationFormId={donationFormId}
        >
            {button}
        </GenericDonateDialogue>
    )

    return (
        <BlurredImageCard
            image={image}
            className={cn(className, gridAligned && "md:row-span-3 md:grid md:grid-rows-[subgrid] md:h-auto")}
            innerClassName={gridAligned ? "md:row-span-3 md:grid md:grid-rows-[subgrid]" : undefined}
        >
            <div
                className={cn(
                    "w-full h-full py-10 md:py-16 px-6 md:px-10 flex flex-col justify-center gap-4 text-white",
                    isCenter ? "items-center text-center" : "items-start text-left",
                    gridAligned && "md:grid md:grid-rows-[subgrid] md:row-span-3 md:items-start"
                )}
            >
                <div className={`text-[28px] md:text-[36px] font-serif leading-none ${isCenter ? "max-w-[650px]" : ""}`}>
                    {heading}
                </div>
                <div className={`text-base md:text-lg ${isCenter ? "max-w-[650px]" : ""}`}>
                    {description}
                </div>
                <div className={isCenter ? "w-full flex justify-center" : undefined}>
                    {cta}
                </div>
            </div>
        </BlurredImageCard>
    )
}

export default DonationCallout
