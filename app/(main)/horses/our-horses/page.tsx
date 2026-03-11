"use client"

import Hero from "@/components/public-ui/Hero"
import Button from "@/components/public-ui/Button"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import SponsorAHorseMenu from "../../../../components/donation-widgets/SponsorAHorseMenu"
import OurHorsesHeroImage from "./our-horses-hero.jpg"

import SpiritImage from "./spirit.png"
import AdoptBanner from "./adopt-banner.jpg"
import Link from "next/link"
import SponsorAHorseDialog from "@/components/donation-widgets/SponsorAHorseDialog"
import HerdsCarousel from "@/components/HerdsCarousel"
import Header from "@/components/public-ui/Header"
import ConvexImage from "@/components/images/ConvexImage"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const OurHorsesPage = () => {
    const { results: allHorses } = usePaginatedQuery(
        api.animals.listAnimals,
        { type: "horse" },
        { initialNumItems: 100 }
    )

    const inMemoriamHorse = allHorses?.find(h => h.inMemoriam)

    return (
        <div className="w-full h-fit min-h-screen flex flex-col items-center justify-start gap-16 text-center">

            <Hero title="Our Horses" image={OurHorsesHeroImage} />

            <div className="w-10/12 md:w-8/12 h-fit flex flex-col items-center justify-center text-left md:text-center text-pewter text-[24px] font-serif">
                Every horse at Return to Freedom carries a story—of survival,
                resilience, and renewal. From the wild herds rescued from
                government roundups to the rare and historic strains preserved
                for future generations, each one represents a vital piece of
                America's living heritage. Across our sanctuaries in Lompoc
                and San Luis Obispo, more than 460 wild horses and burros
                now live safely in natural family bands, free from fear and
                confinement.
            </div>

            <div className="w-10/12 h-fit flex flex-col items-start md:items-center justify-center gap-4">
                <Header level={1} className="text-sage-green">
                    Meet Spirit
                </Header>
                <div className="text-left md:text-center text-[20px] font-serif">
                    Spirit, the Kiger mustang who inspired DreamWorks’ Spirit:
                    Stallion of the Cimarron, found his permanent home at
                    Return to Freedom after the film’s release in 2002.
                    Now in his thirties, Spirit lives at our Lompoc sanctuary
                    as an ambassador for all wild horses—helping children and
                    adults alike connect with the beauty, strength, and freedom
                    that define America's mustangs.
                </div>
                <Link href="/horses/spirit">
                    <Button color="cinnamon" className="py-1 px-4">
                        LEARN MORE ABOUT SPIRIT
                    </Button>
                </Link>
            </div>

            <div className="relative w-full h-[500px] flex flex-col items-center justify-center">
                <ImageWithAuthorCredit
                    src={SpiritImage}
                    alt="Spirit"
                    className="w-full h-full object-cover object-center"
                    fill
                    wrapperClassName="w-full h-full"
                />
            </div>

            <HerdsCarousel />

            <SponsorAHorseMenu showControls={false} initialNumItems={3} />

            <div className="relative w-full h-[500px] flex flex-col items-center justify-center gap-8">
                <ImageWithAuthorCredit
                    src={AdoptBanner}
                    alt="Adopt a Horse"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center"
                    wrapperClassName="absolute top-0 left-0 w-full h-full" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-black/70 from-0% via-transparent via-60% to-transparent md:bg-gradient-to-l max-md:bg-black/50" />
                <div className="relative w-full h-full py-10 px-8 md:px-32 z-10 flex flex-col items-center md:items-end justify-center gap-2">
                    <div className="relative z-10 text-white text-[36px] md:text-[48px] font-serif">
                        Adopt a Horse
                    </div>
                    <div className="text-white text-xl md:text-2xl font-serif">
                        Give a horse a forever home.
                    </div>
                    <Link href="/horses/adopt-a-horse">
                        <Button color="cinnamon" className="py-1 px-4">Learn more</Button>
                    </Link>
                </div>
            </div>

            {inMemoriamHorse && (
                <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
                    <Header className="text-sage-green px-6 md:px-0">
                        In Memoriam
                    </Header>
                    <div className="w-full h-fit flex flex-col items-center justify-center">
                        {inMemoriamHorse.image?.url && (
                            <div className="relative w-full h-[600px]">
                                <ConvexImage
                                    src={inMemoriamHorse.image.url}
                                    alt={inMemoriamHorse.name}
                                    width={inMemoriamHorse.image.width || 1200}
                                    height={inMemoriamHorse.image.height || 400}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        )}
                        <div className="w-full h-fit bg-pewter text-white flex flex-col lg:flex-row py-8 px-6 lg:py-12 lg:px-48 gap-4 lg:gap-32">
                            <div className="lg:basis-[200px] flex flex-col items-start lg:items-end justify-center gap-2">
                                <div className="text-3xl font-serif">{inMemoriamHorse.name}</div>
                            </div>
                            <div className="lg:basis-0 lg:grow flex flex-col items-start justify-center gap-2">
                                <div className="text-lg text-left">
                                    {inMemoriamHorse.description}
                                </div>
                                <SponsorAHorseDialog animalId={inMemoriamHorse._id}>
                                    <Button color="cinnamon" className="py-1 px-4">
                                        Donate in Memory of {inMemoriamHorse.name}
                                    </Button>
                                </SponsorAHorseDialog>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OurHorsesPage