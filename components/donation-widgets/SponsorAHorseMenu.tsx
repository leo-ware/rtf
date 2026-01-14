"use client"

import Image from "next/image"
import Button from "@/components/public-ui/Button"
import Link from "next/link"
import SponsorAHorseDialog from "./SponsorAHorseDialog"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import SpiritImage from "./spirit.png"
import Header from "../public-ui/Header"
import { Id } from "@/convex/_generated/dataModel"
import Select from "@/components/public-ui/form/Select"
import { useState } from "react"
import { ImSpinner8 } from "react-icons/im"
import CardLayout from "../public-ui/CardLayout"
import { horseDetailsString } from "@/lib/utils"

type SponsorAHorseMenuProps = {
    title?: string
    limit?: number
    herdId?: Id<"herds">
    type?: "horse" | "burro"
    showControls?: boolean
    excludeAnimalIds?: Id<"animals">[]
}

const SponsorAHorseMenu = ({ title, limit, herdId = undefined, type = undefined, showControls = true, excludeAnimalIds = [] }: SponsorAHorseMenuProps) => {

    const [selectedHerdId, setSelectedHerdId] = useState<Id<"herds"> | null>(herdId || null)
    const [selectedType, setSelectedType] = useState<"horse" | "burro" | null>(type || null)

    const { results: _animals, loadMore, status: animalsStatus } = usePaginatedQuery(
        api.animals.getAnimalsForSponsorship,
        { herdId: selectedHerdId ?? undefined, type: selectedType ?? undefined },
        { initialNumItems: limit || 6 }
    )
    const { results: herds } = usePaginatedQuery(
        api.herds.listHerds,
        {},
        { initialNumItems: 100 }
    )

    const animals = _animals?.filter((animal) => !excludeAnimalIds.includes(animal._id))
    const selectedHerd = herds?.find((herd) => herd._id === selectedHerdId)

    const handleLoadMore = () => {
        if (animalsStatus === "CanLoadMore") {
            loadMore(6);
        }
    }

    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-8 px-4">
            <Header className="text-cinnamon">
                {title || "Sponsor a Horse"}
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
                        <div className="relative w-full h-[300px]">
                            <Image
                                className="w-full h-full object-cover object-center"
                                src={animal.image?.url || SpiritImage}
                                alt={animal.image?.altText || animal.name}
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="w-full h-fit p-4 flex flex-col items-center justify-start gap-2">
                            <div className="text-cinnamon text-[28px] font-serif">{animal.name}</div>
                            <div className="text-[16px] line-clamp-4 h-[100px]">{animal.description}</div>
                            <div className="text-[14px] text-left font-semibold line-clamp-1 h-[20px]">
                                {horseDetailsString(animal as any)}
                            </div>
                            <div className="w-full flex justify-center gap-4 text-[16px]">
                                <Link href={`/horses/our-horses/${animal.slug}`}>
                                    <Button color="transparent" className="py-1 px-4 text-cinnamon">
                                        Learn More
                                    </Button>
                                </Link>
                                <SponsorAHorseDialog animalId={animal._id}>
                                    <Button color="transparent" className="py-1 px-4 text-sage-green">
                                        SPONSOR
                                    </Button>
                                </SponsorAHorseDialog>
                            </div>
                        </div>
                    </div>
                ))}

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