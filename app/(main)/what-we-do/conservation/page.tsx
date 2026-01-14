"use client"

import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import Image from "next/image"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Button from "@/components/public-ui/Button"
import NewsCarousel from "@/components/NewsCarousel"
import BlurredImageCard from "@/components/public-ui/BlurredImageCard"
import SponsorAHerdDialog from "@/components/donation-widgets/sponsor-a-herd-dialog"
import GenericDonateDialogue from "@/components/donation-widgets/GenericDonateDialogue"

import HeroImg from "./hero.jpg"
import BlurredBg from "./blurred-bg.jpg"
import CarouselDummy2 from "./carousel-dummy-2.jpg"
import CarouselDummy from "./carousel-dummy.png"
import After from "./after.png"
import Before from "./before.png"
import Img5 from "./img5.jpg"
import Img4 from "./img4.jpg"
import Img3 from "./img3.png"
import Img2 from "./im2.png"
import Img1 from "./img1.png"


const ConservationPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 mb-16">
            <Hero title="Conservation" image={HeroImg} />

            <Callout className="text-sage-green">
                Conservation at Return to Freedom is where science meets stewardship. For more than
                25 years, we've modeled solutions that balance the needs of wild horses, land, and
                people—translating sanctuary-based learning into national standards for humane management.
                Our conservation work focuses on three interconnected pillars: fertility control, holistic
                land management, and the preservation of rare historic horse strains.
            </Callout>

            <div className="w-full flex flex-col items-center justify-center gap-4">
                <Header className="text-cinnamon underline">
                    Holistic Land Management
                </Header>
                <Callout className="text-ink">
                    Holistic land management uses intentional herd movement, diversified grazing, and soil
                    restoration practices to rebuild healthy grasslands. Instead of letting horses
                    overgraze one area, we rotate them across the landscape to mimic natural patterns—encouraging
                    regrowth, improving biodiversity, and strengthening water systems.
                </Callout>
                <div className="w-10/12 md:w-8/12 mx-auto">
                    <iframe
                        className="w-full aspect-[16/9]"
                        src="https://www.youtube.com/embed/s6Zlpe9Xtqw?si=z0_g2P6WfS_n3I1C"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen />
                </div>
                <Callout className="text-ink font-sans text-[20px]">
                    Recorded at RTF's SLO sanctuary, this video shows Rodger Savory demonstrating how wild horses
                    support land restoration in brittle environments—ecosystems with distinct wet and dry seasons
                    that cannot regenerate without animal impact and thoughtful human management. Through timed
                    grazing and long recovery periods, degraded hillsides now retain water, grow native grasses,
                    and rebuild soil structure.
                </Callout>
            </div>

            <div className="w-10/12 md:w-8/12 mx-auto flex items-center justify-center gap-8">
                <div className="w-full md:w-1/2 mx-auto flex flex-col items-center justify-center gap-4">
                    <Header level={2} className="text-cinnamon underline">
                        Before Reseeding
                    </Header>
                    <div className="w-full aspect-[3/4] relative">
                        <Image src={Before} alt="Before" fill className="object-cover object-center" />
                    </div>
                    <div className="text-ink font-sans text-[20px] text-center">
                        RTF staff seeding for the regenerative grazing project in San Luis Obispo, CA.
                    </div>
                </div>
                <div className="w-full md:w-1/2 mx-auto flex flex-col items-center justify-center gap-4">
                    <Header level={2} className="text-cinnamon underline">
                        After Reseeding
                    </Header>
                    <div className="w-full aspect-[3/4] relative">
                        <Image src={After} alt="After" fill className="object-cover object-center" />
                    </div>
                    <div className="text-ink font-sans text-[20px] text-center">
                        Grass growth at San Luis Obispo - showing progress from our regenerative grazing project.
                    </div>
                </div>
            </div>

            <div className="md:w-10/12 mx-auto">
                <Header color="cinnamon" className="mb-8">
                    Preservation of Rare Historic Horse Strains
                </Header>
                <Carousel
                    nDisplayItems={1}
                    autoPlay={false}
                    leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                    rightButton={<FaCaretRight size={30} className="text-pewter" />}
                    items={
                        [
                            {
                                title: "How RTF Protects Rare Historic Strains",
                                description: `
                                    Return to Freedom safeguards several of the most endangered early American horse 
                                    strains—lineages tracing back to Spanish colonial and Indigenous history. We protect 
                                    these horses through intact family bands, careful genetic management, and secure 
                                    sanctuary habitat where their lineage can be preserved without the threat of removal 
                                    or fragmentation.
                                `,
                                image: CarouselDummy
                            },
                            {
                                title: "Choctaw Horses",
                                description: (
                                    <div>
                                        A strain closely tied to the history of the Choctaw Nation, these horses descend from early
                                        Spanish stock brought to the Southeast. Choctaws are known for their endurance, agility,
                                        and distinctive Spanish-type traits. RTF protects several Choctaw family bands, helping
                                        maintain one of the few remaining sources of genetic diversity for this rare lineage.
                                        <SponsorAHerdDialog>
                                            <Button color="cinnamon" className="mt-4">
                                                Donate to Protect Choctaw Horses
                                            </Button>
                                        </SponsorAHerdDialog>
                                    </div>
                                ),
                                image: CarouselDummy,
                            },
                            {
                                title: "Mission (Padre Kino) Horses",
                                description: (
                                    <div>
                                        These horses descend from the original Spanish mission horses brought to California in the
                                        late 1600s. Their lineage represents one of the earliest established horse populations in
                                        the American West. At RTF, they live in cohesive family groups, preserving both their heritage
                                        and their social structure.
                                        <SponsorAHerdDialog>
                                            <Button color="cinnamon" className="mt-4">
                                                Donate to Protect the Mission Herd
                                            </Button>
                                        </SponsorAHerdDialog>
                                    </div>
                                ),
                                image: CarouselDummy,
                            },
                            {
                                title: "Sulphur Springs Horses",
                                description: (
                                    <div>
                                        One of the most genetically pure Iberian-type mustang strains, known for dorsal stripes,
                                        leg barring, and dun coloration. Originating from the remote Sulphur Herd Management Area
                                        in Utah, they closely resemble early Spanish horses in conformation and behavior. RTF provides
                                        a safe haven for these horses to live naturally and maintain their rare genetic profile.
                                        <SponsorAHerdDialog>
                                            <Button color="cinnamon" className="mt-4">
                                                Donate to the Sulphur Springs Herd
                                            </Button>
                                        </SponsorAHerdDialog>
                                    </div>
                                ),
                                image: CarouselDummy,
                            },
                            {
                                title: "Cerbat Spanish Mustangs",
                                description: (
                                    <div>
                                        A critically rare desert-adapted strain from the rugged Cerbat Mountains of northern Arizona.
                                        For generations, their lineage remained relatively isolated, preserving strong Old World
                                        Spanish characteristics. RTF protects Cerbat family bands to ensure this ancient lineage
                                        continues into the future.
                                        <SponsorAHerdDialog>
                                            <Button color="cinnamon" className="mt-4">
                                                Learn more about the Hart Mountain Herd
                                            </Button>
                                        </SponsorAHerdDialog>
                                    </div>
                                ),
                                image: CarouselDummy,
                            },

                        ].map(({ title, description, image }) => ({
                            id: title,
                            widget: (
                                <div className="w-full h-full flex items-center justify-center gap-8">
                                    <div className="hidden md:block h-[350px] aspect-[4/3] relative">
                                        <Image
                                            src={image}
                                            alt={title}
                                            className="w-full h-full object-cover object-center" />
                                    </div>
                                    <div className="basis-0 grow h-full text-left flex flex-col gap-4 items-start justify-center">
                                        <Header level={2} className="text-left">
                                            {title}
                                        </Header>
                                        <div className="text-[20px] text-ink">
                                            {description}
                                        </div>
                                    </div>
                                </div>
                            )
                        }))
                    }
                />
            </div>

            <NewsCarousel topic="conservation" />

            <div className="w-10/12 mx-auto">
                <Header color="sage-green" className="mb-8">
                    Conservation in Action
                </Header>
                <div className="w-full h-fit flex flex-col items-center justify-center bg-pewter rounded-md overflow-hidden">
                    <div className="w-full h-[400px] relative">
                        <Image
                            src={CarouselDummy2}
                            alt="Foo"
                            fill className="w-full h-full object-cover object-center" />
                    </div>
                    <div className="w-full h-[95px] flex items-center justify-center">
                        <div className="text-white text-lg text-center m-0 p-0">
                            Celeste Carlisle, our biologist, reseeding the sanctuary
                        </div>
                    </div>
                </div>
                {/* <Carousel
                    nDisplayItems={1}
                    autoPlay={false}
                    leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                    rightButton={<FaCaretRight size={30} className="text-pewter" />}
                    items={[
                        {
                            id: "foo",
                            widget: (
                                <div className="w-full h-fit flex flex-col items-center justify-center gap-4 bg-pewter">
                                    <div className="w-full h-[400px] relative">
                                        <Image
                                            src={CarouselDummy2}
                                            alt="Foo"
                                            fill className="w-full h-full object-cover object-center" />
                                    </div>
                                    <div className="w-full h-8 flex items-center justify-center">
                                        <div className="text-white text-lg">
                                            Celeste Carlisle, our biologist, reseeding the sanctuary
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                /> */}
            </div>

            <div className="w-full">
                <Header className="mb-8 text-cinnamon underline">
                    Fertility Control
                </Header>

                <AlternatingPictureLayout
                    alternateTitleColors={true}
                    items={[
                        {
                            title: "What Is PZP Fertility Control?",
                            description: `
                            Porcine Zona Pellucida (PZP) is a non-hormonal, reversible vaccine used to humanely 
                            slow herd growth. Unlike hormonal methods, PZP does not change behavior, disrupt 
                            natural cycling, or alter herd hierarchy. Instead, it simply prevents fertilization 
                            while allowing mares to live and interact normally within their family bands.
                        `,
                            image: Img1,
                        },
                        {
                            title: "How It Works",
                            description: `
                            PZP causes the mare's immune system to create antibodies that block sperm from attaching 
                            to the egg. The mare still comes into heat and exhibits her full range of natural 
                            behaviors—she just does not conceive. Initial treatment requires a primer and booster, 
                            followed by periodic maintenance doses depending on the herd and setting.
                        `,
                            image: Img2,
                        },
                        {
                            title: "Why It's Effective",
                            description: `
                            Decades of field use show 98-99% success in preventing pregnancies when mares receive 
                            timely boosters. Small fluctuations are expected in wildlife biology but do not affect 
                            overall herd stability. The result is predictable, steady population control without 
                            removing horses from the range or breaking apart social structures.
                        `,
                            image: Img3,
                        },
                        {
                            title: "Why It Matters for Ecosystems and Management",
                            description: `
                            Stabilizing herd growth on the range reduces pressure on forage and water, prevents 
                            overcrowding, and lessens conflict with livestock. PZP programs cost a fraction of 
                            helicopter roundups and holding facilities, offering the most humane and economically 
                            responsible path for long-term wild horse management on public lands.
                        `,
                            image: Img4,
                        },
                        {
                            title: "RTF's Role in Advancing Fertility Control",
                            description: `
                            Return to Freedom was one of the earliest organizations to implement native PZP in 1999 
                            and has contributed hands-on data and model practices for over 25 years. Today, RTF leads 
                            both sanctuary-based population management and an expanding On-Range Project, where the 
                            team monitors bands, identifies individuals, and uses remote darting to keep horses free 
                            on the landscapes they belong to.
                        `,
                            image: Img5,
                        },
                    ]}
                />
            </div>

            <div className="w-10/12 mx-auto">
                <BlurredImageCard image={BlurredBg}>
                    <div className="w-full h-full py-16 px-10 flex flex-col items-center justify-center gap-4">
                        <div className="text-4xl md:max-w-7/12 font-serif text-white text-center">
                            Support our conservation efforts by donating to our Sanctuary Fund
                        </div>
                        <div className="max-w-[650px] text-lg text-white text-center">
                            The Wild Horse Defense Fund fuels Return to Freedom’s frontline work to end cruel
                            roundups, advance humane on-range management, and defend wild horses through advocacy,
                            legal action, and education.
                        </div>
                        <GenericDonateDialogue>
                            <Button color="cinnamon">Donate Now</Button>
                        </GenericDonateDialogue>
                    </div>
                </BlurredImageCard>
            </div>
        </div>
    )
}

export default ConservationPage