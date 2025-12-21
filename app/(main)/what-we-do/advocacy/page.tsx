"use client"

import Hero from "@/components/public-ui/Hero"
import AdvocacyHero from "./advocacy-hero.jpg"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import Image from "next/image"
import Link from "next/link"
import Button from "@/components/public-ui/Button"
import NewsCarousel from "@/components/NewsCarousel"
import BlurredImageCard from "@/components/public-ui/BlurredImageCard"
import GenericDonateDialogue from "@/components/donation-widgets/GenericDonateDialogue"
import TakeActionSection from "@/components/TakeActionSection"

import Policy1 from "./policy1.png"
import Policy2 from "./policy2.jpg"
import Policy3 from "./policy-3.jpg"
import Policy4 from "./policy-4.jpg"
import BlurredImage from "./blurred-1.jpg"
import Random1 from "./random1.jpg"
import Random2 from "./random2.jpg"
import Random3 from "./random3.jpg"
import Random4 from "./random4.jpg"
import Random5 from "./random5.jpg"
import Random6 from "./random6.jpg"
import WHDCallout from "@/components/WHDCallout"


const policies = [
    {
        title: "End Roundups & Removals",
        description: `
            Helicopter roundups traumatize wild herds and cost taxpayers millions. We advocate 
            for science-based, humane fertility control and ecosystem management to keep horses 
            wild and free.
        `,
        link: "advocacy/roundups",
        image: Policy1
    },
    {
        title: "Population Management",
        description: `
            Thousands of American horses, both wild and domestic, are shipped abroad for slaughter 
            each year. We're fighting to pass the SAFE Act — a permanent federal ban on horse 
            slaughter.
        `,
        link: "advocacy/population-management",
        image: Policy2
    },
    {
        title: "Protect Herd Management Area",
        description: `
            The BLM's land allocation system prioritizes private livestock over federally protected 
            wild herds. We defend critical rangelands through policy reform, legal action, and 
            habitat restoration.
        `,
        link: "advocacy/herd-management",
        image: Policy3
    },
    {
        title: "End Horse Slaughter",
        description: `
            Thousands of American horses, both wild and domestic, are shipped abroad for slaughter 
            each year. We're fighting to pass the SAFE Act — a permanent federal ban on horse 
            slaughter and transport.
        `,
        link: "advocacy/horse-slaughter",
        image: Policy4
    },
]

const takeAction = [
    {
        title: "Sign a petition to end horse slaughter in the United States",
        image: Random1
    },
    {
        title: "Contact your representative to ensure this bill does not pass",
        image: Random2
    },
    {
        title: "Show your support protesting the BLM's actions",
        image: Random3
    },
    {
        title: "Contact your representative to saves Wyoming's Wild Horses",
        image: Random4
    },
    {
        title: "Write a short article about the condition of wild horses in your state",
        image: Random5
    },
    {
        title: "Apply to volunteer on our advocacy team",
        image: Random6
    },
]

const AdvocacyPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <Hero title="Advocacy" image={AdvocacyHero} />
            <Callout className="">
                Return to Freedom is leading the fight to protect America's wild
                horses and burros through policy reform, legal action, and grassroots
                mobilization. Every voice matters — together we can end roundups, stop
                slaughter, and ensure humane, science-based management for generations
                to come.
            </Callout>
            <Header color="sage-green">
                Our Policy & Legislative Priorities
            </Header>
            <div className="w-9/12 mx-auto flex flex-col items-center justify-center gap-18">
                {policies.map((each, i) => {
                    return (
                        <div key={each.title} className={`w-full flex items-center gap-8 ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"}`}>
                            <div className="relative w-1/2 h-[350px] overflow-hidden">
                                <Image
                                    src={each.image}
                                    alt={each.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div className="w-1/2 flex flex-col items-start justify-center gap-2">
                                <div className="font-serif text-[40px] text-pewter">
                                    {each.title}
                                </div>
                                <div className="text-lg text-ink">
                                    {each.description}
                                </div>
                                <Link href={each.link} className="mt-2">
                                    <Button className="" color="cinnamon">Learn More</Button>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            <NewsCarousel title="RTF's Advocacy Work" topic="advocacy" />

            <WHDCallout />

            <TakeActionSection />

            <div className="h-8"/>
        </div>
    )
}

export default AdvocacyPage