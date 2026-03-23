"use client"

import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import Button from "@/components/public-ui/Button"
import Link from "next/link"
import SponsorAHorseDialog from "./SponsorAHorseDialog"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import SpiritImage from "./imgs/spirit.jpg"
import Header from "../public-ui/Header"
import { Id } from "@/convex/_generated/dataModel"
import Select from "@/components/public-ui/form/Select"
import { useState } from "react"
import { ImSpinner8 } from "react-icons/im"
import CardLayout from "../public-ui/CardLayout"
import { horseDetailsString } from "@/lib/utils"
import { FaAnglesRight } from "react-icons/fa6"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

type SponsorAHorseMenuProps = {
    title?: string
    initialNumItems?: number
    herdId?: Id<"herds">
    type?: "horse" | "burro"
    showControls?: boolean
    excludeAnimalIds?: Id<"animals">[]
    includeInMemoriam?: boolean
    hideViewAll?: boolean
}

const SponsorAHorseMenu = ({ title, initialNumItems: limit, herdId = undefined, type = undefined, showControls = false, excludeAnimalIds = [], includeInMemoriam = false, hideViewAll = false }: SponsorAHorseMenuProps) => {

    const [selectedHerdId, setSelectedHerdId] = useState<Id<"herds"> | null>(herdId || null)
    const [selectedType, setSelectedType] = useState<"horse" | "burro" | null>(type || null)

    const { results: _animals, loadMore, status: animalsStatus } = usePaginatedQuery(
        api.animals.getAnimalsForSponsorship,
        { herdId: selectedHerdId ?? undefined, type: selectedType ?? undefined, includeInMemoriam: includeInMemoriam || undefined },
        { initialNumItems: limit ? (showControls ? limit : limit + 2) : 6 }
    )
    const { results: herds } = usePaginatedQuery(
        api.herds.listHerds,
        {},
        { initialNumItems: 100 }
    )

    const _animalsFiltered = _animals?.filter((animal) => !excludeAnimalIds.includes(animal._id))
    const animals = showControls
        ? _animalsFiltered
        : _animalsFiltered?.slice(0, limit || 6)
    
    const selectedHerd = herds?.find((herd) => herd._id === selectedHerdId)

    const handleLoadMore = () => {
        if (animalsStatus === "CanLoadMore") {
            loadMore(6);
        }
    }

    return (
        <div className="isolate w-full h-fit flex flex-col items-center justify-center gap-8 px-4">
            <Header className="text-cinnamon">
                {title || (type === "burro" ? "Sponsor a Burro" : "Sponsor a Horse")}
            </Header>

            {showControls && (
                <div className="w-full md:w-10/12 mx-auto flex flex-col md:flex-row items-start md:items-center justify-start gap-2">
                    <Select
                        containerClassName="z-30"
                        options={
                            [{ label: "All Herds", value: null } as any].concat(
                                herds?.map((herd) => (
                                    { label: herd.name, value: herd._id }
                                )
                                ) || [])
                        }
                        placeholder="All Herds"
                        selectedValue={selectedHerd ? { label: selectedHerd.name, value: selectedHerd._id } : null}
                        onSelect={(value) => setSelectedHerdId(value?.value as Id<"herds">)}
                    />
                    <Select
                        containerClassName="z-20"
                        options={[
                            { label: "All Types", value: null },
                            { label: "Horses", value: "horse" },
                            { label: "Burros", value: "burro" }
                        ]}
                        placeholder="All Types"
                        selectedValue={selectedType ? { label: selectedType, value: selectedType } : null}
                        onSelect={(value) => setSelectedType(value?.value as "horse" | "burro" | null)}
                    />
                </div>
            )}

            <CardLayout className="md:w-10/12 mx-auto">
                {animals === undefined && (
                    <div className="col-span-full flex items-center justify-center">
                        <div className="flex items-center justify-center gap-2">
                            <ImSpinner8 className="w-4 h-4 animate-spin" />
                            <div className="text-lg">Loading animals...</div>
                        </div>
                    </div>
                )}

                {(animals === null || (animals && animals.length === 0)) && (
                    <div className="col-span-full flex items-center justify-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="text-xl text-serif">No animals found</div>
                        </div>
                    </div>
                )}

                {animals.map((animal) => (
                    <div key={animal._id} className="col-span-1 w-full h-fit bg-seashell rounded-sm overflow-hidden">
                        <div className="relative z-0 w-full h-[300px] overflow-hidden">
                            <ImageWithAuthorCredit
                                className="relative z-0 w-full h-full object-cover object-center"
                                src={animal.image?.url || SpiritImage}
                                alt={animal.image?.altText || animal.name}
                                width={400}
                                height={300}
                                authorCredit={animal.image?.authorCredit}
                                wrapperClassName="w-full h-full"
                            />
                        </div>
                        <div className="w-full h-fit p-4 flex flex-col items-center justify-start gap-2">
                            <div className="text-cinnamon text-[28px] font-serif">{animal.name}</div>
                            <div className="text-[16px] line-clamp-4 h-[100px]">{animal.description}</div>
                            <div className="text-[14px] text-left font-semibold line-clamp-1 h-[20px]">
                                {animal.inMemoriam ? <span className="italic">In Memoriam</span> : horseDetailsString(animal as any)}
                            </div>
                            <div className="w-full flex justify-center gap-4 text-[16px] whitespace-nowrap">
                                <Link href={`/horses/${animal.type === "burro" ? "our-burros" : "our-horses"}/${animal.slug}`}>
                                    <Button color="transparent" className="py-1 px-4 text-cinnamon">
                                        Learn More
                                    </Button>
                                </Link>
                                <SponsorAHorseDialog animalId={animal._id}>
                                    <Button color="transparent" className="py-1 px-4 text-sage-green" onClick={() => trackEvent(AnalyticsEvents.SPONSOR_HORSE_CLICKED, { animalName: animal.name, animalId: animal._id })}>
                                        {animal.inMemoriam ? "GIFT IN MEMORY" : "SPONSOR"}
                                    </Button>
                                </SponsorAHorseDialog>
                            </div>
                        </div>
                    </div>
                ))}

                {!showControls && !hideViewAll && (
                    <div className="col-span-full flex items-center justify-center">
                        <Link
                            href={type === "burro" ? "/donate/sponsor-a-burro" : "/donate/sponsor-a-horse"}
                            className="flex items-center gap-[2px] group">
                            <div className="text-pewter text-lg font-semibold underline group-hover:text-pewter/90">
                                {type === "burro" ? "See All Burros" : "See All Horses"}
                            </div>
                            <div className="w-fit h-fit transition-transform group-hover:translate-x-1">
                                <FaAnglesRight
                                    className="w-4 h-4 text-pewter inline-block group-hover:text-pewter/90"
                                />
                            </div>
                        </Link>
                    </div>
                )}

                {(!["LoadingFirstPage", "Exhausted"].includes(animalsStatus)) && showControls && (
                    <div className="col-span-full flex items-center justify-center">
                        <Button onClick={handleLoadMore} color="cinnamon" className="px-3 py-2 gap-2">
                            {animalsStatus === "CanLoadMore" && "Load More"}
                            {animalsStatus === "LoadingMore" && (<>
                                <ImSpinner8 className="w-4 h-4 animate-spin" />
                                Loading...
                            </>)}
                        </Button>
                    </div>
                )}
            </CardLayout>
        </div>
    )
}

export default SponsorAHorseMenu