"use client"

import { useState, useEffect } from "react"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import Button from "@/components/public-ui/Button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/public-ui/Dialog"
import { IoMdClose } from "react-icons/io"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SalsaDonateFormEmbed, {
    SalsaDonateFormEmbedInner,
} from "@/components/SalsaDonateFormEmbed"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import isadora from "./imgs/isadora.jpg"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

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

    useEffect(() => {
        trackEvent(AnalyticsEvents.DONATE_DIALOG_OPENED, { defaultPathwayName })
    }, [defaultPathwayName])

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
            className="w-full md:w-[calc(100vw-8rem)] min-h-full md:min-h-0 md:h-[calc(100vh-8rem)] z-50 relative bg-sage-green md:rounded-md md:overflow-hidden
            flex flex-col lg:flex-row text-milk text-left"
        >
            {/* Close button - fixed on mobile/tablet for always-visible access */}
            <DialogClose className="fixed md:absolute top-4 right-4 z-20 text-white text-2xl">
                <IoMdClose />
            </DialogClose>

            {/* Image - shows on top on mobile/tablet, right side on desktop */}
            <div className="order-first lg:order-last relative w-full lg:w-[40%] h-[200px] md:h-[40%] lg:h-auto shrink-0 overflow-hidden">
                <ImageWithAuthorCredit
                    src={isadora}
                    alt="Isadora"
                    fill
                    className="object-cover object-center"
                    wrapperClassName="w-full h-full"
                />
            </div>

            {/* Content area */}
            <div className="w-full lg:w-[60%] flex flex-col gap-4 md:gap-6 lg:gap-8 py-4 px-3 md:py-6 lg:py-8 md:px-4 basis-0 grow overflow-auto">
                <div className="flex flex-col gap-2 px-2 md:px-4">
                    <div className="text-2xl md:text-4xl lg:text-[48px] font-serif">
                        Every Horse Needs a Hero
                    </div>
                    {showDropdown ? (
                        <Select
                            value={selectedPathwayId || ""}
                            onValueChange={(newId) => {
                                setSelectedPathwayId(newId as Id<"donatePathways">)
                                const pathway = dialogPathways.find(p => p._id === newId)
                                trackEvent(AnalyticsEvents.DONATE_PATHWAY_SELECTED, { pathway: pathway?.name })
                            }}
                        >
                            <SelectTrigger
                                className="uppercase font-semibold bg-transparent border-0 border-b border-milk/50
                                           text-milk rounded-none shadow-none px-0 py-1 cursor-pointer
                                           focus-visible:ring-0 focus-visible:border-milk
                                           [&_svg]:text-milk [&_svg]:opacity-70"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {dialogPathways.map((p) => (
                                    <SelectItem key={p._id} value={p._id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="uppercase font-semibold">
                            {displayName}
                        </div>
                    )}
                </div>

                {/*{currentFormId ? "Db Form" : "static form"}*/}
                <div className="overflow-auto">
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
