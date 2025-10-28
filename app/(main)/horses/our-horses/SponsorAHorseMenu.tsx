"use client"

import Image from "next/image"
import Button from "@/components/public-ui/Button"

import SpiritImage from "./spirit.png"
import AdoptBanner from "./adopt-banner.jpg"
import MysticImage from "./mystic.png"

const SponsorAHorseMenu = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
                <div className="text-cinnamon text-[48px] font-serif">
                    Sponsor a Horse
                </div>

                <div className="w-2/3 mx-auto grid grid-cols-3 gap-4">
                    {[
                        {
                            name: "Isabelle",
                            image: SpiritImage,
                            description: "A sorrel mare with a white star and strip unique tuft on his forehead",
                            gender: "Female",
                            age: 27,
                            herd: "Lompoc Herd",
                        },
                        {
                            name: "Isabelle",
                            image: SpiritImage,
                            description: "A sorrel mare with a white star and strip unique tuft on his forehead",
                            gender: "Female",
                            age: 27,
                            herd: "Lompoc Herd",
                        },
                        {
                            name: "Isabelle",
                            image: SpiritImage,
                            description: "A sorrel mare with a white star and strip unique tuft on his forehead",
                            gender: "Female",
                            age: 27,
                            herd: "Lompoc Herd",
                        },
                        {
                            name: "Isabelle",
                            image: SpiritImage,
                            description: "A sorrel mare with a white star and strip unique tuft on his forehead",
                            gender: "Female",
                            age: 27,
                            herd: "Lompoc Herd",
                        },
                        {
                            name: "Isabelle",
                            image: SpiritImage,
                            description: "A sorrel mare with a white star and strip unique tuft on his forehead",
                            gender: "Female",
                            age: 27,
                            herd: "Lompoc Herd",
                        },
                    ].map((horse) => (
                        <div className="col-span-1 w-full h-fit bg-seashell">
                            <div className="relative w-full h-[300px]">
                                <Image className="w-full h-full object-cover object-center" src={horse.image} alt={horse.name} />
                            </div>
                            <div className="w-full h-fit p-4 flex flex-col items-center justify-start gap-2">
                                <div className="text-pewter text-2xl font-serif">{horse.name}</div>
                                <div className="text-lg">{horse.description}</div>
                                <div className="text-md text-left text-gray-500">
                                    {horse.gender} | {horse.age} y.o. | {horse.herd}
                                </div>
                                <div className="w-full flex justify-center gap-4">
                                    <Button color="sage-green" className="py-1 px-4">
                                        SPONSOR
                                    </Button>
                                    <Button color="cinnamon" className="py-1 px-4">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
    )
}

export default SponsorAHorseMenu