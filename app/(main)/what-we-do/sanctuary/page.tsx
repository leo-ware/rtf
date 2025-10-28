"use client"

import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import WideImage from "@/components/public-ui/WideImage"
import TitledText from "@/components/TitledText"
import Header from "@/components/public-ui/Header"
import BlurredImageCard from "@/components/public-ui/BlurredImageCard"
import LargeCarouselItem from "@/components/public-ui/LargeCarouselItem"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import VideoCarousel from "@/components/VideoCarousel"

import SanctuaryHero from "./santuary-hero.jpg"
import SantuaryPasture from "./santuary-pasture.jpg"
import SantuaryField from "./santurary-field.jpg"

import Blurred1 from "./blurred-1.jpg"
import Blurred2 from "./blurred-2.jpg"
import Blurred3 from "./blurred-3.jpg"
import Blurred4 from "./blurred-4.jpg"

import Rescue1Img from "./rescue-1.jpg"
import Rescue2Img from "./rescue-2.png"
import Rescue3Img from "./rescue-3.png"
import Rescue4Img from "./rescue-4.png"
import Rescue5Img from "./rescue-5.jpg"
import Button from "@/components/public-ui/Button"
import NewsCarousel from "@/components/NewsCarousel"

const rescues = [
    {
        image: Rescue1Img,
        title: "The Beginning: The Hart Mountain Rescue (1998-1999)",
        description: `
            Return to Freedom's work began with the 1998 removal of wild horses from Oregon's Hart Mountain
            National Antelope Refuge. More than 270 horses were captured and dispersed through government
            auctions, breaking apart entire family bands. RTF stepped in to provide sanctuary for a group
            of these displaced horses—reuniting natural herds and giving them a permanent home. This
            rescue became the cornerstone of RTF's mission: to protect the freedom, diversity, and social
            bonds of America's wild horses through humane, sustainable alternatives to capture and confinement.
        `
    },
    {
        image: Rescue2Img,
        title: "Santa Barbara County Seizure (2003)",
        description: `
            In one of the largest equine rescues in California's history, RTF partnered with county officials 
            to care for over 425 neglected and starving horses seized from a local ranch. Within days, RTF 
            mobilized emergency crews, coordinated medical care, and provided refuge for many of the animals. 
            This response helped establish RTF as a trusted national voice in large-scale rescue and 
            rehabilitation.
        `
    },
    {
        image: Rescue3Img,
        title: "South Dakota Mustang Rescue (2017)",
        description: `
            RTF joined forces with other sanctuaries to save over 900 wild horses from a failing facility in 
            South Dakota. Many of the horses were in deteriorating condition and at risk of slaughter. Through 
            coordinated fundraising, transport, and rehoming efforts, RTF provided sanctuary for a significant 
            group and found safe placement for hundreds more.
        `
    },
    {
        image: Rescue4Img,
        title: "Alpine Wild Horse Rescue (2023-2024)",
        description: `
            When dozens of Alpine wild horses were rounded up in Arizona and shipped to Texas auction yards 
            where kill buyers waited, RTF and partners intervened. Over 46 horses, including pregnant mares, 
            were rescued and brought to safety. Their numbers have since grown to over 55 with new births—each 
            one a life saved from slaughter.
        `
    },
    {
        image: Rescue5Img,
        title: "Texas Burro Rescue (2023)",
        description: `
            RTF saved the “Texas Ten,” a group of burros bound for slaughter, along with others in similar peril. 
            These rescues expanded RTF's care to 42 burros now living safely on sanctuaries and partner 
            lands—highlighting the organization's commitment to both wild horses and burros across the West.
        `
    },
]

const SanctuaryPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <Hero title="Sanctuary" image={SanctuaryHero} />

            <Callout>
                Across 2,300 acres of California's Central Coast, Return to Freedom
                provides lifelong refuge for more than 460 wild horses and burros
                displaced by roundups and neglect. Our sanctuaries allow them to live
                in natural social herds while modeling humane, sustainable management
                practices for public lands.
            </Callout>

            <WideImage image={SantuaryPasture} alt="Horses in pasture" />

            <TitledText title="Lompoc Sanctuary" color="cinnamon">
                At RTF's 300-acre headquarters sanctuary in Lompoc, wild horses and burros
                live in natural family bands along California’s Central Coast. This site
                serves as both a working sanctuary and the heart of RTF’s public engagement—home
                to guided tours, family programs, and volunteer days that invite visitors to
                experience the beauty and intelligence of wild herds up close. It also houses
                ambassador horses like Spirit, the real-life inspiration for DreamWorks’ Spirit:
                Stallion of the Cimarron, as well as several rare heritage herds, including the
                Choctaw and Mission horses. Beyond being a refuge, the Lompoc sanctuary anchors
                RTF’s broader mission—serving as the operational and educational hub for its
                national rescue and advocacy work.
            </TitledText>

            <WideImage image={SantuaryField} alt="Horses in field" />

            <TitledText title="San Luis Obispo Sanctuary" color="pewter">
                Spanning 2,000 acres of rolling coastal rangeland, RTF's San Luis Obispo sanctuary
                is home to the majority of the organization’s rescued wild horses and burros.
                Managed through regenerative grazing and holistic land practices, this site demonstrates
                how wild equines can help heal the land—restoring native grasses, improving soil health,
                and maintaining ecological balance. Family bands roam freely across expansive pastures,
                living as close to wild as possible while remaining safe from roundups and slaughter.
                The San Luis Obispo sanctuary reflects RTF’s vision for the future of sanctuary care:
                sustainable, large-scale, and rooted in harmony between wild herds and the ecosystems
                that sustain them.
            </TitledText>

            <div className="w-full">
                <Header color="cinnamon" className="mb-8">
                    Costs of Running Our Sanctuaries
                </Header>
                <div className="w-8/10 mx-auto h-[600px] flex items-stretch gap-4">
                    <BlurredImageCard image={Blurred1} className="h-full">
                        <div className="text-white w-full h-full px-12 py-16 flex flex-col items-start justify-center gap-4">
                            <div className="flex flex-col items-start justify-center gap-2">
                                <div className="text-[36px] font-serif">$550,000</div>
                                <div className="text-[32px] font-serif">on hay for the horses</div>
                            </div>
                            <div className="text-[20px]">
                                This includes the hay and feed required to care for over 460 rescued wild horses
                                and burros at our Lompoc headquarters and San Luis Obispo satellite sanctuary.
                                Many of these animals once faced roundups, neglect, or the threat of slaughter.
                                At Return to Freedom, they now live safely in natural family bands, grazing
                                freely on open pastures.
                            </div>
                        </div>
                    </BlurredImageCard>
                    <BlurredImageCard image={Blurred2} className="h-full">
                        <div className="text-white w-full h-full px-12 py-16 flex flex-col items-start justify-center gap-4">
                            <div className="flex flex-col items-start justify-center gap-2">
                                <div className="text-[36px] font-serif">$1,150,000</div>
                                <div className="text-[32px] font-serif">
                                    on daily care, staffing, land and infrastructure maintenance
                                </div>
                            </div>
                            <div className="text-[20px]">
                                Caring for over 460 wild horses and burros takes an extraordinary effort. This amount
                                covers the hands-on work of our staff, land management across Lompoc and San Luis
                                Obispo, and the ongoing upkeep of barns, fences, and water systems that keep the herds
                                safe.
                            </div>
                        </div>
                    </BlurredImageCard>
                </div>
            </div>

            <div className="w-full px-8">
                <Header color="pewter" className="mb-8">
                    Our Rescues
                </Header>
                <Carousel
                    items={rescues.map((r, i) => ({
                        id: `rescue-${i}`,
                        widget: <LargeCarouselItem {...r} />
                    }))}
                    nDisplayItems={1}
                    controls={true}
                    leftButton={<FaCaretLeft size={30} className="text-cinnamon" />}
                    rightButton={<FaCaretRight size={30} className="text-cinnamon" />}
                    transitionDuration={2000}
                    autoPlay={"right"}
                    autoPlayInterval={10000}
                />
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-12 mt-4">
                <TitledText title="Growing Need For a New Sanctuary" color="sage-green">
                    Return to Freedom's sanctuaries have reached their capacity. Each year, more wild
                    horses and burros are displaced by government roundups or crisis situations than
                    we can safely house. While our goal has always been to keep wild horses on the range,
                    the growing number of animals needing immediate refuge underscores an urgent reality:
                    we need more land, more resources, and a stronger foundation to sustain our mission.
                </TitledText>
                <div className="w-8/10 mx-auto h-[500px] flex items-stretch gap-4">
                    <BlurredImageCard image={Blurred3} className="h-full">
                        <div className="text-white w-full h-full px-12 py-16 flex flex-col items-start justify-center gap-4">
                            <div className="text-[36px] font-serif">Capital Campaign</div>
                            <div className="text-[20px]">
                                Through the Wild Horse and Wildlife Conservancy Campaign, we're working
                                to acquire new land and create long-term stability for Return to Freedom's
                                programs. The campaign will permanently secure our founding Lompoc ranch,
                                establish a dedicated endowment to support operations, and acquire a larger
                                sanctuary to expand habitat, integrate regenerative grazing, and provide
                                space for displaced herds.
                            </div>
                            <Button color="cinnamon">Learn More About the Capital Campaign</Button>
                        </div>
                    </BlurredImageCard>
                    <BlurredImageCard image={Blurred4} className="h-full">
                        <div className="text-white w-full h-full px-12 py-8 flex flex-col items-start justify-center gap-4">
                            <div className="text-[36px] font-serif">Planned Giving</div>
                            <div className="text-[20px]">
                                Planned giving ensures that the work of today endures tomorrow. Through bequests, 
                                trusts, or endowment gifts, supporters can help Return to Freedom acquire new 
                                land, improve sanctuary infrastructure, and sustain long-term care for rescued 
                                herds. These legacy commitments are investments in permanence—preserving open 
                                land, freedom, and the bond between horses and the wild places they call home.
                            </div>
                            <Button color="cinnamon">Learn More About Planned Giving</Button>
                        </div>
                    </BlurredImageCard>
                </div>
            </div>

            {/* <VideoCarousel carouselItems={[
                {
                    videoId: "jwgwTAFzTvs",
                    title: "Animal's Voice: The Story Behind RTF"
                },
                {
                    videoId: "65Be4s6PVDs",
                    title: "Meet the Founder of RTF with Equine VIP"
                },
                {
                    videoId: "OcaDkWlWhFg",
                    title: "Wild Horses Running at RTF"
                },
                {
                    videoId: "wJa-KAphIgg",
                    title: "Bill DeMayo on 'The Professors'"
                },
                {
                    videoId: "WPkhSRVyHSg",
                    title: "The Next Generation"
                },
                {
                    videoId: "H0IRs1kggeU",
                    title: "A Tour of the Lompoc Sanctuary"
                }
            ].map(each => ({...each, isYoutube: true}))}/> */}

            <div className="w-full">
                <NewsCarousel bgColor="transparent" title="Sanctuary News" />
            </div>
        </div>
    )
}

export default SanctuaryPage