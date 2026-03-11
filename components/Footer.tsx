"use client"

import Link from "next/link"
import Image from "next/image"
import { MdOutlineEmail } from "react-icons/md"
import RTFLogoWhite from "@/public/img/rtf_logo_white.svg"
import { FaExternalLinkAlt } from "react-icons/fa"
import SocialLinks from "./SocialLinksWidget"

import CharityNavigator from "./images/charity-navigator.png"
import OnePercent from "./images/1_percent_planet.png"
import NatureDefense from "./images/nature-defense-foundation.png"
import { IoSendOutline } from "react-icons/io5"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import EmailLink from "./public-ui/EmailLink"

export default function Footer() {
    return (
        <footer className="w-full py-10 md:py-16 flex items-center justify-center bg-[url('/img/footer-bg-blurred.png')] bg-cover bg-center">
            <div
                className={`
                w-11/12 h-fit flex
                flex-col gap-6 px-4
                lg:flex-row lg:justify-between lg:gap-8 lg:px-0
                `}
            >
                <div>
                    <Image
                        src={RTFLogoWhite}
                        alt="logo"
                        className="w-[140px] md:w-[200px]"
                    />
                    <div className="text-white text-xs max-w-[270px] pl-5">
                        Return to Freedom is a 501(c)3 nonprofit organization
                        and depends on the kind and generous donations of people
                        like you to keep our wild horses and burros fed, as well
                        as to continue our invaluable work in legislation,
                        lobbying, and hands-on rescue.
                    </div>
                </div>

                <div className="grow flex items-start justify-start">
                    <div className="w-full max-w-[700px] flex flex-col items-start justify-between gap-6 lg:gap-8">
                        <div
                            className={`
                            w-full
                            grid grid-cols-2 gap-4
                            sm:flex sm:flex-row sm:grow sm:items-start sm:justify-between sm:gap-8
                            `}
                        >
                            <div className="grow basis-auto">
                                <div className="text-white font-serif text-[25px]">
                                    About RTF
                                </div>
                                <div className="text-white text-[12px] flex flex-col gap-[2px]">
                                    <Link
                                        href="/horses/our-horses"
                                        className="hover:underline"
                                    >
                                        Our Horses
                                    </Link>
                                    <Link
                                        href="/about/people"
                                        className="hover:underline"
                                    >
                                        Our Team
                                    </Link>
                                    <Link
                                        href="/about/people/opportunities"
                                        className="hover:underline"
                                    >
                                        Opportunities
                                    </Link>
                                </div>
                            </div>

                            <div className="grow basis-auto">
                                <div className="text-white font-serif text-[25px]">
                                    Act Now
                                </div>
                                <div className="text-white text-[12px] flex flex-col gap-[2px]">
                                    <Link
                                        href="/donate/sponsor-a-horse"
                                        className="hover:underline"
                                    >
                                        Sponsor a Horse
                                    </Link>
                                    <Link
                                        href="/visit-us"
                                        className="hover:underline"
                                    >
                                        Visit Us
                                    </Link>
                                    <Link
                                        href="/what-we-do/advocacy#take-action"
                                        className="hover:underline"
                                    >
                                        Take Action
                                    </Link>
                                    <Link
                                        target="_blank"
                                        href="https://shop.returntofreedom.org"
                                        className="hover:underline flex items-center gap-1"
                                        onClick={() => trackEvent(AnalyticsEvents.SHOP_LINK_CLICKED)}
                                    >
                                        Shop
                                        <FaExternalLinkAlt
                                            size={12}
                                            className="inline-block"
                                        />
                                    </Link>
                                </div>
                            </div>

                            <div className="grow basis-auto">
                                <div className="text-white font-serif text-[25px]">
                                    What We Do
                                </div>
                                <div className="text-white text-[12px] flex flex-col gap-[2px]">
                                    <Link
                                        href="/what-we-do/conservation"
                                        className="hover:underline"
                                    >
                                        Conservation
                                    </Link>
                                    <Link
                                        href="/what-we-do/advocacy"
                                        className="hover:underline"
                                    >
                                        Advocacy
                                    </Link>
                                    <Link
                                        href="/what-we-do/sanctuary"
                                        className="hover:underline"
                                    >
                                        Sanctuary
                                    </Link>
                                    <Link
                                        href="/what-we-do/education"
                                        className="hover:underline"
                                    >
                                        Education
                                    </Link>
                                </div>
                            </div>

                            <div className="grow basis-auto">
                                <div className="text-white font-serif text-[25px]">
                                    Explore
                                </div>
                                <div className="text-white text-[12px] flex flex-col gap-[2px]">
                                    <Link
                                        href="/resources/news"
                                        className="hover:underline"
                                    >
                                        News
                                    </Link>
                                    <Link
                                        href="/resources/learn"
                                        className="hover:underline"
                                    >
                                        Learn
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`
                            w-full flex
                            flex-row items-center justify-center gap-8
                            sm:gap-12`}
                        >
                            <Image
                                src={CharityNavigator}
                                alt="Charity Navigator"
                                className="h-[60px] sm:h-[80px] md:h-[100px] w-auto"
                            />
                            <Image
                                src={OnePercent}
                                alt="1% for the Planet"
                                className="h-[60px] sm:h-[80px] md:h-[100px] w-auto"
                            />
                            <Image
                                src={NatureDefense}
                                alt="Nature Defense Foundation"
                                className="h-[60px] sm:h-[80px] md:h-[100px] w-auto"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-4">
                    <div className="text-white text-[25px] font-serif underline underline-offset-[4px] decoration-1">
                        Connect with Us
                    </div>

                    <div className="text-white text-[12px]">
                        <EmailLink className="text-white text-[12px]">info@returntofreedom.org</EmailLink>
                        <div>(805) 737-9246</div>
                        <div>PO Box 926, Lompoc, CA 93438 USA</div>
                    </div>

                    <div className="flex items-center justify-start gap-3 text-white">
                        <SocialLinks />
                        <Link href="/contact">
                            <MdOutlineEmail size={30} />
                        </Link>
                    </div>

                    {/*<div>
                        <div className="text-white text-[12px] mb-1">
                            Subscribe to receive updates about our work
                        </div>
                        <div className="w-full h-8 flex border-1 border-white rounded-sm text-white">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full h-full border-r-1 border-white p-2 text-white" />
                            <button className="h-full aspect-square flex items-center justify-center text-white rounded-sm p-2">
                                <IoSendOutline size={12} className="inline-block" />
                            </button>
                        </div>
                    </div>*/}
                </div>
            </div>
        </footer>
    )
}
