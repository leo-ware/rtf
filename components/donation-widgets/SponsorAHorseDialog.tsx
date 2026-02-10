"use client"

import Image from "next/image";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/public-ui/Dialog";
import { IoMdClose } from "react-icons/io";
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
                <div className="w-full md:w-[50vw] min-h-full md:min-h-0 md:h-auto relative bg-sage-green md:rounded-md md:overflow-hidden">
                    {/* Close button - fixed on mobile for always-visible access */}
                    <DialogClose className="fixed md:absolute top-4 right-4 z-20 text-white text-2xl">
                        <IoMdClose />
                    </DialogClose>

                    <div className="relative w-full h-[200px] md:h-auto md:aspect-[2/1] shrink-0">
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

                    <div className="w-full px-4 pt-6 pb-2 md:px-6 md:pt-10 basis-0 grow">
                        <div className="w-full mb-4 md:mb-6 flex flex-col gap-2 items-center justify-between">
                            <div className="text-xl md:text-3xl font-serif text-white">Sponsor {animal?.name}</div>
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