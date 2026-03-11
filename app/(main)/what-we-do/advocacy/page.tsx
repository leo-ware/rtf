"use client"

import Hero from "@/components/public-ui/Hero"
import AdvocacyHero from "./advocacy-hero.jpg"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import Image from "next/image"
import Link from "next/link"
import NewsCarousel from "@/components/NewsCarousel"
import TakeActionSection from "@/components/TakeActionSection"
import ScrollReveal from "@/components/public-ui/ScrollReveal"
import DonationCallout from "@/components/DonationCallout"
import BlurredBg from "@/components/images/blurred-bg.jpg"
import StatsBar from "@/components/StatsBar"

import Policy1 from "./policy1.png"
import Policy2 from "./policy2.jpg"
import Policy3 from "./policy-3.jpg"
import Policy4 from "./policy-4.jpg"
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
        title: "Protect Herd Management Areas",
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


const PolicyCard = ({ policy, index }: { policy: typeof policies[number], index: number }) => {
    const isEven = index % 2 === 0

    return (
        <Link href={policy.link} className="block relative w-full h-[300px] md:h-[350px] overflow-hidden group">
            <Image
                src={policy.image}
                alt={policy.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Base subtle gradient — always visible */}
            <div className={`absolute inset-0 ${
                isEven
                    ? "bg-gradient-to-r from-black/50 to-transparent"
                    : "bg-gradient-to-l from-black/50 to-transparent"
            }`} />
            {/* Hover gradient — animates in */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isEven
                    ? "bg-gradient-to-r from-black/70 to-transparent"
                    : "bg-gradient-to-l from-black/70 to-transparent"
            }`} />
            {/* Text content */}
            <div className={`absolute inset-0 flex flex-col justify-end gap-0 px-8 md:px-16 pb-10 md:pb-12 ${
                isEven ? "items-start text-left" : "items-end text-right"
            }`}>
                {/* Title — large by default, shrinks and moves up on hover */}
                <h3 className="font-serif text-[32px] md:text-[46px] group-hover:text-[26px] md:group-hover:text-[34px] text-white leading-tight max-w-[500px] transition-all duration-500 ease-out">
                    {policy.title}
                </h3>
                {/* Description — hidden by default, slides in on hover */}
                <p className="text-white/90 text-sm md:text-base max-w-[450px] leading-relaxed max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 group-hover:mt-3 transition-all duration-500 ease-out overflow-hidden">
                    {policy.description.trim()}
                </p>
                {/* Learn more — hidden by default, fades in on hover */}
                <span className="text-white text-sm font-medium tracking-wide uppercase max-h-0 opacity-0 group-hover:max-h-[40px] group-hover:opacity-100 group-hover:mt-3 transition-all duration-500 ease-out overflow-hidden hover:underline">
                    Learn More →
                </span>
            </div>
        </Link>
    )
}


const AdvocacyPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start">
            <Hero title="Advocacy" image={AdvocacyHero} />

            <div className="py-16">
                <ScrollReveal variant="fade-up">
                    <Callout className="">
                        Return to Freedom is leading the fight to protect America's wild
                        horses and burros through policy reform, legal action, and grassroots
                        mobilization. Every voice matters — together we can end roundups, stop
                        slaughter, and ensure humane, science-based management for generations
                        to come.
                    </Callout>
                </ScrollReveal>
            </div>

            <ScrollReveal variant="fade-in" className="mb-8 px-6 md:px-8">
                <Header color="sage-green">
                    Our Policy & Legislative Priorities
                </Header>
            </ScrollReveal>

            {/* Policy cards — full-width, stacked with no gap */}
            <div className="w-full flex flex-col">
                {policies.map((policy, i) => (
                    <ScrollReveal key={policy.title} variant="fade-in">
                        <PolicyCard policy={policy} index={i} />
                    </ScrollReveal>
                ))}
            </div>

            <ScrollReveal variant="fade-up" className="w-full">
                <NewsCarousel title="RTF's Advocacy Work" topic="advocacy" />
            </ScrollReveal>

            {/* Donate callout + TakeAction + Stats — flush, no gaps */}
            <div className="w-full flex flex-col">
                <ScrollReveal variant="fade-up" className="w-full">
                    <DonationCallout
                        image={BlurredBg}
                        heading={<>Donate to <br /> Wild Horse Defense Fund</>}
                        description="The Wild Horse Defense Fund fuels Return to Freedom's frontline work to end cruel roundups, advance humane on-range management, and defend wild horses through advocacy, legal action, and education."
                        donatePathway="Wild Horse Defense Fund"
                        buttonText="Donate Now"
                        align="center"
                        analyticsName="whd_fund"
                        className="min-h-[300px] md:min-h-[350px] rounded-none"
                    />
                </ScrollReveal>

                <TakeActionSection rows={1} showControls={true} />

                <StatsBar />
            </div>

        </div>
    )
}

export default AdvocacyPage
