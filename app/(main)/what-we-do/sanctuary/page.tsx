"use client"

import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import WideImage from "@/components/public-ui/WideImage"
import TitledText from "@/components/TitledText"
import Header from "@/components/public-ui/Header"
import DonationCallout, { DonationCalloutGrid } from "@/components/DonationCallout"
import LargeCarouselItem from "@/components/public-ui/LargeCarouselItem"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import VideoCarousel from "@/components/VideoCarousel"
import ScrollReveal from "@/components/public-ui/ScrollReveal"

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
import NewsCarousel from "@/components/NewsCarousel"
import UpcomingEventsWidget from "@/components/UpcomingEventsWidget"

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

            <ScrollReveal variant="fade-up">
                <Callout>
                    Across 2,300 acres of California's Central Coast, Return to Freedom
                    provides lifelong refuge for more than 460 wild horses and burros
                    displaced by roundups and neglect. Our sanctuaries allow them to live
                    in natural social herds while modeling humane, sustainable management
                    practices for public lands.
                </Callout>
            </ScrollReveal>

            <ScrollReveal variant="fade-in">
                <WideImage image={SantuaryPasture} alt="Horses in pasture" />
            </ScrollReveal>

            <ScrollReveal variant="slide-right">
                <TitledText title="Lompoc Sanctuary" color="cinnamon">
                    At RTF's 300-acre headquarters sanctuary in Lompoc, wild horses and burros
                    live in natural family bands along California's Central Coast. This site
                    serves as both a working sanctuary and the heart of RTF's public engagement—home
                    to guided tours, family programs, and volunteer days that invite visitors to
                    experience the beauty and intelligence of wild herds up close. It also houses
                    ambassador horses like Spirit, the real-life inspiration for DreamWorks' Spirit:
                    Stallion of the Cimarron, as well as several rare heritage herds, including the
                    Choctaw and Mission horses. Beyond being a refuge, the Lompoc sanctuary anchors
                    RTF's broader mission—serving as the operational and educational hub for its
                    national rescue and advocacy work.
                </TitledText>
            </ScrollReveal>

            <ScrollReveal variant="fade-in">
                <WideImage image={SantuaryField} alt="Horses in field" />
            </ScrollReveal>

            <ScrollReveal variant="slide-left">
                <TitledText title="San Luis Obispo Sanctuary" color="pewter">
                    Spanning 2,000 acres of rolling coastal rangeland, RTF's San Luis Obispo sanctuary
                    is home to the majority of the organization's rescued wild horses and burros.
                    Managed through regenerative grazing and holistic land practices, this site demonstrates
                    how wild equines can help heal the land—restoring native grasses, improving soil health,
                    and maintaining ecological balance. Family bands roam freely across expansive pastures,
                    living as close to wild as possible while remaining safe from roundups and slaughter.
                    The San Luis Obispo sanctuary reflects RTF's vision for the future of sanctuary care:
                    sustainable, large-scale, and rooted in harmony between wild herds and the ecosystems
                    that sustain them.
                </TitledText>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" className="w-full">
                <Header color="cinnamon" className="mb-8 underline">
                    Costs of Running Our Sanctuaries
                </Header>
                <DonationCalloutGrid className="w-[95vw] mx-auto">
                    <DonationCallout
                        gridAligned
                        image={Blurred1}
                        heading={<><div className="text-[36px] md:text-[48px] font-serif leading-none">$550,000</div><div className="text-[22px] md:text-[28px] font-serif">on hay for the horses</div></>}
                        description="This includes the hay and feed required to care for over 460 rescued wild horses and burros at our Lompoc headquarters and San Luis Obispo satellite sanctuary. Many of these animals once faced roundups, neglect, or the threat of slaughter. At Return to Freedom, they now live safely in natural family bands, grazing freely on open pastures."
                        donatePathway="Sanctuary Fund"
                        buttonText="Donate"
                        align="left"
                        className="min-h-[450px] md:min-h-[550px]"
                        analyticsName="sanctuary_hay_cost"
                    />
                    <DonationCallout
                        gridAligned
                        image={Blurred2}
                        heading={<><div className="text-[36px] md:text-[48px] font-serif leading-none">$1,150,000</div><div className="text-[22px] md:text-[28px] font-serif">on daily care, staffing, land and infrastructure maintenance</div></>}
                        description="Caring for over 460 wild horses and burros takes an extraordinary effort. This amount covers the hands-on work of our staff, land management across Lompoc and San Luis Obispo, and the ongoing upkeep of barns, fences, and water systems that keep the herds safe."
                        donatePathway="Sanctuary Fund"
                        buttonText="Donate"
                        align="left"
                        className="min-h-[450px] md:min-h-[550px]"
                        analyticsName="sanctuary_care_cost"
                    />
                </DonationCalloutGrid>
            </ScrollReveal>

            <ScrollReveal variant="fade-in" className="w-full px-8">
                <Header color="pewter" className="mb-8 underline">
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
            </ScrollReveal>

            <div className="w-full flex flex-col items-center justify-center gap-12 mt-4">
                <ScrollReveal variant="fade-up">
                    <TitledText title="Growing Need For a New Sanctuary" color="sage-green">
                        Return to Freedom's sanctuaries have reached their capacity. Each year, more wild
                        horses and burros are displaced by government roundups or crisis situations than
                        we can safely house. While our goal has always been to keep wild horses on the range,
                        the growing number of animals needing immediate refuge underscores an urgent reality:
                        we need more land, more resources, and a stronger foundation to sustain our mission.
                    </TitledText>
                </ScrollReveal>

                <ScrollReveal variant="fade-up">
                    <DonationCalloutGrid className="w-[95vw] mx-auto">
                        <DonationCallout
                            gridAligned
                            image={Blurred3}
                            heading="Capital Campaign"
                            description="Through the Wild Horse and Wildlife Conservancy Campaign, we're working to acquire new land and create long-term stability for Return to Freedom's programs. The campaign will permanently secure our founding Lompoc ranch, establish a dedicated endowment to support operations, and acquire a larger sanctuary to expand habitat, integrate regenerative grazing, and provide space for displaced herds."
                            link="/donate/capital-campaign"
                            buttonText="Learn More About the Capital Campaign"
                            align="left"
                            className="min-h-[400px] md:min-h-[500px]"
                            analyticsName="capital_campaign"
                        />
                        <DonationCallout
                            gridAligned
                            image={Blurred4}
                            heading="Planned Giving"
                            description="Planned giving ensures that the work of today endures tomorrow. Through bequests, trusts, or endowment gifts, supporters can help Return to Freedom acquire new land, improve sanctuary infrastructure, and sustain long-term care for rescued herds. These legacy commitments are investments in permanence—preserving open land, freedom, and the bond between horses and the wild places they call home."
                            link="/donate/planned-giving"
                            buttonText="Learn More About Planned Giving"
                            align="left"
                            className="min-h-[400px] md:min-h-[500px]"
                            analyticsName="planned_giving"
                        />
                    </DonationCalloutGrid>
                </ScrollReveal>
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

            <ScrollReveal variant="fade-up" className="w-full">
                <NewsCarousel bgColor="transparent" title="Sanctuary News" topic="sanctuary" />
            </ScrollReveal>

            <ScrollReveal variant="fade-in" className="w-full bg-seashell py-12">
                <Header level={1} color="pewter" className="underline">
                    Visit Us
                </Header>
                <div className="w-11/12 md:w-8/12 mx-auto">
                    <UpcomingEventsWidget />
                </div>
            </ScrollReveal>
        </div>
    )
}

export default SanctuaryPage