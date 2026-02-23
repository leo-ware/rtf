"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import DefaultHeroImage from "./default-program-image.png"
import DefaultEventImage from "./default-event-image.jpg"
import ConvexImage from "@/components/images/ConvexImage"
import Header from "@/components/public-ui/Header"
import Image from "next/image"
import RegisterButton from "@/components/RegisterButton"
import Button from "@/components/public-ui/Button"

type ProgramGroupContentProps = {
    programGroupId: Id<"programGroups">
}

const ProgramGroupContent = ({ programGroupId }: ProgramGroupContentProps) => {
    const programGroup = useQuery(
        api.programs.getProgramGroupById,
        { id: programGroupId }
    )

    const [openIdx, setOpenIdx] = useState<number | undefined>(undefined)

    if (programGroup === null) {
        return notFound()
    }

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">

            <div className="relative w-full h-[50vh]">
                {programGroup?.image?.url ? (
                    <ConvexImage
                        src={programGroup?.image?.url || ""}
                        alt={programGroup?.image?.altText || ""}
                        width={programGroup?.image?.width || 0}
                        height={programGroup?.image?.height || 0}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={DefaultHeroImage}
                        alt="Default Event Image"
                        className="w-full h-full object-cover"
                        fill
                    />
                )}
            </div>

            <Header level={1} className="text-pewter">
                {programGroup?.name || ""}
            </Header>

            <div className="w-10/12 h-fit mx-auto pb-12 flex flex-col items-center justify-center gap-16">
                {programGroup?.programs && programGroup?.programs.length > 0
                    ? (<div className="w-full h-full flex flex-col items-center justify-center gap-12">
                        {programGroup?.programs.map((program, i) => {
                            const isOpen = openIdx === i
                            const openSelf = () => setOpenIdx(i)
                            const closeSelf = () => setOpenIdx(undefined)

                            return (
                                <div key={program._id} className="w-full flex gap-6 items-start justify-center">
                                    <div className="relative basis-[40%] aspect-[4/3]">
                                        {program.image?.url ? (
                                            <ConvexImage
                                                src={program.image?.url || ""}
                                                alt={program.image?.altText || ""}
                                                width={program.image?.width || 0}
                                                height={program.image?.height || 0}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src={DefaultEventImage}
                                                alt="Default Event Image"
                                                className="w-full h-full object-cover"
                                                fill
                                            />
                                        )}
                                    </div>

                                    <div className="basis-0 grow flex flex-col gap-4 text-[20px]">
                                        <Header level={2} className="text-sage-green text-left">{program.name}</Header>
                                        <p>{program.description}</p>
                                        {isOpen && (
                                            <div>
                                                <div dangerouslySetInnerHTML={{ __html: program.details }} />
                                                {program.ticketPriceText && (
                                                    <div className="text-lg text-pewter mt-4">
                                                        {program.ticketPriceText}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-start gap-2">
                                            <Button
                                                onClick={isOpen ? closeSelf : openSelf}
                                                color="cinnamon"
                                                variant="outline"
                                                size="large"
                                                >
                                                {isOpen ? "Show Less" : "Show More"}
                                            </Button>
                                            <RegisterButton programId={program._id} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-lg">No programs found</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProgramGroupContent
