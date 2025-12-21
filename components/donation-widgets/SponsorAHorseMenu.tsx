"use client"

import Image from "next/image"
import Button from "@/components/public-ui/Button"
import Link from "next/link"
import SponsorAHorseDialog from "./SponsorAHorseDialog"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import SpiritImage from "./spirit.png"
import Header from "../public-ui/Header"

const SponsorAHorseMenu = ({ title }: { title?: string }) => {
    const animals = useQuery(api.animals.getAnimalsForSponsorship)

    if (!animals) {
        return (
            <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
                <div className="text-cinnamon text-[48px] font-serif">
                    Sponsor a Horse
                </div>
                <div className="text-gray-500">Loading animals...</div>
            </div>
        )
    }

    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
            <Header className="text-cinnamon">
                {title || "Sponsor a Horse"}
            </Header>

            <div className="w-10/12 mx-auto grid grid-cols-3 gap-4">
                {animals.map((animal) => (
                    <div key={animal._id} className="col-span-1 w-full h-fit bg-seashell">
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
                            <div className="text-[16px]">{animal.description}</div>
                            <div className="text-[14px] text-left font-semibold">
                                {animal.type === "horse" ? "Horse" : "Burro"}
                                {animal.herd?.name && ` | ${animal.herd.name}`}
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
            </div>
        </div>
    )
}

export default SponsorAHorseMenu