"use client"

import Button from "@/components/public-ui/Button"
import Image from "next/image"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import Link from "next/link"
import { Fragment, useState } from "react"
import DonationCallout, { DonationCalloutGrid } from "@/components/DonationCallout"
import UpcomingEventsWidget from "@/components/UpcomingEventsWidget"
import LongRightArrow from "@/components/LongRightArrow"
import ScrollReveal from "@/components/public-ui/ScrollReveal"

import CorporateCarousel from "./CorporateCarousel"
import NewsCarousel from "../../../components/NewsCarousel"
import VideoCarousel from "../../../components/VideoCarousel"
import NeedUsCarousel from "./NeedUsCarousel"
import StatsBar from "@/components/StatsBar"

import ConservationImage from "./imgs/new_conservation_image.png"
import AdvocacyImage from "./imgs/new_advocacy_image.png"
import SanctuaryImage from "./imgs/new_sanctuary_image.png"
import EducationImage from "./imgs/new_education_image.png"
import OminouseHorses from "./imgs/ominous-horses.jpg"
import SpiritImage from "./imgs/spirit-zooming.png"
import BlurredDonateBackgroundOne from "./imgs/blurred-donate-frame-1.png"
import WhdfImage from "./imgs/whdf.jpg"
import SanctuaryFundImage from "./imgs/sanctuary_fund.jpg"
import ProgramsAndEventsImage from "./imgs/programs-and-events-image.png"
import Header from "@/components/public-ui/Header"
import TakeActionSection from "@/components/TakeActionSection"
import TextCycler from "@/components/public-ui/TextCycler"
import SubscribePrimary from "../contact/SubscribePrimary"
import VideoPoster from "./imgs/landing_hero_video_preview.jpg"

const landingVideoUrl =
    "https://pub-25922965d5524e8db13526bfb193c2ff.r2.dev/rtf-landing-video-v1.mp4"

