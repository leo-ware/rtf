"use client"

import Button from "@/components/public-ui/Button"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { StaticImageData } from "next/image"
import Link from "next/link"
import ScrollReveal from "@/components/public-ui/ScrollReveal"

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
        <div
            className={`
                w-full
                lg:h-[550px]
                flex flex-col-reverse lg:items-center gap-2 lg:gap-0
                ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"}
            `}>
            <ScrollReveal
                variant="fade-up"
                disableBelow="lg"
                className="w-full flex flex-col gap-2 lg:gap-4 items-start justify-start text-left lg:w-1/2 lg:p-6"
            >
                <div className={"text-[28px] lg:text-[36px] text-cinnamon " + (reversed ? " lg:text-cinnamon" : " lg:text-pewter")}>
                    {title}
                </div>
                <div className="text-[16px] lg:text-[20px] text-ink">
                    {description}
                </div>
                <Link href={link} className="mt-2 lg:mt-4">
                    <Button color="sage-green" className="py-1 px-4 text-[16px]">
                        Learn More
                    </Button>
                </Link>
            </ScrollReveal>
            <ScrollReveal
                variant={reversed ? "slide-left" : "slide-right"}
                disableBelow="lg"
                className="w-full lg:w-1/2 h-[250px] md:h-[350px] lg:h-fit lg:max-h-full shrink-0 overflow-hidden lg:my-auto"
            >
                <ImageWithAuthorCredit src={image} alt={title} className="w-full h-full object-cover object-center" />
            </ScrollReveal>
        </div>
    )
}

const items = [
    {
        title: "America's Wild Horses Are in Crisis",
        description: `
            Once numbering in the millions, fewer than 80,000 wild horses remain on our public lands today.
            They share these lands with millions of privately owned cattle and sheep — yet wild horses
            receive only a small fraction of available forage and water. Forage and water allocated to
            privately owned livestock exceeds that for wild horses 50 to 1.
        `,
        link: "/",
        image: SkyDarkens
    },
    {
        title: "The BLM's \"Management\" System Is Broken",
        description: `
            The Bureau of Land Management (BLM) sets low population targets, called Appropriate Management
            Levels (AMLs), to prioritize livestock grazing. When herds exceed those numbers, livestock
            ranchers who hold grazing permits get angry. The horses continue to reproduce and eventually the
            BLM hires contractors who chase horses for miles over rough terrain with low flying helicopters
            into traps. This antiquated management is costly, violent, unsustainable and unnecessary. Over
            65,000 wild horses are now confined in government holding pens.
        `,
        link: "/what-we-do/advocacy/roundups",
        image: ThunderingHerd
    },
    {
        title: "Captivity Isn't the Answer",
        description: `
            Roundups and overcrowded government corrals destroy family bands and cost taxpayers hundreds of
            millions a year, year after year. It is not a sustainable solution. The greater the expense the
            more vulnerable the horses are. Once captured, wild horses lose their federal protection under
            outdated laws, leaving them vulnerable to slaughter. This cycle of capture, confinement, and
            killing doesn't manage—it destroys. While they wait in overcrowded pens, the cycle
            continues…every foal born on the range faces an uncertain fate.
        `,
        link: "/what-we-do/advocacy/herd-management",
        image: SexyBoy
    },
    {
        title: "Since 1999, Return to Freedom Has Pioneered Humane, Science-Based Solutions",
        description: `
            Modeled at the sanctuary which can be applied on the range. PZP fertility control, a proven,
            safe, and reversible vaccine that can stabilize herd growth on the range by simply slowing down
            reproduction—without roundups. By redirecting funds used for roundups and overcrowded holding
            pens, this approach can save wild horses, save money, and restore balance to our public lands.
        `,
        link: "/what-we-do/advocacy/population-management",
        image: Munchers
    },
    {
        title: "A Proud Vision for Our Public Lands and the American Mustang",
        description: `
            Holistic land management can change the current paradigm allowing areas to rest and regenerate.
            Waterholes and springs can recover, and the ecosystem thrives for all wildlife.
        `,
        link: "/what-we-do/conservation",
        image: OnTheMove
    },
    {
        title: "Return to Freedom Is Leading the Way",
        description: `
            For more than 25 years, we've combined sanctuary care, field science, and advocacy to protect
            wild horses and burros. Our team works in Washington and on the range—pushing for humane
            management, stronger laws, and a permanent end to horse slaughter.
        `,
        link: "/what-we-do/advocacy",
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