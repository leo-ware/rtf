"use client"

import Hero from "@/components/public-ui/Hero"
import CardLayout from "@/components/public-ui/CardLayout"
import { useState } from "react";
import { DonatePanel } from "../../../components/donation-widgets/DonationLinks"
import GenericDonateDialogue from "../../../components/donation-widgets/GenericDonateDialogue"
import SponsorAHerdDialog from "../../../components/donation-widgets/sponsor-a-herd-dialog"

import HeroImg from "./donate_hero.jpg"

const DonatePage = () => {
    const [activeWidget, setActiveWidget] = useState<string | null>(null);

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start text-center">
            <Hero title="Donate" image={HeroImg} />

            <div className="w-full h-fit px-16 py-12 bg-sage-green">
                <div className="mx-auto w-11/12 md:w-10/12 text-white flex gap-16
                    flex-col items-center
                    md:flex-row md:justify-center">
                    <div className="basis-0 grow flex flex-col items-end justify-center md:text-right gap-4">
                        <div className="text-4xl font-serif">Donate to Return to Freedom</div>
                        <div className="text-lg">
                            Support the work that we do across our pillars. Your donation will help us protect
                            the future of America's wild horses and burros.
                        </div>
                    </div>
                    <div className="basis-0 grow">
                    </div>
                </div>
            </div>

            <div className="w-10/12 h-fit my-16">
                <CardLayout className="gap-8">
                    <DonatePanel title="Sponsor a Horse" />

                    <DonatePanel title="Sponsor a Burro" />

                    <SponsorAHerdDialog>
                        <DonatePanel title="Sponsor a Herd" />
                    </SponsorAHerdDialog>

                    <DonatePanel title="Capital Campaign In Honor of Robert Redford" />
                    <DonatePanel title="Planned Giving in Honor of Bill Demayo" />
                    <DonatePanel title="Matching Gifts and Corporate Giving" />

                    <GenericDonateDialogue>
                        <DonatePanel title="Sanctuary Fund" />
                    </GenericDonateDialogue>

                    <GenericDonateDialogue>
                        <DonatePanel title="Wild Horse Defense Fund" />
                    </GenericDonateDialogue>

                    <GenericDonateDialogue>
                        <DonatePanel title="Spirit's Legacy Fund" />
                    </GenericDonateDialogue>
                    
                    <GenericDonateDialogue>
                            <DonatePanel title="Sponsor a Bale of Hay" />
                    </GenericDonateDialogue>

                    <DonatePanel title="Veterinary Fund In honor of Stella Demayo" />

                    <GenericDonateDialogue>
                        <DonatePanel title="In Honor and Memory Gifts" />
                    </GenericDonateDialogue>

                    <DonatePanel title="Wishlist" />
                    <DonatePanel title="Shop" />
                    <DonatePanel title="Other Ways to Give" />

                </CardLayout>
            </div>
        </div>
    )
}

export default DonatePage