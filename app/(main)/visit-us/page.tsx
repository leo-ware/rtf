"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import Button from "@/components/public-ui/Button"
import Link from "next/link"
import Hero from "@/components/public-ui/Hero"
import UpcomingEventsWidget from "@/components/UpcomingEventsWidget"
import Header from "@/components/public-ui/Header"
import ConvexImage from "@/components/images/ConvexImage"
import Image from "next/image"

import HeroImg from "./visit-us-hero.jpg"
import DefaultEventImage from "./defaultEventImage.png"

const VisitPage = () => {
    const programGroupsRaw = useQuery(api.programs.getPublicProgramGroups)
    const status = programGroupsRaw === undefined
        ? "loading"
        : programGroupsRaw.length === 0
            ? "empty"
            : "success"

    const programGroupsSorted = (programGroupsRaw || [])
        .sort((a, b) => a.order - b.order)
        .map((group) => {
            const programLink = `/visit-us/programs/${group._id}`
            return {...group, link: programLink}
        })
    const syntheticProgramGroups = [
        {
            name: "Weddings",
            description: "We host weddings at the sanctuary. We can help you plan your special day.",
            link: "/visit-us/weddings",
        }
    ].map((g, i) => ({...g, _id: `synthetic-${i}`, image: undefined}))

    const programGroups = [
        ...programGroupsSorted,
        ...syntheticProgramGroups,
    ]

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <div className="w-full h-fit">
                <Hero title="Programs" image={HeroImg} />

                <div className="w-full h-fit bg-seashell py-12">
                    <Header className="text-pewter">Upcoming Events</Header>
                    <UpcomingEventsWidget />
                </div>
            </div>
            <div className="w-10/12 mx-auto h-full py-16 flex flex-col items-center justify-center gap-12">
                {programGroups && (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-24">
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
                            
                            return (
                                <div
                                    key={group._id}
                                    className={
                                        "w-full flex items-center justify-center gap-6 " +
                                        (isEven ? "flex-row" : "flex-row-reverse")
                                    }>
                                    <div className="w-1/2">
                                        <Link href={group.link}>
                                            <Header
                                                level={2}
                                                className={`text-left ${isEven ? "text-pewter" : "text-cinnamon"}`}>
                                                {group.name}
                                            </Header>
                                        </Link>
                                        <p className="text-[20px] my-2">
                                            {group.description}
                                        </p>
                                        <Link href={group.link}>
                                            <Button color="cinnamon" className="py-1 px-2">Read More</Button>
                                        </Link>
                                    </div>
                                    <div className="w-1/2 aspect-[4/3]">
                                        {group.image?.url
                                            ? (
                                                <ConvexImage
                                                    src={group.image?.url || ""}
                                                    alt={group.image?.altText || ""}
                                                    width={group.image?.width || 0}
                                                    height={group.image?.height || 0}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Image
                                                    src={DefaultEventImage}
                                                    alt="Default Event Image"
                                                    className="w-full h-full object-cover"
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VisitPage