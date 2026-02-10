"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Button from "@/components/public-ui/Button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/public-ui/Dialog"
import { IoMdClose } from "react-icons/io"
import SalsaDonateFormEmbed, {
    SalsaDonateFormEmbedInner,
} from "@/components/SalsaDonateFormEmbed"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import isadora from "./isadora.jpg"

type GenericDonateDialogueInnerProps = {
    donationFormId?: Id<"donationForms">
    defaultPathwayName?: string
}

const GenericDonateDialogueInner = ({
    donationFormId,
    defaultPathwayName,
}: GenericDonateDialogueInnerProps) => {
    const dialogPathways = useQuery(api.donatePathways.listDialogPathways)
    const [selectedPathwayId, setSelectedPathwayId] =
        useState<Id<"donatePathways"> | null>(null)

    // Determine initial selection based on defaultPathwayName
    useEffect(() => {
        if (!dialogPathways || dialogPathways.length === 0) return

        if (defaultPathwayName) {
            const searchName = defaultPathwayName.toLowerCase()
            // Try exact match first
            const exactMatch = dialogPathways.find(
                (p) => p.name.toLowerCase() === searchName,
            )
            if (exactMatch) {
                setSelectedPathwayId(exactMatch._id)
                return
            }
            // Fall back to partial match
            const partialMatch = dialogPathways.find(
                (p) =>
                    p.name.toLowerCase().includes(searchName) ||
                    searchName.includes(p.name.toLowerCase()),
            )
            if (partialMatch) {
                setSelectedPathwayId(partialMatch._id)
                return
            }
        }
        // Default to first only if nothing selected yet
        setSelectedPathwayId((prev) => prev ?? dialogPathways[0]._id)
    }, [dialogPathways, defaultPathwayName])

    // If donationFormId is provided directly, use it (no dropdown)
    // Otherwise, use the selected pathway's form
    const showDropdown =
        !donationFormId && dialogPathways && dialogPathways.length > 1

    const selectedPathway = dialogPathways?.find(
        (p) => p._id === selectedPathwayId,
    )
    const currentFormId = donationFormId || selectedPathway?.donationFormId

    // If falling back to default form, log it
    const usingFallbackForm = !currentFormId
    if (usingFallbackForm) {
        console.log("GenericDonateDialogue: Falling back to default static form")
    }

    // Determine display name:
    // - If using fallback form: "Donate to RTF"
    // - If donationFormId passed directly: no name (card already shows it)
    // - If using pathway selection: show selected pathway name
    const displayName = usingFallbackForm
        ? "Donate to RTF"
        : (!donationFormId && selectedPathway)
            ? selectedPathway.name
            : ""

    return (
        <div
            className="w-full md:w-[75vw] min-h-full md:min-h-0 md:h-[600px] z-50 relative bg-sage-green md:rounded-md md:overflow-hidden
            flex flex-col md:flex-row text-milk text-left"
        >
            {/* Close button - fixed on mobile for always-visible access */}
            <DialogClose className="fixed md:absolute top-4 right-4 z-20 text-white text-2xl">
                <IoMdClose />
            </DialogClose>

            {/* Image - shows on top on mobile, right side on desktop */}
            <div className="order-first md:order-none relative w-full md:w-1/2 h-[200px] md:h-auto md:absolute md:inset-y-0 md:right-0 shrink-0">
                <Image
                    src={isadora}
                    alt="Isadora"
                    fill
                    className="object-cover object-center"
                />
            </div>

            {/* Content area */}
            <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-8 py-4 px-3 md:py-8 md:px-4">
                <div className="flex flex-col gap-2 px-2 md:px-4">
                    <div className="text-2xl md:text-[48px] font-serif">
                        Every Horse Needs a Hero
                    </div>
                    {showDropdown ? (
                        <select
                            value={selectedPathwayId || ""}
                            onChange={(e) =>
                                setSelectedPathwayId(
                                    e.target.value as Id<"donatePathways">,
                                )
                            }
                            className="uppercase font-semibold bg-transparent border-b border-milk/50
                                       text-milk py-1 cursor-pointer focus:outline-none"
                        >
                            {dialogPathways.map((p) => (
                                <option
                                    key={p._id}
                                    value={p._id}
                                    className="text-ink bg-milk"
                                >
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="uppercase font-semibold">
                            {displayName}
                        </div>
                    )}
                </div>

                {/*{currentFormId ? "Db Form" : "static form"}*/}
                <div className="overflow-auto md:max-h-[400px]">
                    {currentFormId ? (
                        <SalsaDonateFormEmbed donationFormId={currentFormId} />
                    ) : (
                        <SalsaDonateFormEmbedInner
                            donationForm={{
                                formId: "AbpiIcUdxC",
                                formTemplateId:
                                    "075b2dc6-782d-42b0-b9b6-603714a36154",
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

type GenericDonateDialogueProps = {
    children?: React.ReactNode
    donationFormId?: Id<"donationForms">
    defaultPathwayName?: string
}

const GenericDonateDialogue = ({
    children,
    donationFormId,
    defaultPathwayName,
}: GenericDonateDialogueProps) => {
    return (
        <Dialog className="w-full h-full">
            <DialogContent>
                <GenericDonateDialogueInner
                    donationFormId={donationFormId}
                    defaultPathwayName={defaultPathwayName}
                />
            </DialogContent>
            <DialogTrigger className="w-full h-full">
                <div className="z-10 w-full h-full">
                    {children || (
                        <Button color="cinnamon" className="py-1 px-4">
                            Donate
                        </Button>
                    )}
                </div>
            </DialogTrigger>
        </Dialog>
    )
}

export default GenericDonateDialogue
