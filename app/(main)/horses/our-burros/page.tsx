"use client"

import Hero from "@/components/public-ui/Hero"
import SponsorAHorseMenu from "@/components/donation-widgets/SponsorAHorseMenu"
import HerdsCarousel from "@/components/HerdsCarousel"
import Header from "@/components/public-ui/Header"
import HeroImage from "@/app/(main)/donate/sponsor-a-burro/hero.jpg"
import GenericDonateDialogue from "@/components/donation-widgets/GenericDonateDialogue"
import Button from "@/components/public-ui/Button"
import ConvexImage from "@/components/images/ConvexImage"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const OurBurrosPage = () => {
    const { results: allBurros } = usePaginatedQuery(
        api.animals.listAnimals,
        { type: "burro" },
        { initialNumItems: 100 }
    )

    const inMemoriamBurro = allBurros?.find(b => b.inMemoriam)

    return (
        <div className="w-full h-fit min-h-screen flex flex-col items-center justify-start gap-16 pb-64 text-center">

            <Hero title="Our Burros" image={HeroImage} />

            <div className="w-10/12 md:w-8/12 h-fit flex flex-col items-center justify-center text-pewter text-[24px] font-serif text-left md:text-center">
                The burros at Return to Freedom are cherished members of our
                sanctuary family. Rescued from government roundups and other
                at-risk situations, each burro has found safety and companionship
                on our land. Intelligent, resilient, and deeply social, these
                remarkable animals play an important role in the story of
                America&apos;s wild places—and in our mission to protect them.
            </div>

            <HerdsCarousel />

            <SponsorAHorseMenu type="burro" showControls={false} initialNumItems={3} />

            {inMemoriamBurro && (
                <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
                    <Header className="text-sage-green">
                        In Memoriam
                    </Header>
                    <div className="w-full h-fit flex flex-col items-center justify-center">
                        {inMemoriamBurro.image?.url && (
                            <div className="relative w-full h-[600px]">
                                <ConvexImage
                                    src={inMemoriamBurro.image.url}
                                    alt={inMemoriamBurro.name}
                                    width={inMemoriamBurro.image.width || 1200}
                                    height={inMemoriamBurro.image.height || 600}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        )}
                        <div className="w-full h-fit bg-pewter text-white flex py-6 px-48 gap-32">
                            <div className="basis-[200px] flex flex-col items-end justify-center gap-2">
                                <div className="text-3xl font-serif">{inMemoriamBurro.name}</div>
                            </div>
                            <div className="basis-0 grow flex flex-col items-start justify-center gap-2">
                                <div className="text-lg text-left">
                                    {inMemoriamBurro.description}
                                </div>
                                <GenericDonateDialogue defaultPathwayName="In Honor and Memory Gifts">
                                    <Button color="cinnamon" className="py-1 px-4">
                                        Donate in Memory of {inMemoriamBurro.name}
                                    </Button>
                                </GenericDonateDialogue>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OurBurrosPage
