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
import ScrollReveal from "@/components/public-ui/ScrollReveal"

import PopulationManagementHero from "./hero.jpg"
import RoundupsImage1 from "../imgs/randomhorse.png"
import BlurredBg from "../imgs/blurred-bg.jpg"
import GenericDonateDialogue from "@/components/donation-widgets/GenericDonateDialogue"
import TakeActionSection from "@/components/TakeActionSection"
import WHDCallout from "@/components/WHDCallout"

const PopulationManagementPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 mb-16">
            <Hero title="Population Management" image={PopulationManagementHero} />
            <ScrollReveal variant="fade-up">
                <Callout className="text-cinnamon">
                    Managing wild horse populations is about balance—between freedom and care, between
                    open land and limited resources. Return to Freedom demonstrates that humane,
                    science-based fertility control can replace roundups, reduce costs, and allow wild
                    herds to live naturally on the range.
                </Callout>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" className="w-10/12 md:w-8/12 mx-auto">
                <iframe
                    className="w-full aspect-[16/9]"
                    src="https://www.youtube.com/embed/WOTL-b4wkM8?si=X2OfmqPn8t5xn6Ja"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen />
            </ScrollReveal>

            <ScrollReveal variant="fade-in" className="md:w-10/12 mx-auto">
                <Carousel
                    nDisplayItems={1}
                    autoPlay={false}
                    leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                    rightButton={<FaCaretRight size={30} className="text-pewter" />}
                    items={
                        [
                            {
                                title: "Why Population Management Matters",
                                description: `
                                    Healthy, genetically diverse herds are vital for the long-term survival of wild 
                                    horses and burros. But decades of poor federal land-use planning have created 
                                    conflict between wildlife, livestock, and energy development. The Bureau of Land 
                                    Management (BLM) often uses helicopter roundups as its primary management tool, 
                                    removing horses instead of managing them where they live. This approach is 
                                    expensive, disruptive, and unsustainable—leaving more than 60,000 horses in long-term 
                                    holding and costing taxpayers over $100 million annually.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "Understanding Appropriate Management Levels (AMLs)",
                                description: `
                                    AMLs are population limits that the BLM sets for each Herd Management Area. Many 
                                    AMLs are based on outdated range studies and allocate the majority of forage and 
                                    water to privately owned livestock rather than federally protected wild horses. In 
                                    some areas, AMLs allow fewer than one horse per 1,000 acres—numbers that fail to 
                                    sustain natural herd dynamics or genetic viability. Overly restrictive AMLs drive 
                                    the constant cycle of roundups and removals, rather than encouraging adaptive, 
                                    ecological management.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "A Humane, Science-Based Solution",
                                description: `
                                    Fertility control offers an effective alternative. The Porcine Zona Pellucida (PZP) 
                                    vaccine temporarily prevents pregnancy in mares while allowing natural herd behavior 
                                    to continue. It is non-hormonal, reversible, and field-tested for over three decades. 
                                    When combined with on-range monitoring and habitat restoration, fertility control keeps 
                                    horses in their home territories, reduces the need for removals, and costs far less 
                                    than roundups and holding facilities.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "RTF's Fertility Control Leadership",
                                description: `
                                    Return to Freedom was among the first organizations in the world to implement the PZP 
                                    program in 1999. Since then, RTF has maintained a 98% success rate across treated 
                                    herds at our sanctuaries. In 2024, RTF launched its On-Range Project with the BLM
                                     in Northern California, expanding fertility control directly onto public lands. 
                                     Our field teams identify and track mares, apply treatments via darting, and collect 
                                     data to refine long-term management practices.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "Environmental and Economic Benefits",
                                description: `
                                    Humane population management supports healthier rangelands by maintaining balanced 
                                    grazing and reducing overuse by domestic livestock. It also eliminates the need for 
                                    expensive off-range holding. Implementing fertility control on the range could save 
                                    tens of millions of taxpayer dollars annually while preserving natural ecosystems 
                                    and family band structures that are destroyed by helicopter roundups.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "What Comes Next",
                                description: `
                                    RTF continues to work with federal agencies, researchers, and local stakeholders to expand humane fertility control programs and modernize public-land policy. With proper investment and commitment, the U.S. can transition from crisis management to proactive stewardship—keeping wild horses free, wild, and part of the American landscape for generations to come.
                                `,
                                image: RoundupsImage1
                            }
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
                                        <div className="text-lg text-ink">
                                            {description}
                                        </div>
                                    </div>
                                </div>
                            )
                        }))
                    }
                />
            </ScrollReveal>

            <ScrollReveal variant="fade-up" className="w-full">
                <TakeActionSection />
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <NewsCarousel
                    title="Latest News on Population Management"
                    bgColor="seashell"
                    topic="population_management" />
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <WHDCallout />
            </ScrollReveal>
        </div>
    )
}

export default PopulationManagementPage