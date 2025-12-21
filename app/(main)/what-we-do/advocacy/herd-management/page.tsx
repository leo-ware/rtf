import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import Carousel from "@/components/Carousel"
import Image from "next/image"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import NewsCarousel from "@/components/NewsCarousel"
import HeroImage from "./hero.png"
import RoundupsImage1 from "../imgs/randomhorse.png"
import List from "@/components/public-ui/List"
import WHDCallout from "@/components/WHDCallout"
import TakeActionSection from "@/components/TakeActionSection"

const HerdManagementPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 mb-16">
            <Hero title="Herd Management" image={HeroImage} />
            <Callout className="text-cinnamon">
                Designated by the Bureau of Land Management, Herd Management Areas were created to balance
                wild horse populations with other public-land uses. But decades of over-allocation to private
                livestock and development have eroded this balance, threatening the future of wild herds.
                Return to Freedom advocates for fair, science-based management that protects wild horses
                while supporting sustainable public lands.
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
                                title: "Defining Herd Management Areas (HMAs)",
                                description: `
                                    HMAs are regions of public land designated for wild horse and burro management 
                                    under the 1971 Wild Free-Roaming Horses and Burros Act. The Bureau of Land 
                                    Management currently manages 177 HMAs across 10 western states, encompassing 
                                    roughly 27 million acres. These areas were intended to ensure wild equines could 
                                    live as integral parts of the public-lands ecosystem. However, decades of 
                                    political pressure and land-use conflict have drastically reduced their size and number.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "A Shrinking Range",
                                description: `
                                    When the 1971 Act was passed, wild horses roamed more than 53 million acres. Today, 
                                    they occupy less than half that area. Herds have been displaced to make room for 
                                    livestock grazing, mining, oil development, and urban expansion. Some HMAs have been 
                                    “zeroed out,” meaning all horses were removed and the area is no longer managed for 
                                    their use—an erosion of the original legal intent of the 1971 Act.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "The Role of Livestock and AMLs",
                                description: `
                                    Public lands are managed for “multiple use,” but cattle and sheep operations dominate 
                                    resource allocation. In most HMAs, livestock receive up to 80-90% of available forage 
                                    and water, leaving minimal resources for wild horses. The result is a policy imbalance 
                                    where horses are often blamed for land degradation that primarily results from overgrazing 
                                    by domestic animals. Adjusting AMLs to reflect fair ecological distribution is critical 
                                    to restoring balance.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "The Checkerboard Example (Wyoming)",
                                description: `
                                    One of the most visible conflicts is in Wyoming's Checkerboard region—a mosaic of public 
                                    and private lands. Under pressure from private landowners and livestock associations, 
                                    the BLM removed wild horse use from nearly two million acres in 2023. Return to Freedom 
                                    and its partners filed suit, and in 2024 the 10th Circuit Court of Appeals ruled the BLM 
                                    acted unlawfully. The decision reaffirmed that federal agencies must uphold wild horse 
                                    protections on mixed-ownership lands—a critical precedent for herds nationwide.
                                `,
                                image: RoundupsImage1
                            },
                            {
                                title: "RTF's Ongoing Efforts",
                                description: (
                                    <div>
                                        Through litigation, policy reform, and collaboration with agencies and scientists, RTF
                                        works to protect the integrity of all remaining HMAs. Our priorities include:
                                        <List>{[
                                            "Ensuring fair resource allocation between livestock and wild horses.",
                                            "Preserving genetic diversity within isolated herds.",
                                            "Restoring degraded rangelands through regenerative management.",
                                            "Opposing zero-out policies that erase entire wild populations."
                                        ]}</List>
                                    </div>
                                ),
                                image: RoundupsImage1
                            },
                            {
                                title: "Safeguarding the Future",
                                description: `
                                    Protecting Herd Management Areas is central to the survival of America's wild herds. 
                                    Without secure habitat, all other conservation efforts become temporary fixes. You can help 
                                    sustain these landscapes by supporting RTF's legal defense and advocacy initiatives through
                                     the Wild Horse Defense Fund—ensuring that wild horses and burros continue to roam the 
                                     public lands that are their rightful home.
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

            <TakeActionSection />

            <NewsCarousel
                title="Latest News on Herd Management Areas"
                bgColor="seashell"
                topic="herd_management" />

            <WHDCallout />
        </div>
    )
}

export default HerdManagementPage