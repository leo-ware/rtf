import Image, { StaticImageData } from "next/image"
import Link from "next/link"


import BillDemayoDonateImg from "./bill-demayo-donate.png"
import ConservationFundImg from "./conservation-fund.jpg"
import CorporateGivingImg from "./corporate-giving.jpg"
import HayFundImg from "./hay-fund.jpg"
import MemoriamGiftsImg from "./memoriam-gifts.jpg"
import RedfordGivingImg from "./redford-giving.png"
import SanctuaryFundImg from "./sanctuary-fund.jpg"
import SpiritFundImg from "./spirit-fund.png"
import SponsorABurroImg from "./sponsor-a-burro.jpg"
import SponsorAHerdImg from "./sponsor-a-herd.jpg"
import SponsorAHorseImg from "./sponsor-a-horse.jpg"
import VetFundImg from "./vet-fund.png"
import WishlistImg from "./wishlist.jpg"

const CardWidget = ({ title, image, link }: { title: string, image: StaticImageData, link?: string }) => {
    return (
        <div className="
        w-full max-w-[360px] mx-auto h-[400px]
        relative flex flex-col items-center justify-center gap-4
        bg-[#F7F6F4]
        rounded-xl overflow-hidden">
            <div className="relative h-3/4 w-full">
                <Image src={image} alt={title} className="w-full h-full object-cover object-center" />
            </div>
            <div className="h-1/4 w-full p-4 flex items-center justify-center">
                <div className="text-2xl font-serif text-charcoal">
                    {link ? (
                        <Link href={link}>
                            {title}
                        </Link>
                    ) : title}
                </div>
            </div>
        </div>
    )
}

const cardData = [
    {
        title: "Sponsor a Horse",
        image: SponsorAHorseImg,
    },
    {
        title: "Sponsor a Burro",
        image: SponsorABurroImg,
    },
    {
        title: "Sponsor a Herd",
        image: SponsorAHerdImg,
    },
    {
        title: "Sanctuary Fund",
        image: SanctuaryFundImg,
    },
    {
        title: "Wild Horse Defense Fund",
        image: ConservationFundImg,
    },
    {
        title: "Spirit's Legacy Fund",
        image: SpiritFundImg,
    },
    {
        title: "Sponsor a Bale of Hay",
        image: HayFundImg,
    },
    {
        title: "Veterinary Fund In honor of Stella Demayo",
        image: VetFundImg,
        link: "/donate/veterinary-fund",
    },
    {
        title: "In Honor and Memory Gifts",
        image: MemoriamGiftsImg,
    },
    {
        title: "Planned Giving in Honor of Bill Demayo",
        image: BillDemayoDonateImg,
        link: "/donate/planned-giving",
    },
    {
        title: "Matching Gifts and Corporate Giving",
        image: CorporateGivingImg,
        link: "/donate/corporate-giving",
    },
    {
        title: "Capital Campaign In Honor of Robert Redford",
        image: RedfordGivingImg,
        link: "/donate/capital-campaign",
    },
    {
        title: "Wishlist",
        image: WishlistImg,
        link: "/donate/wishlist",
    },
    {
        title: "Shop",
        image: WishlistImg,
        link: "https://shop.returntofreedom.org",
    },
    {
        title: "Other Ways to Give",
        image: WishlistImg,
        link: "/donate/other-ways-to-give",
    },
] as const

export const DonatePanel = ({ title, link = true }: { title: typeof cardData[number]["title"], link?: boolean | string }) => {
    const card = cardData.find((card) => card.title === title)

    if (!card) {
        return null
    }

    const linkToUse = (
        typeof link === "string" ? link : (
            link && "link" in card ? card.link : undefined
        )
    )

    return (
        <CardWidget
            key={card.title}
            title={card.title}
            image={card.image}
            link={linkToUse} />
    )
}
