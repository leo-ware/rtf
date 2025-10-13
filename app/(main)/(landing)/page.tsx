"use client"

import Button from "@/components/Button"
import VideoStandin from "./landing_hero_video_preview.png"
import Image from "next/image"
import Link from "next/link"

import CorporateCarousel from "./CorporateCarousel"
import NewsCarousel from "../about/NewsCarousel"
import VideoCarousel from "./VideoCarousel"

import ConservationImage from "./some-mountain.png"
import AdvocacyImage from "./horses-in-hills.jpg"
import SanctuaryImage from "./california-prairie.jpg"
import EducationImage from "./rolling-hills.jpg"
import OminouseHorses from "./ominous-horses.jpg"
import SpiritImage from "./spirit-zooming.png"
import NeedUsCarousel from "./NeedUsCarousel"
import BlurredDonateBackgroundOne from "./blurred-donate-frame-1.png"
import BlurredDonateBackgroundTwo from "./blurred-donate-frame-2.png"
import LongRightArrow from "@/components/LongRightArrow"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"


const HomePage = () => {
    const landingVideoUrl = useQuery(api.video.getLandingVideoUrl)
    return (
        <div className="w-full">

            <div className="relative w-full h-[84vh] bg-pewter">
                <video
                    className="z-0 absolute w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    {landingVideoUrl
                        && <source src={landingVideoUrl} type="video/mp4" />}
                </video>
                <div className="relative z-10 w-full h-full flex items-center justify-center
                    text-white text-center text-[64px] font-serif">
                    Wild Horse Conservation
                </div>
            </div>

            <div className="w-2/3 mx-auto h-fit py-8 md:pt-16 md:pb-8 flex flex-col items-center justify-center gap-8">
                <div className="text-center text-cinnamon text-4xl font-serif">
                    Protecting The Spirit Of The American West, <br />
                    One Wild Horse At a Time
                </div>
                <div className="text-center text-ink text-sm">
                    Return to Freedom is dedicated to preserving the freedom, diversity, and habitat of
                    America’s wild horses and burros through sanctuary, education, advocacy, and conservation,
                    while enriching the human spirit through direct experience with the natural world.
                </div>
                <div>
                    <Button color="pewter" className="py-1 px-4">
                        About Us
                    </Button>
                </div>
            </div>

            <div className="w-full h-fit md:py-16 flex flex-col items-center justify-center gap-8">
                <div className="w-11/12 md:w-full flex flex-col items-start md:items-center justify-center gap-2">
                    <div className="text-sage-green text-4xl font-serif">
                        What We Do
                    </div>
                    <div className="md:max-w-1/2 md:text-center text-ink text-sm">
                        Return to Freedom protects and preserves America’s wild horses and burros through a holistic
                        approach that unites sanctuary, conservation, advocacy, and education. From rescuing and
                        caring for displaced herds to pioneering humane fertility control on the range and fighting
                        for policy reform, RTF bridges hands-on care with national leadership—creating lasting,
                        science-based solutions that ensure wild horses remain free for generations to come.
                    </div>
                </div>

                <div className="w-full flex items-center justify-center">
                    <div className="md:w-11/12 h-[500px] flex stretch flex-wrap md:flex-nowrap">
                        {[
                            {
                                title: "Conservation",
                                image: ConservationImage,
                                description: `
                                    RTF restores balance to both land and herds through regenerative grazing and 
                                    humane fertility control. Our collaboration with Cal Poly San Luis Obispo has 
                                    revitalized 2,000 acres of grassland, while our PZP fertility control program 
                                    keeps herds healthy and intact without roundups. These initiatives prove that 
                                    science and compassion can coexist.
                                `,
                                link: "/"
                            },
                            {
                                title: "Advocacy",
                                image: AdvocacyImage,
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                link: "/advocacy"
                            },
                            {
                                title: "Sanctuary",
                                image: SanctuaryImage,
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                link: "/sanctuary"
                            },
                            {
                                title: "Education",
                                image: EducationImage,
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                link: "/education"
                            }
                        ].map(({ title, image, description, link }) => (
                            <>
                                <div className="hidden md:block
                                    relative group transition-all duration-500 flex-grow hover:flex-grow-2 basis-0
                                    h-full bg-pewter flex flex-col items-center justify-center gap-2">
                                    <Image
                                        src={image}
                                        alt={title + " image"}
                                        className="z-0 absolute top-0 left-0
                                            w-full h-full object-cover object-center
                                            "
                                    />
                                    <div className="z-10 h-full w-full relative px-4 flex flex-col items-center group-hover:items-start justify-center">
                                        <div className="grow basis-0" />
                                        <div className="relative w-full h-12 grow-0 basis-fit">
                                            <Link
                                                href={link}
                                                className="w-fit text-white text-3xl font-serif
                                                    absolute left-1/2 -translate-x-1/2 
                                                    group-hover:left-0 group-hover:-translate-x-0
                                                    transition-all duration-500 group-hover:duration-300
                                                    "
                                            >
                                                {title}
                                                {/* <div className="absolute bottom-0 left-[0px] right-[0px] duration-500
                                                    h-0.5 bg-white scale-x-0 group-hover:scale-x-100
                                                    transition-transform origin-left" /> */}
                                            </Link>
                                        </div>
                                        <div className="grow basis-0 max-w-3/4 overflow-hidden">
                                            <p className="text-white text-sm
                                                hidden group-hover:block
                                                opacity-0 group-hover:opacity-100 transition-opacity
                                                duration-200 delay-0 group-hover:delay-300">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="block md:hidden relative w-1/2 aspect-square flex items-center justify-center">
                                    <Image
                                        src={image}
                                        alt={title + " image"}
                                        className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center" />
                                    <Link
                                        href={link}
                                        className="z-10 text-white text-2xl font-bold">
                                        {title}
                                    </Link>
                                </div>
                            </>
                        ))}

                    </div>
                </div>
            </div>

            <div className="w-11/12 mx-auto h-fit md:py-16 flex flex-col items-center justify-center gap-8">
                <div className="mb-8">
                    <div className="text-sage-green text-5xl font-serif mb-4">
                        Why America's Wild
                        <br />
                        Horses Need Us Now
                    </div>
                    <div className="w-5/6 mx-auto h-1 border-b-2 border-sage-green" />
                </div>
                <NeedUsCarousel />
            </div>

            <div className="w-11/12 mx-auto h-fit md:py-16 flex flex-col items-center justify-center gap-8">
                <div className="mb-8">
                    <div className="text-pewter text-5xl font-serif mb-4">Be Their Voice</div>
                    <div className="w-5/6 mx-auto h-1 border-b-2 border-pewter" />
                </div>
                <div className="flex gap-4 h-[80vh]">
                    <div className="z-0 relative basis-0 grow h-full rounded-sm overflow-hidden">
                        <Image
                            src={BlurredDonateBackgroundOne} alt="Ominous Horses"
                            className="absolute top-0 left-0 z-0 w-full h-full object-cover object-center" />
                        <div className="relative z-10 w-full h-full py-20 px-10 flex flex-col items-start justify-between gap-4">
                            <div className="text-white flex flex-col gap-6 max-w-8/12">
                                <div className="text-4xl font-serif">
                                    Donate to
                                    <br />
                                    Wild Horse
                                    <br />
                                    Defense Fund
                                </div>
                                <div className="text-md">
                                    The Wild Horse Defense Fund fuels Return to Freedom’s frontline work to end cruel
                                    roundups, advance humane on-range management, and defend wild horses through
                                    advocacy, legal action, and education.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="z-0 relative basis-0 grow h-full rounded-sm overflow-hidden">
                        <Image
                            src={BlurredDonateBackgroundTwo} alt="Ominous Horses"
                            className="absolute top-0 left-0 z-0 w-full h-full object-cover object-center" />
                        <div className="relative z-10 w-full h-full py-20 px-10 flex flex-col items-start justify-between gap-4">
                            <div className="text-white flex flex-col gap-6 max-w-8/12">
                                <div className="text-4xl font-serif">
                                    Donate to
                                    <br />
                                    Return to Freedom
                                    <br />
                                    Sanctuary Fund
                                </div>
                                <div className="text-md">
                                    The Wild Horse Defense Fund fuels Return to Freedom’s frontline work to end cruel
                                    roundups, advance humane on-range management, and defend wild horses through
                                    advocacy, legal action, and education.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-fit md:py-16 flex flex-col items-center justify-center gap-8">
                <div className="w-11/12 md:w-full flex flex-col items-start md:items-center justify-center gap-2">
                    <div className="text-pewter text-4xl font-serif mb-4">Take Action</div>
                    <div className="w-10/12 mx-auto h-fit flex gap-6">
                        {Array(3).fill(null).map(() => (
                            <div className="basis-0 grow aspect-square flex flex-col bg-seashell rounded-sm overflow-hidden">
                                <div className="grow bg-pewter">
                                    <Image
                                        src={OminouseHorses}
                                        alt="Ominous Horses"
                                        className="w-full h-full object-cover object-center" />
                                </div>
                                <div className="h-1/3 p-4">
                                    <div className="text-ink text-xs">
                                        October 10, 2025
                                    </div>
                                    <Link href="/" className="text-pewter text-md">
                                        Congress steps up on wild horse protections, must press for
                                        fertility control. Sign the petition.
                                    </Link>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            <div className="relative w-full h-[400px] md:h-fit md:py-16 py-4 flex items-end md:items-center justify-end px-4 md:px-24">
                <div className="z-0 absolute top-0 left-0 w-full h-full overflow-hidden">
                    <Image
                        src={SpiritImage}
                        alt="Spirit"
                        className="z-0 absolute top-0 md:top-[-155px] left-0 w-full md:h-auto h-[400px] object-cover object-top" />
                    <div
                        className="hidden md:block"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to left, #292D35 0%, transparent 50%)',
                            pointerEvents: 'none'
                        }}
                    />
                </div>
                <div className="z-10 flex flex-col items-end justify-center gap-4 md:my-16">
                    <div className="text-white text-right flex flex-col gap-2">
                        <div className="text-4xl font-bold">
                            Spirit:
                        </div>
                        <div className="text-2xl">
                            The Inspiration behind<br className="hidden md:block" />
                            the DreamWork animation
                        </div>
                    </div>
                    <Button color="burnt-orange px-4">READ MORE about Spirit</Button>
                </div>
            </div>

            <NewsCarousel />

            <VideoCarousel />

            <CorporateCarousel />

            <div className="w-fit max-w-11/12 h-fit mt-2 mb-20 mx-auto flex flex-col items-center justify-center">
                <div className="text-storm font-serif text-3xl mb-2">
                    Subscribe to receive updates on our work
                </div>
                <div className="w-full h-12 flex border-1 border-pewter rounded-sm">
                    <input type="email" placeholder="ENTER YOUR EMAIL" className="grow h-full py-2 px-4 text-sm" />
                    <button className="basis-16 grow-0 h-full bg-burnt-orange text-white flex items-center justify-center">
                        <LongRightArrow />
                    </button>
                </div>

            </div>

        </div>
    )
}

export default HomePage