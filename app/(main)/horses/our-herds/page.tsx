"use client"

import Hero from "@/components/public-ui/Hero"
import SponsorAHorseMenu from "../../../../components/donation-widgets/SponsorAHorseMenu"

import OurHerdsHeroImage from "./herds-hero.jpg"
import HerdsTabsSection from "./HerdsTabsSection"
import { use } from "react"

const OurHerdsPage = ({ searchParams }: { searchParams: Promise<{ slug?: string }> }) => {
    const { slug } = use(searchParams)
    return (
        <div className="w-full h-fit mb-16 flex flex-col items-center justify-start gap-16 text-center">
            <Hero title="Our Herds" image={OurHerdsHeroImage} />

            <div className="w-8/12 h-fit flex flex-col items-center justify-center text-pewter text-[24px] font-serif">
                The majority of the horses who range free at the Return to Freedom Wild Horse Sanctuary
                are part of a herd or bachelor band. Some herds arrived together. Others formed after
                they arrived. Still others found new family members among horses already residing at
                the Sanctuary. But no matter how they formed, each herd is a closely-knit family or
                social group, with each member assuming specific duties and responsibilities, and
                all share a very deep bond.
            </div>

            <HerdsTabsSection defaultSlug={slug} />

            <div className="w-full h-fit">
                <SponsorAHorseMenu />
            </div>
        </div>
    )
}

export default OurHerdsPage