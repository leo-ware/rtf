"use client"

import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Button from "@/components/public-ui/Button"
import NewsCarousel from "@/components/NewsCarousel"
import DonationCallout from "@/components/DonationCallout"
import SponsorAHerdDialog from "@/components/donation-widgets/SponsorAHerdDialog"
import ScrollReveal from "@/components/public-ui/ScrollReveal"

import HeroImg from "./hero.jpg"
import BlurredBg from "./blurred-bg.jpg"
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

            <ScrollReveal variant="fade-up">
                <Callout className="text-sage-green">
                    Return to Freedom is proud of its groundbreaking conservation work, including our
                    pioneering use of fertility control, model holistic grazing program and preservation of
                    threatened strains of America's mustangs. Taken together, these efforts help form the
                    foundation of our advocacy work on behalf of wild horses and burros on our public lands.
                </Callout>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" className="w-full flex flex-col items-center justify-center gap-4">
                <Header className="text-cinnamon underline w-10/12 md:w-8/12 mx-auto">
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
            </ScrollReveal>

            <ScrollReveal variant="fade-up" className="w-10/12 md:w-8/12 mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full md:w-1/2 mx-auto flex flex-col items-center justify-center gap-4">
                    <Header level={2} className="text-cinnamon underline">
                        Before Reseeding
                    </Header>
                    <div className="w-full aspect-[3/4] relative">
                        <ImageWithAuthorCredit src={Before} alt="Before" fill className="object-cover object-center" wrapperClassName="w-full h-full" />
                    </div>
                    <div className="text-ink font-sans text-base md:text-[20px] text-center">
                        RTF staff seeding for the regenerative grazing project in San Luis Obispo, CA.
                    </div>
                </div>
                <div className="w-full md:w-1/2 mx-auto flex flex-col items-center justify-center gap-4">
                    <Header level={2} className="text-cinnamon underline">
                        After Reseeding
                    </Header>
                    <div className="w-full aspect-[3/4] relative">
                        <ImageWithAuthorCredit src={After} alt="After" fill className="object-cover object-center" wrapperClassName="w-full h-full" />
                    </div>
                    <div className="text-ink font-sans text-base md:text-[20px] text-center">
                        Grass growth at San Luis Obispo - showing progress from our regenerative grazing project.
                    </div>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-in" className="w-11/12 md:w-10/12 mx-auto">
                <Header color="cinnamon" className="mb-8">
                    Preservation of Rare Historic Horse Strains
                </Header>
                <Carousel
                    nDisplayItems={1}
                    autoPlay={false}
                    navigationPosition="bottom"
                    dotIndicators
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
                                <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8">
                                    <div className="w-full lg:w-auto h-[200px] sm:h-[250px] lg:h-[350px] lg:aspect-[4/3] relative">
                                        <ImageWithAuthorCredit
                                            src={image}
                                            alt={title}
                                            fill
                                            className="object-cover object-center"
                                            wrapperClassName="w-full h-full" />
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
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <NewsCarousel topic="conservation" />
            </ScrollReveal>

            <div className="w-full mx-auto">
                <ScrollReveal variant="fade-in" className="w-10/12 lg:w-8/12 mx-auto">
                    <Header className="mb-8 text-cinnamon underline">
                        Fertility Control
                    </Header>
                </ScrollReveal>

                <AlternatingPictureLayout
                    className="!w-10/12 lg:!w-8/12"
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

            <ScrollReveal variant="fade-up" className="w-11/12 md:w-10/12 mx-auto">
                <DonationCallout
                    image={BlurredBg}
                    heading="Support our conservation efforts by donating to our Sanctuary Fund"
                    description="The Wild Horse Defense Fund fuels Return to Freedom's frontline work to end cruel roundups, advance humane on-range management, and defend wild horses through advocacy, legal action, and education."
                    donatePathway="Sanctuary Fund"
                    buttonText="Donate Now"
                    align="center"
                    analyticsName="sanctuary_fund_conservation"
                />
            </ScrollReveal>
        </div>
    )
}

export default ConservationPage