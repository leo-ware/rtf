"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import Hero from "@/components/public-ui/Hero"
import CardLayout from "@/components/public-ui/CardLayout"
import DonatePathwayCard from "@/components/donation-widgets/DonatePathwayCard"
import SponsorAHerdDialog from "@/components/donation-widgets/SponsorAHerdDialog"
import SponsorAHerdWidget from "@/components/donation-widgets/SponsorAHerdWidget"
import { Dialog, DialogTrigger, DialogContent } from "@/components/public-ui/Dialog"
import { SalsaDonateFormEmbedInner } from "@/components/SalsaDonateFormEmbed"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import Header from "@/components/public-ui/Header"

import HeroImg from "./donate_hero.jpg"
import SponsorAHorseImg from "@/components/donation-widgets/imgs/sponsor-a-horse.jpg"
import SponsorABurroImg from "@/components/donation-widgets/imgs/sponsor-a-burro.jpg"
import SponsorAHerdImg from "@/components/donation-widgets/imgs/sponsor-a-herd.jpg"

const sponsorColumns = [
    {
        title: "Sponsor a Horse",
        image: SponsorAHorseImg,
        description: "Choose a wild horse to support and help provide lifelong sanctuary care, nutrition, and veterinary services.",
        link: "/donate/sponsor-a-horse",
    },
    {
        title: "Sponsor a Burro",
        image: SponsorABurroImg,
        description: "Support one of our rescued burros and help ensure they receive the specialized care they deserve.",
        link: "/donate/sponsor-a-burro",
    },
    {
        title: "Sponsor a Herd",
        image: SponsorAHerdImg,
        description: "Help sustain an entire herd—covering feed, medical care, and habitat stewardship for a family band.",
        link: null,
    },
] as const

const DonatePage = () => {
    const donatePathways = useQuery(api.donatePathways.listPublicDonatePathways)

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start text-center">
            <Hero title="Donate" image={HeroImg} />

            <div className="w-full h-fit px-4 md:px-8 py-12 bg-sage-green">
                <div
                    className="mx-auto w-full text-white flex gap-8 md:gap-16
                    flex-col items-start
                    md:flex-row md:justify-center"
                >
                    <div className="basis-0 grow flex flex-col items-start justify-center text-left gap-4 py-8">
                        <div className="text-4xl font-serif">
                            Donate to Return to Freedom
                        </div>
                        <div className="text-lg">
                            Support the work that we do across our pillars. Your
                            donation will help us protect the future of
                            America's wild horses and burros.
                        </div>
                    </div>
                    <div className="basis-0 grow w-10/12 md:w-auto">
                        <SalsaDonateFormEmbedInner
                            donationForm={{
                                formId: "BasxlcgBnq",
                                formTemplateId:
                                    "075b2dc6-782d-42b0-b9b6-603714a36154",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Sponsor columns — tall side-by-side images (desktop) */}
            <div className="w-10/12 mx-auto mt-16 h-[70vh] hidden lg:flex rounded-xl overflow-hidden">
                {sponsorColumns.map(({ title, image, description, link }) => {
                    const overlay = (
                        <div className="z-10 flex flex-col items-center justify-center gap-2 px-6">
                            <span className="text-white text-[44px] lg:text-[56px] font-serif drop-shadow-lg group-hover:underline underline-offset-8 decoration-2">
                                {title}
                            </span>
                            <p className="text-white/90 text-xl lg:text-2xl max-w-xs text-center drop-shadow-md
                                opacity-0 translate-y-4
                                group-hover:opacity-100 group-hover:translate-y-0
                                transition-all duration-500 delay-100">
                                {description}
                            </p>
                        </div>
                    )

                    const imageEl = (
                        <ImageWithAuthorCredit
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover object-center"
                            wrapperClassName="z-0 absolute inset-0"
                        />
                    )

                    const className = `relative group flex-1 hover:flex-[1.3] transition-all duration-500
                        h-full flex flex-col items-center justify-center cursor-pointer overflow-hidden`

                    if (link) {
                        return (
                            <Link key={title} href={link} className={className}>
                                {imageEl}
                                {overlay}
                            </Link>
                        )
                    }

                    return (
                        <Dialog key={title} className="flex-1 hover:flex-[1.3] transition-all duration-500 h-full">
                            <DialogTrigger className="w-full h-full">
                                <div className="relative group h-full flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                    {imageEl}
                                    {overlay}
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <SponsorAHerdWidget />
                            </DialogContent>
                        </Dialog>
                    )
                })}
            </div>

            {/* Sponsor columns — mobile/tablet stacked */}
            <div className="w-full flex flex-col lg:hidden">
                {sponsorColumns.map(({ title, image, description, link }) => {
                    const inner = (
                        <div className="relative w-full aspect-[3/4] md:h-[40vh] md:aspect-auto flex flex-col items-center justify-center gap-2 px-6">
                            <ImageWithAuthorCredit
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover object-center"
                                wrapperClassName="z-0 absolute inset-0"
                            />
                            <span className="z-10 text-white text-3xl md:text-6xl font-serif drop-shadow-lg">
                                {title}
                            </span>
                            <p className="z-10 text-white/90 text-sm md:text-xl max-w-xs md:max-w-md text-center drop-shadow-md">
                                {description}
                            </p>
                        </div>
                    )

                    if (link) {
                        return (
                            <Link key={title} href={link}>
                                {inner}
                            </Link>
                        )
                    }

                    return (
                        <SponsorAHerdDialog key={title}>
                            {inner}
                        </SponsorAHerdDialog>
                    )
                })}
            </div>

            {/* Dynamic donate pathways */}
            {donatePathways && donatePathways.length > 0 && (
                <div className="w-10/12 h-fit my-16 flex flex-col items-center gap-8">
                    <Header color="cinnamon">Other Ways to Give</Header>
                    <CardLayout>
                        {donatePathways.map((pathway) => (
                            <div key={pathway._id} className="w-full h-fit">
                                <DonatePathwayCard pathway={pathway} />
                            </div>
                        ))}
                    </CardLayout>
                </div>
            )}
        </div>
    )
}

export default DonatePage
