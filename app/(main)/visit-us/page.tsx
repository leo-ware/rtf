"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Button from "@/components/Button"
import Link from "next/link"

const VisitPage = () => {
    const programGroups = useQuery(api.programs.getPublicProgramGroups)
    const status = programGroups === undefined
        ? "loading"
        : programGroups.length === 0
            ? "empty"
            : "success"

    return (
        <div className="w-8/12 mx-auto h-full py-16 flex flex-col items-center justify-center gap-12">
            <h1 className="text-4xl font-serif text-cinnamon">Visit</h1>
            {programGroups && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-8">
                    {status === "loading" && (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    )}
                    {status === "empty" && (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-lg">No program groups found</p>
                        </div>
                    )}
                    {status === "success" && programGroups.map((group, i) => {
                        const isEven = i % 2 === 0
                        const programLink = `/visit-us/programs/${group._id}`
                        return (
                            <div key={group._id} className={"w-full flex gap-6 " + (isEven ? "flex-row" : "flex-row-reverse")}>
                                <div className="basis-0 grow">
                                    <Link
                                        href={programLink}
                                        className={cn("text-xl font-serif mb-2 ", isEven ? "text-pewter" : "text-cinnamon")}>
                                        {group.name}
                                    </Link>
                                    <p className="text-md mb-1">{group.description}</p>
                                    <Link href={programLink}>
                                        <Button color="cinnamon" className="py-1 px-2 text-xs">Read More</Button>
                                    </Link>
                                </div>
                                <div className="bg-pewter basis-8 grow" />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default VisitPage