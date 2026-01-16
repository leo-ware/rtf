"use client"

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/public-ui/Dialog";
import SponsorAHorseImg from "./isadora.jpg";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ConvexImage from "../images/ConvexImage";
import Button from "../public-ui/Button";
import SalsaDonateFormEmbed from "../SalsaDonateFormEmbed";
import { useRef } from "react";

const SponsorAHorseDialog = ({ children, animalId }: { children?: React.ReactNode, animalId: Id<"animals"> }) => {
    const animal = useQuery(api.animals.getAnimal, { id: animalId })
    // const scrollingContainerRef = useRef<HTMLDivElement>(null)
    return (
        <Dialog>
            <DialogTrigger>
                {children ? children : (
                    <Button color="cinnamon" size="large">
                        Sponsor {animal?.name || ""}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <div className="w-[50vw] h-fit relative bg-sage-green rounded-md overflow-hidden">
                    <div className="relative w-full aspect-[2/1] max-h-1/2 grow-0">
                        {animal?.image?.url
                            ? (
                                <ConvexImage
                                    src={animal.image.url}
                                    alt={animal.image.altText || animal.name}
                                    width={animal.image.width || 400}
                                    height={animal.image.height || 300}
                                    className="w-full h-full object-cover object-center"
                                />
                            ) : (
                                <Image
                                    src={SponsorAHorseImg}
                                    alt="Sponsor A Horse"
                                    fill
                                    className="w-full h-full object-cover object-center"
                                />
                            )}
                    </div>

                    <div className="w-full px-6 pt-10 pb-2 basis-0 grow">
                        <div className="w-full mb-6 flex flex-col gap-2 items-center justify-between">
                            <div className="text-3xl font-serif text-white">Sponsor {animal?.name}</div>
                            {animal?.donationFormId && (
                                <SalsaDonateFormEmbed donationFormId={animal.donationFormId} />
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default SponsorAHorseDialog