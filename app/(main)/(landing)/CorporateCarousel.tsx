"use client"

import Carousel from "@/components/Carousel"
import { useIsMobile } from "@/hooks/use-mobile"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ConvexImage from "@/components/images/ConvexImage"
import { useMemo } from "react"
import Link from "next/link"
import Header from "@/components/public-ui/Header"
import ScrollReveal from "@/components/public-ui/ScrollReveal"

// import GSLogo from "@/public/img/sponsor-image-giant-steps.png"
// import HPLogo from "@/public/img/sponsor-image-horse-play.png"
// import MCLogo from "@/public/img/sponsor-image-montecito.png"
// import PRLogo from "@/public/img/sponsor-image-puremedy.png"
// import SBLogo from "@/public/img/sponsor-image-santa-barbara-foundation.png"
// import FRLogo from "./sponsor-first-republic.png"
// import BGLogo from "./sponsor-biogel.png"
// import ASLogo from "./sponsor-aspca.png"
// const logos = [GSLogo, HPLogo, MCLogo, PRLogo, SBLogo, FRLogo, BGLogo, ASLogo]

const CorporateCarousel = () => {

    const sponsors = useQuery(api.sponsors.getSponsors);
    const isMobile = useIsMobile()

    const items = useMemo(() => (
        (sponsors || [])
        .filter(sponsor => (!!sponsor.image && !!sponsor.image.url))
        .map(sponsor => {
            const image = sponsor.image!
            return {
                id: sponsor._id,
                widget: (
                    <ConvexImage
                        src={image.url!}
                        width={image.width}
                        height={image.height}
                        className="w-[200px] h-auto"
                        alt="Sponsor Logo" />
                )
            }
        })
    ), [sponsors])

    if (!items.length) {
        return null;
    }

    return (
        <div className="w-full h-fit py-12 flex flex-col items-center justify-center gap-2 md:gap-4">

            <ScrollReveal variant="fade-up" className="w-10/12 md:w-full flex flex-col items-center justify-center gap-2">
                <Header color="cinnamon">
                    Sponsors
                </Header>
                <div className="w-full md:w-2/3 text-[20] teft-left md:text-center">
                    A very special thank you goes out to our generous sponsors — corporations that make it possible to do more of the costly work required of a national advocacy organization like Return to Freedom.
                    <br />
                    If you or your company wishes to sponsor our work, please
                    <Link href="/contact" className="text-cinnamon underline ml-1">email us</Link>.
                </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-in" className="w-11/12 h-[150px] md:h-[250px]">
                <Carousel
                    items={items}
                    nDisplayItems={Math.min(isMobile ? 3 : 5, items.length)}
                    autoPlay={"right"}
                    controls={false}
                    transitionDuration={800}
                    autoPlayInterval={3000}
                />
            </ScrollReveal>

        </div>
    )
}

export default CorporateCarousel