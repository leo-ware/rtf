import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { StaticImageData } from "next/image"
import Link from "next/link"

import SponsorABurroImg from "./imgs/sponsor-a-burro.jpg"
import SponsorAHerdImg from "./imgs/sponsor-a-herd.jpg"
import SponsorAHorseImg from "./imgs/sponsor-a-horse.jpg"
import SponsorAHerdDialog from "./SponsorAHerdDialog"

const CardWidget = ({ title, image, link, external = false, onClick }: { title: string, image: StaticImageData, link?: string, external?: boolean, onClick?: () => void }) => {
    return (
        <div className="w-full h-full flex items-center justify-center" onClick={onClick}>
            <div className={`
                z-0
                w-full aspect-square
                relative flex flex-col items-center justify-center gap-4
                bg-[#F7F6F4]
                rounded-xl overflow-hidden
            `}>
                <div className="relative h-3/4 w-full">
                    <ImageWithAuthorCredit src={image} alt={title} className="w-full h-full object-cover object-center" />
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
        </div>
    )
}

export const DonationWidgets = {
    "SponsorAHorse": () => (
        <CardWidget
            title="Sponsor a Horse"
            image={SponsorAHorseImg}
            link="/donate/sponsor-a-horse" />
    ),
    "SponsorABurro": () => (
        <CardWidget
            title="Sponsor a Burro"
            image={SponsorABurroImg}
            link="/donate/sponsor-a-burro" />
    ),
    "SponsorAHerd": () => (
        <SponsorAHerdDialog>
            <CardWidget title="Sponsor a Herd" image={SponsorAHerdImg} />
        </SponsorAHerdDialog>
    ),
} as const
