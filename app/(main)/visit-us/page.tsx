"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import Button from "@/components/public-ui/Button"
import Link from "next/link"
import Hero from "@/components/public-ui/Hero"
import UpcomingEventsWidget from "@/components/UpcomingEventsWidget"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"

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
            name: "Host Your Event",
            description: "Host your wedding, fundraiser, retreat, or private gathering at our sanctuary on California's Central Coast.",
            link: "/visit-us/host-your-event",
        }
    ].map((g, i) => ({...g, _id: `synthetic-${i}`, image: undefined}))

    const programGroups = [
        ...programGroupsSorted,
        ...syntheticProgramGroups,
    ]

    const items = programGroups.map((group) => ({
        title: (
            <Link href={group.link} className="hover:underline">
                {group.name}
            </Link>
        ),
        description: (
            <div>
                <p className="my-2">{group.description}</p>
                <Link href={group.link}>
                    <Button color="cinnamon" className="py-1 px-2">Read More</Button>
                </Link>
            </div>
        ),
        image: group.image?.url || DefaultEventImage,
        imageAlt: group.image?.altText || group.name,
        authorCredit: group.image?.authorCredit,
    }))

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <div className="w-full h-fit">
                <Hero title="Programs" image={HeroImg} />

                <div className="w-full h-fit bg-seashell py-12">
                    <Header className="text-pewter">Upcoming Events</Header>
                    <UpcomingEventsWidget />
                </div>
            </div>
            <div className="w-full py-16">
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

                {status === "success" && (
                    <AlternatingPictureLayout
                        alternateTitleColors
                        items={items}
                    />
                )}
            </div>
        </div>
    )
}

export default VisitPage
