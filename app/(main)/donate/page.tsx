"use client"

import Hero from "@/components/public-ui/Hero"
import CardLayout from "@/components/public-ui/CardLayout"
import { useState } from "react";
import { DonatePanel } from "./widgets/DonationLinks"
import SponsorAHorseWidget from "./widgets/SponsorAHorseWidget"
import SponsorAHerdWidget from "./widgets/SponsorAHerdWidget"
import GenericDonateDialogue from "./widgets/GenericDonateDialogue"

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
                    {(activeWidget !== "Sponsor a Horse")
                        ? (
                            <div onClick={() => setActiveWidget("Sponsor a Horse")}>
                                <DonatePanel title="Sponsor a Horse" link={false} />
                            </div>
                        )
                        : (
                            <div className="col-span-full">
                                <SponsorAHorseWidget htype="horse" />
                            </div>
                        )}

                    {activeWidget !== "Sponsor a Burro"
                        ? (
                            <div onClick={() => setActiveWidget("Sponsor a Burro")}>
                                <DonatePanel title="Sponsor a Burro" link={false} />
                            </div>
                        )
                        : (
                            <div className="col-span-full">
                                <SponsorAHorseWidget htype="burro" />
                            </div>
                        )}

                    {activeWidget !== "Sponsor a Herd"
                        ? (
                            <div onClick={() => setActiveWidget("Sponsor a Herd")}>
                                <DonatePanel title="Sponsor a Herd" link={false} />
                            </div>
                        )
                        : (
                            <div className="col-span-full">
                                <SponsorAHerdWidget />
                            </div>
                        )}

                    <DonatePanel title="Capital Campaign In Honor of Robert Redford" />
                    <DonatePanel title="Planned Giving in Honor of Bill Demayo" />
                    <DonatePanel title="Matching Gifts and Corporate Giving" />

                    {activeWidget !== "Sanctuary Fund"
                        ? <div onClick={() => setActiveWidget("Sanctuary Fund")}>
                            <DonatePanel title="Sanctuary Fund" />
                        </div>
                        : <div className="col-span-full">
                            <GenericDonateDialogue />
                        </div>}
                    {activeWidget !== "Wild Horse Defense Fund"
                        ? <DonatePanel title="Wild Horse Defense Fund" />
                        : <div className="col-span-full">
                            <GenericDonateDialogue />
                        </div>}
                    {activeWidget !== "Spirit's Legacy Fund"
                        ? <div onClick={() => setActiveWidget("Spirit's Legacy Fund")}>
                            <DonatePanel title="Spirit's Legacy Fund" />
                        </div>
                        : <div className="col-span-full">
                            <GenericDonateDialogue />
                        </div>}
                    
                    {activeWidget !== "Sponsor a Bale of Hay"
                        ? <div onClick={() => setActiveWidget("Sponsor a Bale of Hay")}>
                            <DonatePanel title="Sponsor a Bale of Hay" />
                        </div>
                        : <div className="col-span-full">
                            <GenericDonateDialogue />
                        </div>}
                    <DonatePanel title="Veterinary Fund In honor of Stella Demayo" />
                    {activeWidget !== "In Honor and Memory Gifts"
                        ? <div onClick={() => setActiveWidget("In Honor and Memory Gifts")}>
                            <DonatePanel title="In Honor and Memory Gifts" />
                        </div>
                        : <div className="col-span-full">
                            <GenericDonateDialogue />
                        </div>}

                    <DonatePanel title="Wishlist" />
                    <DonatePanel title="Shop" />
                    <DonatePanel title="Other Ways to Give" />
                </CardLayout>
            </div>
        </div>
    )
}

export default DonatePage