"use client"

import Image from "next/image"
import Carousel from "@/components/Carousel"
import { useIsMobile } from "@/hooks/use-mobile"

import GSLogo from "@/public/img/sponsor-image-giant-steps.png"
import HPLogo from "@/public/img/sponsor-image-horse-play.png"
import MCLogo from "@/public/img/sponsor-image-montecito.png"
import PRLogo from "@/public/img/sponsor-image-puremedy.png"
import SBLogo from "@/public/img/sponsor-image-santa-barbara-foundation.png"
import FRLogo from "./sponsor-first-republic.png"
import BGLogo from "./sponsor-biogel.png"
import ASLogo from "./sponsor-aspca.png"

const logos = [GSLogo, HPLogo, MCLogo, PRLogo, SBLogo, FRLogo, BGLogo, ASLogo]

const CorporateCarousel = () => {

    const isMobile = useIsMobile()

    const items = logos.map(logo => ({
        id: logo.src,
        widget: <Image src={logo} className="w-[200px] h-auto" alt="Sponsor Logo" />
    }))

    return (
        <div className="w-full h-fit py-8 flex flex-col items-center justify-center gap-2 md:gap-4">

            <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="text-burnt-orange text-3xl font-bold text-center">
                    Corporate Sponsors
                </div>
                <div className="w-11/12 md:w-1/2 text-ink text-sm text-center">
                    A very special thank you goes out to our generous sponsors — corporations
                    that make it possible to do more of the costly work required of a national
                    advocacy organization like Return to Freedom.
                    <br />
                    If you or your company wishes to sponsor our work, please email us.
                </div>
            </div>

            <div className="w-11/12 h-[150px] md:h-[250px]">
                <Carousel
                    items={items}
                    nDisplayItems={isMobile ? 3 : 5}
                    autoPlay={"right"}
                    controls={false}
                    transitionDuration={800}
                    autoPlayInterval={3000}
                />
            </div>

        </div>
    )
}

export default CorporateCarousel