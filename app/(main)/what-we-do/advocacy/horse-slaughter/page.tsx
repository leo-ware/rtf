import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import Carousel from "@/components/Carousel"
import Image from "next/image"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import NewsCarousel from "@/components/NewsCarousel"
import ScrollReveal from "@/components/public-ui/ScrollReveal"

import HeroImage from "./hero.png"
import RoundupsImage1 from "../imgs/randomhorse.png"
import List from "@/components/public-ui/List"
import WHDCallout from "@/components/WHDCallout"
import TakeActionSection from "@/components/TakeActionSection"

const HorseSlaughterPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 mb-16">
            <Hero title="Horse Slaughter" image={HeroImage} />
            <ScrollReveal variant="fade-up">
                <Callout className="text-cinnamon">
                    Though horse slaughter is banned in the U.S., thousands of horses are still exported
                    across our borders for slaughter each year. Return to Freedom advocates for a lasting
                    solution through the SAFE Act and stronger enforcement of existing protections.
                </Callout>
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
                                title: "About Horse Slaughter",
                                description: `
                                    Horse slaughter refers to the killing and processing of horses for human 
                                    consumption or byproducts such as leather and cosmetics. While no horse 
                                    slaughter plants currently operate in the United States, tens of thousands 
                                    of American horses—wild and domestic—are exported each year to Mexico and 
                                    Canada, where they are slaughtered and sold abroad. This pipeline persists 
                                    because no federal law permanently prohibits horse slaughter or export for 
                                    slaughter, allowing kill buyers to purchase horses at low-cost auctions and 
                                    ship them across borders.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "How Horses Enter the Slaughter Pipeline",
                                description: `
                                    Every week, kill buyers attend livestock auctions across the country, buying 
                                    horses no longer wanted by their owners, breeders, or industries that exploit 
                                    them for racing, showing, or labor. Some of these horses are rounded-up wild 
                                    horses that lost federal protection after being “adopted” from Bureau of Land 
                                    Management (BLM) holding facilities. Loopholes in the Adoption Incentive 
                                    Program have allowed individuals to profit by selling these horses at auctions 
                                    once incentives are collected. Once purchased, horses are transported in crowded 
                                    trailers—often without food or water—for journeys of 24 hours or more to slaughter 
                                    facilities in Mexico or Canada. Mortality rates during transport are rarely 
                                    disclosed or monitored.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "Scale and Consequences",
                                description: (
                                    <div>
                                        Each year, between 20,000 and 40,000 U.S. horses are exported for slaughter. The
                                        trade is fueled by overseas demand for horse meat, particularly in parts of Europe
                                        and Asia. This practice raises multiple concerns:
                                        <List>{[
                                            "Animal welfare: Horses endure immense stress, injury, and fear during transport and slaughter.",
                                            "Public safety: Many horses have been treated with veterinary drugs and dewormers that render their meat unsafe for human consumption.",
                                            "Economic waste: Taxpayer-funded programs to manage and protect wild horses lose meaning if animals ultimately end up in the slaughter pipeline."
                                        ]}</List>
                                    </div>
                                ),
                                image: RoundupsImage1
                            },
                            {
                                title: "Legislative and Policy Context",
                                description: `
                                    Domestic horse slaughter effectively ended in 2007 when Congress defunded U.S. Department of Agriculture inspections required for meat export certification. However, this ban must be renewed annually through appropriations language—leaving the door open for potential reopening. The Save America’s Forgotten Equines (SAFE) Act seeks to close that loophole permanently by outlawing horse slaughter in the U.S. and prohibiting export of horses for slaughter. Despite bipartisan public support, the bill has repeatedly stalled in committee, underscoring the need for sustained advocacy and public pressure.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "Return to Freedom's Leadership",
                                description: `
                                    Return to Freedom has long championed a permanent federal ban on horse slaughter. RTF helped build national coalitions of equine welfare and conservation groups advocating for passage of the SAFE Act, while educating policymakers on the connection between wild horse roundups and the slaughter pipeline. Our advocacy emphasizes humane alternatives, better adoption oversight, and investment in sanctuary and fertility control—ensuring horses never re-enter the cycle of exploitation.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "A Future Without Slaughter",
                                description: `
                                    Ending horse slaughter is about more than stopping one industry—it’s about redefining our nation’s relationship with horses. Permanent federal protection will prevent thousands from suffering and align public policy with America’s longstanding respect for the horse as a companion, worker, and symbol of freedom. Support the movement by contributing to RTF’s Wild Horse Defense Fund, contacting legislators, and sharing accurate information about this ongoing issue.
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
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <TakeActionSection />
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <NewsCarousel
                    title="Latest News on Horse Slaughter"
                    bgColor="seashell"
                    topic="horse_slaughter" />
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <WHDCallout />
            </ScrollReveal>
        </div>
    )
}

export default HorseSlaughterPage