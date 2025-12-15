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

import HeroImage from "./hero.png"
import RoundupsImage1 from "../imgs/randomhorse.png"
import TakeActionImage1 from "../imgs/take-action-1.jpg"
import TakeActionImage2 from "../imgs/take-action-2.jpg"
import TakeActionImage3 from "../imgs/take-action-3.jpg"
import BlurredBg from "../imgs/blurred-bg.jpg"
import List from "@/components/public-ui/List"
import GenericDonateDialogue from "@/components/donation-widgets/GenericDonateDialogue"

const HorseSlaughterPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 mb-16">
            <Hero title="Horse Slaughter" image={HeroImage} />
            <Callout className="text-cinnamon">
                Though horse slaughter is banned in the U.S., thousands of horses are still exported
                across our borders for slaughter each year. Return to Freedom advocates for a lasting
                solution through the SAFE Act and stronger enforcement of existing protections.
            </Callout>

            <div className="md:w-10/12 mx-auto">
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
                title="Latest News on Horse Slaughter"
                bgColor="seashell"
                topic="horse_slaughter" />

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

export default HorseSlaughterPage