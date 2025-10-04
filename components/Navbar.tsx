"use client"

import Image from "next/image"
import Link from "next/link"
import { FaAngleDown } from "react-icons/fa"
import Button from "@/components/Button"

import RTFLogoWhite from "@/public/img/rtf_logo_white.svg"


const HeaderLink = (props: { href: string, text: string }) => {
    return (
        <Link href={props.href} className="relative group text-white text-sm">
            <div className="absolute bottom-0 left-[10px]
                right-[-8px] h-0.5 bg-white scale-x-0 group-hover:scale-x-100
                transition-transform origin-left" />
            {props.text}
        </Link>
    )
}

export default function Navbar() {
    return (
        <header className="bg-pewter max-w-screen w-full h-fit font-bold">
            <nav className="w-full hidden md:block">
                <div className="w-full flex items-center py-2 px-[10%]">
                    <div className="flex-1 flex items-center justify-around">
                        <HeaderLink href="/" text="About" />
                        <HeaderLink href="/" text="What We Do" />
                        <HeaderLink href="/" text="Learn" />
                        <HeaderLink href="/" text="News" />
                        <HeaderLink href="/" text="Our Horses" />
                    </div>
                    <div className="w-[180px] flex justify-center">
                        <Link href="/" className="flex-shrink-0">
                            <Image src={RTFLogoWhite} alt="logo" width={180} height={114} />
                        </Link>
                    </div>
                    <div className="flex-1 flex items-center justify-around">
                        <HeaderLink href="/" text="Take Action" />
                        <HeaderLink href="/" text="Visit Us" />

                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className={`rounded-lg bg-burnt-orange border-1 border-burnt-orange w-[100px] flex items-center 
                                    justify-center py-1 text-white text-sm`}
                            >
                                DONATE
                            </Link>

                            <Link
                                href="/"
                                className={`rounded-lg border-1 border-white w-[100px] flex items-center 
                                    justify-center py-1 text-white text-sm`}
                            >
                                SUBSCRIBE
                            </Link>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="w-full p-2 block md:hidden flex flex-row items-center justify-between">
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src={RTFLogoWhite}
                        alt="logo"
                        className="w-[90px] h-[57px]"
                        width={180} height={114} />
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className={`rounded-lg bg-burnt-orange border-1 border-burnt-orange w-[100px] flex items-center 
                                    justify-center py-1 text-white text-sm`}
                    >
                        DONATE
                    </Link>

                    <Link
                        href="/"
                        className={`rounded-lg border-1 border-white w-[100px] flex items-center 
                                    justify-center py-1 text-white text-sm`}
                    >
                        SUBSCRIBE
                    </Link>
                </div>

            </nav>
        </header>
    )
}
