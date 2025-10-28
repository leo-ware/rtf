"use client"

import Hero from "@/components/public-ui/Hero"
import Image from "next/image"
import SponsorAHorseMenu from "../our-horses/SponsorAHorseMenu"

import OurHerdsHeroImage from "./herds-hero.jpg"
import SponsorHerdBg from "./imgs/sponsor-herd-bg.jpg"

import { alpineHerd } from "./herd_data"

let herds = ["Alpine", "Calico", "Lompoc", "San Luis Obispo", "Sierra", "Southwest", "Valley"]

herds = [
    ...herds,
    ...herds
]

const OurHerdsPage = () => {
    const herd = alpineHerd
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16 text-center">
            <Hero title="Our Herds" image={OurHerdsHeroImage} />

            <div className="w-8/12 h-fit flex flex-col items-center justify-center text-pewter text-[24px] font-serif">
                The majority of the horses who range free at the Return to Freedom Wild Horse Sanctuary
                are part of a herd or bachelor band. Some herds arrived together. Others formed after
                they arrived. Still others found new family members among horses already residing at
                the Sanctuary. But no matter how they formed, each herd is a closely-knit family or
                social group, with each member assuming specific duties and responsibilities, and
                all share a very deep bond.
            </div>

            <div className="w-8/12 h-fit border-t-4 border-black py-6 flex gap-8 flex-wrap items-center justify-center">
                {herds.map((herd) => (
                    <div key={herd} className="w-fit h-fit text-black uppercase text-lg font-semibold">
                        {herd}
                    </div>
                ))}
            </div>

            <div className="w-8/12 flex flex-col items-center justify-center gap-4">
                <div className="text-cinnamon text-[48px] font-serif">
                    {herd.name}
                </div>

                {herd.image && (
                    <div className="relative w-full h-[500px]">
                        <Image
                            src={herd.image}
                            alt="Alpine Herd"
                            className="w-full h-full object-cover object-center"
                            fill
                        />
                    </div>
                )}

                <div>{herd.description}</div>
            </div>


            <div className="w-full flex flex-col items-center justify-center gap-8">
                <div className="text-pewter text-[40px] font-serif">Rescue Timeline</div>
                <div className="relative w-8/12 flex flex-col items-between gap-12">
                    <div className="absolute top-0 left-1/2 w-1 h-full border-l-2 border-ink" />
                    {herd.timeline.map((tm, i) => {
                        const even = i % 2 === 0
                        return (
                            <div
                                key={i}
                                className={`w-full h-fit flex items-center justify-between gap-12
                                            ${even ? "flex-row" : "flex-row-reverse"}`}>
                                <div className={`basis-0 grow flex flex-col
                                ${even ? "items-end text-right" : "items-start text-left"}`}>
                                    <div className={`text-[24px] font-serif ${even ? "text-cinnamon" : "text-pewter"}`}>
                                        {tm.date}
                                    </div>
                                    <div className={`text-[24px] font-serif ${even ? "text-cinnamon" : "text-pewter"}`}>
                                        {tm.name}
                                    </div>
                                    <div>{tm.description}</div>
                                </div>
                                <div className="relative basis-0 grow h-72 flex flex-col">
                                    {tm.image && (<Image
                                        src={tm.image}
                                        alt={tm.name}
                                        className="w-full h-full object-cover object-center"
                                        fill
                                    />)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="z-0 w-full relative">
                <Image
                    src={SponsorHerdBg}
                    alt="Sponsor Herd Background"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-bottom" fill />

                <div className="z-10 relative top-0 left-0 w-full h-full p-20 flex justify-end">
                    <div className="w-5/12 flex flex-col gap-4 items-start justify-start">
                        <div className="text-white text-[40px] text-left font-serif">
                            Sponsor the {herd.name}
                        </div>
                        <div className="text-white text-[20px] text-left">
                            {herd.sponsorshipPitch}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-fit">
                <SponsorAHorseMenu />
            </div>
        </div>
    )
}

export default OurHerdsPage