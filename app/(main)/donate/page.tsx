"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Hero from "@/components/public-ui/Hero"
import CardLayout from "@/components/public-ui/CardLayout"
import { DonationWidgets } from "@/components/donation-widgets/DonationWidgets"
import DonatePathwayCard from "@/components/donation-widgets/DonatePathwayCard"
import { SalsaDonateFormEmbedInner } from "@/components/SalsaDonateFormEmbed"

import HeroImg from "./donate_hero.jpg"

// Primary widgets that appear first (hardcoded)
const primaryWidgets = [
    DonationWidgets.SponsorAHorse,
    DonationWidgets.SponsorABurro,
    DonationWidgets.SponsorAHerd,
]

const DonatePage = () => {
    const donatePathways = useQuery(api.donatePathways.listPublicDonatePathways)

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start text-center">
            <Hero title="Donate" image={HeroImg} />

            <div className="w-full h-fit px-16 py-12 bg-sage-green">
                <div
                    className="mx-auto w-11/12 md:w-10/12 text-white flex gap-16
                    flex-col items-start
                    md:flex-row md:justify-center"
                >
                    <div className="basis-0 grow flex flex-col items-end justify-center md:text-right gap-4 py-8">
                        <div className="text-4xl font-serif">
                            Donate to Return to Freedom
                        </div>
                        <div className="text-lg">
                            Support the work that we do across our pillars. Your
                            donation will help us protect the future of
                            America's wild horses and burros.
                        </div>
                    </div>
                    <div className="basis-0 grow">
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

            <div className="w-10/12 h-fit my-16">
                <CardLayout>
                    {/* Primary hardcoded widgets first */}
                    {primaryWidgets.map((Widget, i) => (
                        <div key={`primary-${i}`} className="w-full h-fit">
                            <Widget />
                        </div>
                    ))}
                    {/* Dynamic donate pathways */}
                    {donatePathways?.map((pathway) => (
                        <div key={pathway._id} className="w-full h-fit">
                            <DonatePathwayCard pathway={pathway} />
                        </div>
                    ))}
                </CardLayout>
            </div>
        </div>
    )
}

export default DonatePage
