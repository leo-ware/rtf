"use client"

import Hero from "@/components/public-ui/Hero"
import Button from "@/components/public-ui/Button"
import Image from "next/image"
import SponsorAHorseMenu from "../../../../components/donation-widgets/SponsorAHorseMenu"
import OurHorsesHeroImage from "./our-horses-hero.jpg"

import SpiritImage from "./spirit.png"
import AdoptBanner from "./adopt-banner.jpg"
import MysticImage from "./mystic.png"
import Link from "next/link"
import GenericDonateDialogue from "@/components/donation-widgets/GenericDonateDialogue"
import HerdsCarousel from "@/components/HerdsCarousel"
import Header from "@/components/public-ui/Header"

const OurHorsesPage = () => {
    return (
        <div className="w-full h-fit min-h-screen flex flex-col items-center justify-start gap-16 text-center">

            <Hero title="Our Horses" image={OurHorsesHeroImage} />

            <div className="w-8/12 h-fit flex flex-col items-center justify-center text-pewter text-[24px] font-serif">
                Every horse at Return to Freedom carries a story—of survival,
                resilience, and renewal. From the wild herds rescued from
                government roundups to the rare and historic strains preserved
                for future generations, each one represents a vital piece of
                America's living heritage. Across our sanctuaries in Lompoc
                and San Luis Obispo, more than 460 wild horses and burros
                now live safely in natural family bands, free from fear and
                confinement.
            </div>

            <div className="w-10/12 h-fit flex flex-col items-center justify-center gap-4">
                <Header level={1} className="text-sage-green">
                    Meet Spirit
                </Header>
                <div className="text-[20px] font-serif">
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
                <Image
                    src={SpiritImage}
                    alt="Spirit"
                    className="w-full h-full object-cover object-center"
                    fill
                />
            </div>

            <HerdsCarousel />

            <SponsorAHorseMenu showControls={false} initialNumItems={3} />

            <div className="relative w-full h-[500px] flex flex-col items-center justify-center gap-8">
                <Image
                    src={AdoptBanner}
                    alt="Adopt a Horse"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-black/70 from-0% via-transparent via-60% to-transparent" />
                <div className="relative w-full h-full py-10 px-32 z-10 flex flex-col items-end justify-center gap-2">
                    <div className="relative z-10 text-white text-[48px] font-serif">
                        Adopt a Horse
                    </div>
                    <div className="text-white text-2xl font-serif">
                        Give a horse a forever home.
                    </div>
                    <Link href="/horses/adopt-a-horse">
                        <Button color="cinnamon" className="py-1 px-4">Learn more</Button>
                    </Link>
                </div>
            </div>

            <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
                <Header className="text-sage-green">
                    In Memoriam
                </Header>
                <div className="w-full h-fit flex flex-col items-center justify-center">
                    <div className="relative w-full h-[600px]">
                        <Image className="w-full h-full object-cover object-top" src={MysticImage} alt="Mystic" />
                    </div>
                    <div className="w-full h-fit bg-pewter text-white flex py-6 px-48 gap-32">
                        <div className="basis-[200px] flex flex-col items-end justify-center gap-2">
                            <div className="text-3xl font-serif">Mystic</div>
                            <div className="text-2xl font-serif">1995-2025</div>
                        </div>
                        <div className="basis-0 grow flex flex-col items-start justify-center gap-2">
                            <div className="text-lg text-left">
                                Mystic, one of our ambassador stallions left this world to run in the next. He
                                was approximately 30 years old. It is painful to know he is no longer here in
                                the hills, but many of us share 16 years of memories with him and for that time
                                we are forever grateful. Mystic was one of the first stallions to arrive at
                                Return to Freedom in 1999. He was captured during the total removal of 279
                                horses from the Hart Mountain National Antelope Refuge in Oregon.
                            </div>
                            <GenericDonateDialogue defaultPathwayName="In Honor and Memory Gifts">
                                <Button color="cinnamon" className="py-1 px-4">
                                    Donate in Memory of Mystic
                                </Button>
                            </GenericDonateDialogue>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OurHorsesPage