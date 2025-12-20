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
import { Loader2 } from "lucide-react";
import ConvexImage from "../images/ConvexImage";

const SponsorAHorseWidgetInner = ({ animalId }: { animalId: Id<"animals"> }) => {
    const animal = useQuery(api.animals.getAnimal, { id: animalId })

    return (
        <div className="w-[50vw] h-fit relative bg-sage-green rounded-md overflow-hidden">
            <div className="relative w-full aspect-[2/1] grow-0">
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

            {/* <div className="w-full px-12 py-12 basis-0 grow">
                <div className="w-full mb-6 flex flex-col gap-6 items-center justify-between">
                    <div className="text-3xl font-serif text-white">Sponsor {animal?.name}</div>
                    {animal?.donateForm ? (
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: animal.donateForm || "" }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-milk" />
                        </div>
                    )}
                </div>
            </div> */}

            <div className="w-full px-12 py-8 basis-0 grow">
                <div className="w-full mb-6 flex items-center justify-between">
                    <div className="text-3xl font-serif text-white">Sponsor Isadora Cruz</div>
                    <div className="flex items-center justify-center gap-3">
                        <Button color="milk" className="text-ink text-xs px-4">
                            Monthly
                        </Button>
                        <Button color="milk" className="text-ink text-xs px-4">
                            One-Time
                        </Button>
                    </div>
                </div>
                <CardLayout className="gap-6">
                    {Array(6).fill(null).map(() => (
                        <div className="col-span-1 p-6 bg-milk rounded-xl overflow-hidden
                        flex flex-col items-center justify-center gap-2">
                            <div className="text-2xl font-serif text-pewter">Friend Sponsor</div>
                            <div className="text-md font-semibold uppercase text-cinnamon">$25 per month</div>
                            <div className="text-center text-lg text-ink">
                                For only 82 cents a day, you can help! A friend sponsorship
                                helps towards feed and care!
                            </div>
                        </div>
                    ))}
                </CardLayout>
                <div className="flex mt-4 flex-col gap-1 items-start">
                    <div className="text-lg uppercase font-semibold text-white">Other Amount</div>
                    <div className="flex items-center gap-8">
                        <div className="flex w-36 h-8 bg-milk rounded-sm overflow-hidden">
                            <div className="h-full w-1/2 bg-cinnamon text-white">$</div>
                            <input type="number" className="h-full w-1/2 bg-transparent text-right" />
                        </div>
                        <div className="text-lg text-white">
                            Donation includes: Certificate, Sanctuary Tour
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SponsorAHorseDialog = ({ children, animalId }: { children: React.ReactNode, animalId: Id<"animals"> }) => {
    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
                <SponsorAHorseWidgetInner animalId={animalId} />
            </DialogContent>
        </Dialog>
    )
}

export default SponsorAHorseDialog