const HomePage = () => {
    const [videoReady, setVideoReady] = useState(false)

    return (
        <div className="w-full">
            <div className="relative w-full h-[84vh] bg-pewter">
                <Image
                    src={VideoPoster}
                    alt=""
                    fill
                    priority
                    className="z-0 absolute w-full h-full object-cover"
                    placeholder="blur"
                />
                <video
                    className={`z-[1] absolute w-full h-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    onPlaying={() => setVideoReady(true)}
                >
                    {landingVideoUrl && (
                        <source src={landingVideoUrl} type="video/mp4" />
                    )}
                </video>
                <div
                    className={`
                    relative z-10 w-full h-full px-4
                    flex items-center justify-center
                    text-white text-center font-serif
                    text-[56px] md:text-[84px] lg:text-[70px]
                    `}
                >
                    <span>
                        Wild Horse{" "}
                        <span className="block lg:inline w-full">
                            <TextCycler
                                hideUnderline
                                words={["Conservation", "Sanctuary", "Advocacy", "Education"]}
                                hrefs={[
                                    "/what-we-do/conservation",
                                    "/what-we-do/sanctuary",
                                    "/what-we-do/advocacy",
                                    "/what-we-do/education",
                                ]}
                            />
                        </span>
                    </span>
                </div>
            </div>

            <ScrollReveal
                variant="fade-up"
                className="w-11/12 lg:w-2/3 mx-auto h-fit py-8 md:pt-16 md:pb-8 flex flex-col items-center justify-center gap-8"
            >
                <Header
                    color="cinnamon"
                    className="no-underline text-left md:text-center"
                >
                    Protecting The Spirit Of The American West, One Wild Horse
                    At a Time
                </Header>
                <div className="text-left md:text-center text-ink text-[20px]">
                    Return to Freedom is dedicated to preserving the freedom,
                    diversity, and habitat of America's wild horses and burros
                    through sanctuary, education, advocacy, and conservation,
                    while enriching the human spirit through direct experience
                    with the natural world.
                </div>
                <Link href="/about">
                    <Button color="pewter" className="py-1 px-4 text-[16px]">
                        About Us
                    </Button>
                </Link>
            </ScrollReveal>

            <div
                id="what-we-do"
                className="w-full h-fit md:py-16 flex flex-col items-center justify-center gap-8"
            >
                <ScrollReveal
                    variant="fade-up"
                    className="w-11/12 lg:w-2/3 flex flex-col items-start md:items-center justify-center gap-2"
                >
                    <Header
                        color="sage-green"
                        className="no-underline text-left md:text-center"
                    >
                        What We Do
                    </Header>
                    <div className="w-full md:text-center text-ink text-[20px]">
                        Return to Freedom protects and preserves America's wild
                        horses and burros through a holistic approach that
                        unites sanctuary, conservation, advocacy, and education.
                        From rescuing and caring for displaced herds to
                        pioneering humane fertility control on the range and
                        fighting for policy reform, RTF bridges hands-on care
                        with national leadership—creating lasting, science-based
                        solutions that ensure wild horses remain free for
                        generations to come.
                    </div>
                </ScrollReveal>

                <ScrollReveal
                    variant="scale"
                    className="w-full flex items-center justify-center"
                >
                    <div className="md:w-10/12 lg:w-11/12 lg:h-[90vh] flex stretch flex-wrap lg:flex-nowrap">
                        {[
                            {
                                title: "Conservation",
                                image: ConservationImage,
                                description: `
                                   RTF advances practical, science-based conservation through humane fertility
                                   control, regenerative land management, and the protection of rare historic mustang
                                   strains. Our work demonstrates how wild horses can remain on the land without roundups.
                                `,
                                link: "/what-we-do/conservation",
                            },
                            {
                                title: "Advocacy",
                                image: AdvocacyImage,
                                description: `
                                    RTF works to protect wild horses and burros through
                                    policy reform, legal action, and public engagement. We challenge helicopter roundups,
                                    defend Herd Management Areas, oppose horse slaughter, and push for humane,
                                    science-driven alternatives that keep horses wild and free on public lands.
                                `,
                                link: "/what-we-do/advocacy",
                            },
                            {
                                title: "Sanctuary",
                                image: SanctuaryImage,
                                description: `
                                    Return to Freedom provides lifelong sanctuary for wild horses and burros displaced
                                    by roundups, neglect, or the threat of slaughter. Across our Lompoc headquarters
                                    and San Luis Obispo satellite sanctuary, horses live in natural family bands with
                                    room to roam.
                                `,
                                link: "/what-we-do/sanctuary",
                            },
                            {
                                title: "Education",
                                image: EducationImage,
                                description: `
                                    Education at Return to Freedom is grounded in real-world practice. Through tours,
                                    hikes, workshops, webinars, and volunteer programs, we invite people to learn
                                    directly from intact herds and working landscapes—building understanding of wild
                                    horse behavior, humane management.
                                `,
                                link: "/what-we-do/education",
                            },
                        ].map(({ title, image, description, link }) => (
                            <Fragment key={title}>
                                <Link
                                    href={link}
                                    className="hidden lg:block
                                    relative group transition-all duration-500 flex-grow hover:flex-grow-2 basis-0
                                    h-full bg-pewter flex flex-col items-center justify-center gap-2"
                                >
                                    <ImageWithAuthorCredit
                                        src={image}
                                        alt={title + " image"}
                                        className="w-full h-full object-cover object-center"
                                        wrapperClassName="z-0 absolute inset-0"
                                    />
                                    <div className="z-10 h-full w-full relative px-4 flex flex-col items-center group-hover:items-start justify-center">
                                        <div className="grow basis-0" />
                                        <div className="relative w-full h-16 grow-0 basis-fit">
                                            <span
                                                className="w-fit text-white text-[44px] font-serif
                                                    absolute left-1/2 -translate-x-1/2
                                                    group-hover:left-0 group-hover:-translate-x-0
                                                    transition-all duration-500 group-hover:duration-300
                                                    "
                                            >
                                                {title}
                                            </span>
                                        </div>
                                        <div className="grow basis-0 max-w-3/4 overflow-hidden">
                                            <p
                                                className="text-white text-[20px]
                                                hidden group-hover:block
                                                opacity-0 group-hover:opacity-100 transition-opacity
                                                duration-200 delay-0 group-hover:delay-300"
                                            >
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href={link}
                                    className="block lg:hidden relative w-1/2 aspect-[3/4] md:aspect-square flex items-center justify-center"
                                >
                                    <ImageWithAuthorCredit
                                        src={image}
                                        alt={title + " image"}
                                        className="w-full h-full object-cover object-center"
                                        wrapperClassName="z-0 absolute inset-0"
                                    />
                                    <span className="z-10 text-white text-[27px] font-serif">
                                        {title}
                                    </span>
                                </Link>
                            </Fragment>
                        ))}
                    </div>
                </ScrollReveal>
            </div>

            <div className="w-full h-fit py-4 md:py-8 flex flex-col items-center justify-center gap-4 md:gap-8">
                <ScrollReveal
                    variant="fade-up"
                    className="w-11/12 mx-auto mb-0 md:mb-4"
                >
                    <Header color="sage-green" className="lg:max-w-1/2 mx-auto">
                        Why America's Wild Horses Need Us Now
                    </Header>
                </ScrollReveal>
                <ScrollReveal
                    variant="fade-in"
                    className="w-full h-fit md:px-4"
                >
                    <NeedUsCarousel />
                </ScrollReveal>
            </div>

            <StatsBar />

            <div className="w-11/12 mx-auto h-fit md:py-16 flex flex-col items-center justify-center gap-8">
                <ScrollReveal variant="fade-in" className="md:mb-8">
                    <Header color="pewter">Be Their Voice</Header>
                </ScrollReveal>

                <DonationCalloutGrid>
                    <ScrollReveal variant="fade-up" className="md:row-span-3 md:grid md:grid-rows-[subgrid]">
                        <DonationCallout
                            gridAligned
                            image={WhdfImage}
                            heading="Donate to Wild Horse Defense Fund"
                            description="The Wild Horse Defense Fund fuels Return to Freedom's frontline work to end cruel roundups, advance humane on-range management, and defend wild horses through advocacy, legal action, and education."
                            donatePathway="Wild Horse Defense Fund"
                            buttonText="Donate"
                            align="left"
                            buttonAlign="left"
                            analyticsName="whd_fund"
                        />
                    </ScrollReveal>

                    <ScrollReveal
                        variant="fade-up"
                        delay={0.15}
                        className="md:row-span-3 md:grid md:grid-rows-[subgrid]"
                    >
                        <DonationCallout
                            gridAligned
                            image={SanctuaryFundImage}
                            heading="Donate to Return to Freedom Sanctuary Fund"
                            description="Return to Freedom Sanctuary Fund supports our ongoing work to care for and protect America's wild horses and burros in our sanctuaries. Your donation helps us provide the best possible care for these animals, ensuring they have a safe and healthy home."
                            donatePathway="Sanctuary Fund"
                            buttonText="Donate"
                            align="left"
                            buttonAlign="left"
                            analyticsName="sanctuary_fund"
                        />
                    </ScrollReveal>
                </DonationCalloutGrid>
            </div>

            <ScrollReveal variant="fade-up" className="w-full h-fit mt-8">
                <TakeActionSection topic="homepage" />
            </ScrollReveal>

            <div className="relative w-full h-[400px] md:h-fit md:min-h-[400px] md:py-16 py-4 flex items-end md:items-center justify-end px-4 md:px-24">
                <div className="z-0 absolute inset-0 overflow-hidden">
                    <ImageWithAuthorCredit
                        src={SpiritImage}
                        alt="Spirit"
                        className="w-full h-full object-cover object-top"
                        wrapperClassName="absolute inset-0"
                    />
                    <div
                        className="hidden md:block absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to left, #292D35 0%, transparent 50%)",
                            pointerEvents: "none",
                        }}
                    />
                </div>
                <ScrollReveal
                    variant="slide-left"
                    className="z-10 flex flex-col items-end justify-center gap-4 md:my-16"
                >
                    <div className="text-white font-serif text-right flex flex-col gap-2">
                        <div className="text-[48px]">Spirit</div>
                        <div className="text-[28px]">
                            The Inspiration behind{" "}
                            <br className="hidden md:block" />
                            the DreamWork animation
                        </div>
                    </div>
                    <Link href="/horses/spirit">
                        <Button
                            color="sage-green"
                            className="py-1 px-4 text-[16px]"
                        >
                            Read More About Spirit
                        </Button>
                    </Link>
                </ScrollReveal>
            </div>

            <div
                className={`
                w-full h-fit bg-milk
                py-6 md:py-16
                px-4 md:px-12
                flex items-start justify-end gap-12
                flex-col md:flex-row
                `}
            >
                <ScrollReveal
                    variant="fade-up"
                    className="flex-1 h-auto flex flex-col items-center justify-center gap-8"
                >
                    <Header color="pewter">Programs & Events</Header>
                    <ImageWithAuthorCredit
                        src={ProgramsAndEventsImage}
                        alt="Programs and Events"
                        className="w-full md:max-w-[550px] h-full object-cover object-center"
                    />
                </ScrollReveal>
                <ScrollReveal
                    variant="fade-up"
                    delay={0.15}
                    className="flex-1 h-[460px] w-full"
                >
                    <UpcomingEventsWidget compact className="bg-white w-full" />
                </ScrollReveal>
            </div>

            <ScrollReveal variant="fade-up">
                <NewsCarousel topic="homepage" />
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <VideoCarousel
                    carouselItems={[
                        {
                            title: "Robert Redford stands with America's wild horses",
                            videoId: "423814174",
                        },
                        {
                            title: "\'Spirit: Untamed\' director visits RTF's sanctuary",
                            videoId: "567146784",
                        },
                        {
                            title: "Stand with America's wild horses and burros",
                            videoId: "263067600",
                        },
                        {
                            title: "Join Wendie Malick in the fight to protect America's wild horses",
                            videoId: "160682894",
                        },
                    ]}
                />
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
                <CorporateCarousel />
            </ScrollReveal>

            <ScrollReveal
                variant="fade-up"
                className="w-fit max-w-11/12 h-fit mt-8 mb-20 mx-auto flex flex-col items-center justify-center"
            >
                <div className="text-pewter font-serif text-4xl mb-2">
                    Subscribe to receive updates on our work
                </div>
                <SubscribePrimary />
                {/*<div className="w-full h-12 flex border-1 border-pewter rounded-sm">
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL"
            className="grow h-full py-2 px-4 text-sm"
          />
          <button className="basis-16 grow-0 h-full bg-burnt-orange text-white flex items-center justify-center">
            <LongRightArrow />
          </button>
        </div>*/}
            </ScrollReveal>
        </div>
    )
}

export default HomePage
