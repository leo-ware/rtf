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
import GenericDonateDialogue from "./GenericDonateDialogue"
import SponsorAHerdDialog from "./sponsor-a-herd-dialog"

const CardWidget = ({ title, image, link, external = false }: { title: string, image: StaticImageData, link?: string, external?: boolean }) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className={`
                z-0
                w-full aspect-square
                relative flex flex-col items-center justify-center gap-4
                bg-[#F7F6F4]
                rounded-xl overflow-hidden
            `}>
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
    "CapitalCampaign": () => (
        <CardWidget
            title="Capital Campaign In Honor of Robert Redford"
            image={RedfordGivingImg}
            link="/donate/capital-campaign" />
    ),
    "PlannedGiving": () => (
        <CardWidget
            title="Planned Giving in Honor of Bill Demayo"
            image={BillDemayoDonateImg}
            link="/donate/planned-giving" />
    ),
    "MatchingGiftsAndCorporateGiving": () => (
        <CardWidget
            title="Matching Gifts and Corporate Giving"
            image={CorporateGivingImg}
            link="/donate/corporate-giving" />
    ),
    "SanctuaryFund": () => (
        <GenericDonateDialogue>
            <CardWidget title="Sanctuary Fund" image={SanctuaryFundImg} />
        </GenericDonateDialogue>
    ),
    "WildHorseDefenseFund": () => (
        <GenericDonateDialogue>
            <CardWidget title="Wild Horse Defense Fund" image={ConservationFundImg} />
        </GenericDonateDialogue>
    ),
    "SpiritLegacyFund": () => (
        <GenericDonateDialogue>
            <CardWidget title="Spirit's Legacy Fund" image={SpiritFundImg} />
        </GenericDonateDialogue>
    ),
    "SponsorABaleOfHay": () => (
        <GenericDonateDialogue>
            <CardWidget title="Sponsor a Bale of Hay" image={HayFundImg} />
        </GenericDonateDialogue>
    ),
    "VeterinaryFundInHonorOfStellaDemayo": () => (
        <CardWidget title="Veterinary Fund In honor of Stella Demayo" image={VetFundImg} />
    ),
    "InHonorAndMemoryGifts": () => (
        <GenericDonateDialogue>
            <CardWidget title="In Honor and Memory Gifts" image={MemoriamGiftsImg} />
        </GenericDonateDialogue>
    ),
    "Wishlist": () => (
        <CardWidget title="Wishlist" image={WishlistImg} link="/donate/wishlist" />
    ),
    "Shop": () => (
        <CardWidget title="Shop" image={WishlistImg} link="https://shop.returntofreedom.org" external={true} />
    ),
    "OtherWaysToGive": () => (
        <CardWidget title="Other Ways to Give" image={WishlistImg} link="/donate/other-ways-to-give" />
    ),
} as const