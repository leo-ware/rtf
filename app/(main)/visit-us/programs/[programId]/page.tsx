"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const IndividualProgramWidget = ({ name, description, details, price }: { name: string, description: string, details: string, price: number }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="w-full flex gap-6">
            <div className="w-60 h-48 bg-pewter" />
            <div className="basis-0 grow flex flex-col gap-1">
                <h2 className="text-2xl font-serif text-sage-green">{name}</h2>
                <p>{description}</p>
                {open && (
                    <div>
                        <p>{details}</p>
                        <div className="my-2 text-pewter">
                            {price > 0 ? `Suggested Donation: $${price}` : "Free"}
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-start gap-2">
                    <div
                        className="text-sm font-bold text-cinnamon cursor-pointer border border-cinnamon uppercase px-2 py-1 rounded-md"
                        onClick={() => setOpen(!open)}>
                        {open ? "Show Less" : "Show More"}
                    </div>
                    <div
                        className="text-sm font-bold text-white cursor-pointer bg-cinnamon uppercase px-2 py-1 rounded-md"
                        onClick={() => setOpen(!open)}>
                        Register
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProgramsPage = ({ programId }: { programId: string }) => {
    const programGroup = useQuery(
        api.programs.getProgramGroupById,
        { id: programId as Id<"programGroups"> }
    )

    return (
        <div className="w-2/3 h-fit mx-auto py-16 flex flex-col items-center justify-center gap-16">
            <h1 className="text-4xl font-serif text-pewter">
                {programGroup?.name?.toString()}
            </h1>
            {programGroup?.programs && programGroup?.programs.length > 0
                ? (<div className="w-full h-full flex flex-col items-center justify-center gap-12">
                    {programGroup?.programs.map((program) => (
                        <IndividualProgramWidget
                            key={program._id}
                            name={program.name}
                            description={program.description}
                            details={program.details}
                            price={program.price ?? 0} />
                    ))}
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-lg">No programs found</p>
                    </div>
                )
            }
        </div>
    )
}

const ProgramsPageWrapper = ({ params }: { params: Promise<{ programId: string }> }) => {
    const resolvedParams = use(params)
    if (!resolvedParams.programId) {
        return notFound()
    }
    return <ProgramsPage programId={resolvedParams.programId} />
}

export default ProgramsPageWrapper