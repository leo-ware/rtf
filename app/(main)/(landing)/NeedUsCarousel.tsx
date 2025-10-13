"use client"

import Button from "@/components/Button"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"

import Munchers from "./need-us-images/munchers.png"
import OnTheMove from "./need-us-images/on-the-move.png"
import SexyBoy from "./need-us-images/sexy-boy.png"
import SkyDarkens from "./need-us-images/sky-darkens.png"
import ThunderingHerd from "./need-us-images/thundering-herd.png"

type CarouselItemWidgetProps = {
    title: string
    description: string
    link: string
    reversed: boolean
    image: StaticImageData
}

const CarouselItemWidget = ({title, description, link, reversed, image}: CarouselItemWidgetProps) => {
    return (
        <div className="w-full h-[330px] flex" style={{direction: reversed ? "rtl" : "ltr"}}>
            <div className="w-1/2 p-6 flex flex-col items-start justify-center gap-4">
                <div className={"text-3xl " + (reversed ? " text-cinnamon" : " text-pewter")}>
                    {title}
                </div>
                <div className="text-sm text-ink">
                    {description}
                </div>
                <Link href={link}>
                    <Button color="sage-green" className="py-1 px-4">
                        Learn More
                    </Button>
                </Link>
            </div>
            <div className="w-1/2 h-full">
                <Image src={image} alt={title} className="w-full h-full object-cover object-center" />
            </div>
        </div>
    )
}

const items = [
    {
        title: "America's Wild Horses Are in Crisis",
        description: `
            Once numbering in the millions, fewer than 80,000 wild horses remain on our public lands today. 
            They share these lands with millions of privately owned cattle and sheep — yet wild horses 
            receive only a small fraction of available forage and water.
        `,
        link: "/",
        image: SkyDarkens
    },
    {
        title: "The BLM's Management System Is Broken",
        description: `
            The Bureau of Land Management (BLM) sets low population targets, called Appropriate Management 
            Levels (AMLs), to prioritize livestock grazing. When herds exceed those numbers, helicopters chase 
            horses into traps in violent roundups. Over 60,000 wild horses are now confined in government 
            holding pens — more than live wild and free.
        `,
        link: "/",
        image: ThunderingHerd
    },
    {
        title: "Captivity Isn't the Answer",
        description: `
            Roundups destroy family bands and cost taxpayers hundreds of millions. Many captured horses lose 
            their federal protection under outdated laws, leaving them vulnerable to slaughter. This broken 
            system removes horses from the wild without addressing the real causes of imbalance on our public lands.
        `,
        link: "/",
        image: SexyBoy
    },
    {
        title: "There's a Humane, Science-Based Solution",
        description: `
            Return to Freedom is one of the pioneers of PZP fertility control, a proven, safe, and reversible 
            vaccine that stabilizes herds on the range—without roundups. With the right investment, this 
            approach can save wild horses, save money, and restore balance to our public lands.
        `,
        link: "/",
        image: Munchers
    },
    {
        title: "Return to Freedom Leads the Way",
        description: `
            For more than 25 years, we've combined sanctuary care, field science, and advocacy to protect wild 
            horses and burros. Our team works in Washington and on the range—pushing for humane management, 
            stronger laws, and a permanent end to slaughter.
        `,
        link: "/",
        image: OnTheMove
    },
]

const NeedUsCarousel = () => {
    return (
        <div className="w-full h-fit">
            <Carousel
                items={items.map((item, i) => ({
                    id: `carousel-item-${i}`,
                    widget: <CarouselItemWidget {...item} reversed={i % 2 !== 0} />,
                }))}
                nDisplayItems={1}
                autoPlay={"right"}
                leftButton={<FaCaretLeft size={30} className="text-cinnamon" />}
                rightButton={<FaCaretRight size={30} className="text-cinnamon" />}
                transitionDuration={1500}
                autoPlayInterval={15000}
            />
        </div>
    )
}

export default NeedUsCarousel