"use client"

import Image from "next/image"
import Link from "next/link"

import RTFLogoWhite from "@/public/img/rtf_logo_white.svg"
import { IoMdClose, IoMdMenu } from "react-icons/io"
import { useState } from "react"


const HeaderLink = (props: { href: string, text: string }) => {
    return (
        <Link href={props.href} className="relative group text-white text-md font-semibold">
            <div className="absolute bottom-0 left-[10px]
                right-[-8px] h-0.5 bg-white scale-x-0 group-hover:scale-x-100
                transition-transform origin-left" />
            {props.text}
        </Link>
    )
}

const MobileHeaderLink = (props: { href: string, text: string, onClick: () => void }) => {
    return (
        <Link href={props.href} className="relative text-white text-lg" onClick={props.onClick}>
            {props.text}
        </Link>
    )
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="bg-pewter max-w-screen w-full h-fit font-bold">
            <nav className="w-full hidden md:block">
                <div className="w-full flex items-center py-2 px-[10%]">
                    <div className="flex-1 flex items-center justify-around">
                        <HeaderLink href="/about" text="About" />
                        <HeaderLink href="/what-we-do" text="What We Do" />
                        <HeaderLink href="/" text="Learn" />
                        <HeaderLink href="/news" text="News" />
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
            <div className="block md:hidden h-[60px] w-full" />
            <nav className="block md:hidden fixed bg-pewter z-40 top-0 left-0 w-screen p-2 flex flex-row items-center justify-between">
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src={RTFLogoWhite}
                        alt="logo"
                        className="w-[90px] h-[57px]"
                        width={180} height={114} />
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/donate"
                        className={`rounded-lg bg-burnt-orange border-1 border-burnt-orange w-[100px] flex items-center 
                                    justify-center py-1 text-white text-sm`}
                    >
                        DONATE
                    </Link>

                    <button
                        aria-label="open menu"
                        className="pr-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <IoMdMenu size={30} className="text-seashell" />
                    </button>
                </div>
            </nav>

            <div
                className="z-50 bg-pewter w-screen h-screen fixed top-0 left-0"
                style={{
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(110vw)",
                    transition: "transform 0.3s ease-in-out",
                }}
            >

                <div className="absolute top-6 right-4">
                    <button
                        aria-label="close menu"
                        className="pr-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <IoMdClose
                            size={30}
                            className={`text-seashell ${!isMobileMenuOpen && 'animate-spin'}`}
                        />
                    </button>
                </div>

                <div className="absolute left-6 bottom-6 flex flex-col items-start justify-end gap-4">
                    <MobileHeaderLink href="/about" text="About" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileHeaderLink href="/what-we-do" text="What We Do" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileHeaderLink href="/" text="Learn" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileHeaderLink href="/news" text="News" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileHeaderLink href="/" text="Our Horses" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileHeaderLink href="/" text="Take Action" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileHeaderLink href="/" text="Visit Us" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
            </div>
        </header>
    )
}
