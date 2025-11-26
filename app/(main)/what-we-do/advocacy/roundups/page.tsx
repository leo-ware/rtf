import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import Carousel from "@/components/Carousel"
import Image from "next/image"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import CardLayout from "@/components/public-ui/CardLayout"
import TakeActionLink from "@/components/TakeActionLink"
import NewsCarousel from "@/components/NewsCarousel"
import BlurredImageCard from "@/components/public-ui/BlurredImageCard"
import Button from "@/components/public-ui/Button"

import RoundupsHero from "./roundups-hero.png"
import RoundupsImage1 from "../imgs/randomhorse.png"
import TakeActionImage1 from "../imgs/take-action-1.jpg"
import TakeActionImage2 from "../imgs/take-action-2.jpg"
import TakeActionImage3 from "../imgs/take-action-3.jpg"
import BlurredBg from "../imgs/blurred-bg.jpg"
import GenericDonateDialogue from "@/components/donation-widgets/GenericDonateDialogue"


const RoundupsPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 mb-16">
            <Hero title="Roundups" image={RoundupsHero} />
            <Callout className="text-cinnamon">
                Each year, thousands of wild horses and burros are chased by low-flying helicopters
                into traps on our public lands. These operations, conducted by the Bureau of Land
                Management (BLM) and U.S. Forest Service, are meant to reduce herd numbers—but instead,
                they destroy family bands, cost taxpayers hundreds of millions, and fill holding
                facilities where over 60,000 horses now live in confinement.  RTF advocates for humane,
                science-based alternatives that keep wild horses free on the range, where they belong.
            </Callout>

            <div className="w-10/12 md:w-8/12 mx-auto">
                <iframe
                    className="w-full aspect-[16/9]"
                    src="https://www.youtube.com/embed/Oo9EbArcQ1c?si=6r6KR7I0x0F0PVGy"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen />
            </div>

            <div className="md:w-10/12 mx-auto">
                <Carousel
                    nDisplayItems={1}
                    autoPlay={false}
                    leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                    rightButton={<FaCaretRight size={30} className="text-pewter" />}
                    items={
                        [
                            {
                                title: "What Are Roundups?",
                                description: `
                                    Helicopter roundups are the federal government's primary method of capturing wild
                                    horses and burros from public lands. Each year, the Bureau of Land Management
                                    (BLM) and U.S. Forest Service use low-flying helicopters to drive entire herds—mares,
                                    foals, and stallions—into temporary traps. These operations are meant to reduce herd
                                    numbers to meet Appropriate Management Levels (AMLs), population targets that often
                                    prioritize private livestock grazing over wild equines. The result: injured and
                                    terrified animals, separated families, and thousands of horses removed from the range
                                    every year.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "Why Roundups Happen?",
                                description: `
                                    The BLM manages roughly 27 million acres of public land for wild horses and burros, 
                                    but livestock operations are allotted the vast majority of available forage and water. 
                                    AMLs often allow fewer than one horse per 1,000 acres, leaving herds with minimal 
                                    space and resources. When populations exceed these limits, roundups are authorized 
                                    instead of implementing balanced land-use plans that consider ecological conditions, 
                                    natural predation, or fertility control.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "How Roundups Are Conducted",
                                description: `
                                    Helicopters herd horses over long distances, sometimes across rocky or uneven terrain, 
                                    into trap pens lined with fencing and panels. Once confined, animals are sorted by age 
                                    and sex, then loaded onto trailers for transport to short-term holding corrals. After 
                                    processing, many are shipped to long-term pastures or government holding facilities 
                                    hundreds of miles from their home ranges. The stress of capture and transport often 
                                    results in injuries, exhaustion, and foal separation.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "The Aftermath",
                                description: `
                                    More than 60,000 wild horses and burros are now confined in off-range holding facilities, 
                                    exceeding the number still living free. Maintaining these animals costs U.S. taxpayers 
                                    over $100 million each year. Horses may remain in captivity for life, and herd genetics 
                                    are weakened by repeated removals from the same regions. Meanwhile, continued roundups do 
                                    little to address rangeland health or improve management of shared public lands.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "Policy & Legal Reform",
                                description: `
                                    Return to Freedom advocates for an overhaul of the federal wild horse and burro management 
                                    system. Through legal challenges and policy work, RTF seeks to limit helicopter use, ensure 
                                    compliance with environmental laws, and shift federal resources toward on-range management. 
                                    Current reform priorities include revising AML standards, expanding fertility control 
                                    programs, and improving oversight of BLM contracts and roundup practices.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "A Humane Alternative",
                                description: `
                                    For more than two decades, Return to Freedom has implemented and demonstrated fertility control 
                                    as an effective, science-based alternative to roundups. The PZP vaccine safely and reversibly 
                                    manages herd growth while allowing horses to remain in their natural family bands. RTF's Wild 
                                    Horse Defense Fund supports these on-range programs, policy reform, and legal advocacy to ensure 
                                    America's wild horses stay protected—wild and free on the range.
                                `,
                                image: RoundupsImage1
                            }
                        ].map(({ title, description, image }) => ({
                            id: title,
                            widget: (
                                <div className="w-full h-full flex items-center justify-center gap-8">
                                    <div className="hidden md:block h-[300px] aspect-[4/3] relative">
                                        <Image
                                            src={image}
                                            alt={title}
                                            className="w-full h-full object-cover object-center" />
                                    </div>
                                    <div className="basis-0 grow h-full text-left flex flex-col gap-4 items-start justify-center">
                                        <Header level={2} className="text-left">
                                            {title}
                                        </Header>
                                        <div className="text-lg text-ink">
                                            {description}
                                        </div>
                                    </div>
                                </div>
                            )
                        }))
                    }
                />
            </div>

            <div className="w-10/12 mx-auto flex flex-col items-center justify-center gap-8">
                <Header level={2} className="text-cinnamon">
                    Take Action
                </Header>

                <CardLayout >
                    <TakeActionLink
                        className="mx-auto"
                        title="Sign a petition to end horse slaughter in the United States"
                        image={TakeActionImage1} />
                    <TakeActionLink
                        className="mx-auto"
                        title="Contact your representative to ensure this bill does not pass"
                        image={TakeActionImage2} />
                    <TakeActionLink
                        className="mx-auto"
                        title="Show your support protesting the BLM's actions"
                        image={TakeActionImage3} />
                </CardLayout>
            </div>

            <NewsCarousel
                title="Latest News on Roundups"
                bgColor="seashell"
                topic="roundups" />

            <div className="w-10/12 mx-auto">
                <BlurredImageCard image={BlurredBg}>
                    <div className="w-full h-full py-16 px-10 flex flex-col items-center justify-center gap-4">
                        <div className="text-4xl font-serif text-white text-center">
                            Donate to the Wild Horse Defense Fund
                        </div>
                        <div className="max-w-[650px] text-lg text-white text-center">
                            The Wild Horse Defense Fund fuels Return to Freedom’s frontline work to
                            end cruel roundups, advance humane on-range management, and defend wild
                            horses through advocacy, legal action, and education.
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

export default RoundupsPage