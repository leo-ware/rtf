"use client"

import Image from "next/image"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"
import GenericDonateDialogue from "./GenericDonateDialogue"

type DonatePathwayCardProps = {
    pathway: {
        _id: Id<"donatePathways">
        name: string
        link?: string
        donationFormId?: Id<"donationForms">
        image: { url: string | null; altText?: string } | null
    }
}

const CardContent = ({ name, imageUrl, altText }: { name: string; imageUrl: string | null; altText?: string }) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className={`
                z-0
                w-full aspect-square
                relative flex flex-col items-center justify-center gap-4
                bg-[#F7F6F4]
                rounded-xl overflow-hidden
            `}>
                <div className="relative h-3/4 w-full">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={altText || name}
                            fill
                            className="object-cover object-center"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </div>
                <div className="h-1/4 w-full p-4 flex items-center justify-center">
                    <div className="text-2xl font-serif text-charcoal">
                        {name}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DonatePathwayCard = ({ pathway }: DonatePathwayCardProps) => {
    const { name, link, donationFormId, image } = pathway
    const imageUrl = image?.url || null
    const altText = image?.altText

    // If it's a link pathway
    if (link) {
        const isExternal = link.startsWith("http://") || link.startsWith("https://")

        if (isExternal) {
            return (
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <CardContent name={name} imageUrl={imageUrl} altText={altText} />
                </a>
            )
        }

        return (
            <Link href={link}>
                <CardContent name={name} imageUrl={imageUrl} altText={altText} />
            </Link>
        )
    }

    // If it's a donation form pathway
    if (donationFormId) {
        return (
            <GenericDonateDialogue donationFormId={donationFormId}>
                <CardContent name={name} imageUrl={imageUrl} altText={altText} />
            </GenericDonateDialogue>
        )
    }

    // Fallback (shouldn't happen with proper validation)
    return <CardContent name={name} imageUrl={imageUrl} altText={altText} />
}

export default DonatePathwayCard
