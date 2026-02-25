"use client"

import Image from "next/image"
import Link from "next/link"

import RTFLogoWhite from "@/public/img/rtf_logo_white.svg"
import { IoMdClose, IoMdMenu } from "react-icons/io"
import { useState } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

type NavSubpage = {
    label: string
    href: string
    description: string
    image: string
}

type NavDropdownConfig = {
    label: string
    href: string
    subpages: NavSubpage[]
}

const dropdownConfigs: NavDropdownConfig[] = [
    {
        label: "About",
        href: "/about",
        subpages: [
            {
                label: "Our People",
                href: "/about/people",
                description: "Meet the dedicated team behind Return to Freedom — staff, board members, and volunteers who make our mission possible.",
                image: "/img/about_hero.jpg",
            },
{
                label: "Our Storytellers",
                href: "/about/our-storytellers",
                description: "Photographers, filmmakers, and writers who share the beauty and spirit of wild horses with the world.",
                image: "/img/neda-and-spirit.jpg",
            },
        ],
    },
    {
        label: "What We Do",
        href: "/#what-we-do",
        subpages: [
            {
                label: "Sanctuary",
                href: "/what-we-do/sanctuary",
                description: "Our sanctuary provides a safe haven where wild horses can live freely in natural herd structures.",
                image: "/img/bros-chilling.png",
            },
            {
                label: "Conservation",
                href: "/what-we-do/conservation",
                description: "Protecting the genetic diversity and ecological role of wild horses on public and private lands.",
                image: "/img/ares-mares.jpg",
            },
            {
                label: "Education",
                href: "/what-we-do/education",
                description: "Programs that inspire understanding of wild horses and their importance to the American landscape.",
                image: "/img/grazing-brown-horses-e1721864397332.png",
            },
            {
                label: "Advocacy",
                href: "/what-we-do/advocacy",
                description: "Working to shape policy and legislation that safeguards wild horses and their habitats.",
                image: "/img/Owyhee-9925-scaled.jpg",
            },
        ],
    },
    {
        label: "Our Horses",
        href: "/horses/our-horses",
        subpages: [
            {
                label: "Our Horses",
                href: "/horses/our-horses",
                description: "Browse the wild horses living at our sanctuary — each with a unique story.",
                image: "/img/bros-chilling.png",
            },
            {
                label: "Our Burros",
                href: "/horses/our-burros",
                description: "Meet the wild burros at Return to Freedom, resilient and full of personality.",
                image: "/img/ares-mares.jpg",
            },
            {
                label: "Our Herds",
                href: "/horses/our-herds",
                description: "Learn about the distinct herds at Return to Freedom, representing different wild horse populations.",
                image: "/img/ares-mares.jpg",
            },
            {
                label: "Sponsor a Horse",
                href: "/donate/sponsor-a-horse",
                description: "Support a wild horse's care with a sponsorship — a meaningful way to make a difference.",
                image: "/img/grazing-brown-horses-e1721864397332.png",
            },
        ],
    },
    {
        label: "Visit Us",
        href: "/visit-us",
        subpages: [
            {
                label: "Programs",
                href: "/visit-us",
                description: "Explore our visiting programs and experiences at the sanctuary on California's Central Coast.",
                image: "/img/bros-chilling.png",
            },
            {
                label: "Events",
                href: "/visit-us/events",
                description: "Browse upcoming events, workshops, and special gatherings at Return to Freedom.",
                image: "/img/ares-mares.jpg",
            },
            {
                label: "Host Your Event",
                href: "/visit-us/host-your-event",
                description: "Host your wedding, fundraiser, retreat, or private gathering at our beautiful sanctuary.",
                image: "/img/wedding_gallery_1.jpg",
            },
        ],
    },
]

const getDropdownConfig = (label: string) =>
    dropdownConfigs.find((c) => c.label === label)

const HeaderLink = (props: {
    href: string
    text: string
    external?: boolean
    onClick?: () => void
}) => {
    return (
        <Link
            href={props.href}
            className="relative no-wrap group/link text-white text-[16px] font-semibold"
            target={props.external ? "_blank" : undefined}
            rel={props.external ? "noopener noreferrer" : undefined}
            onClick={props.onClick}
        >
            <div
                className="absolute bottom-0 left-0
                right-0 h-0.5 bg-white scale-x-0 group-hover/link:scale-x-100
                transition-transform origin-center"
            />
            {props.text}
        </Link>
    )
}

const DropdownNavItem = ({ config, align = "left" }: { config: NavDropdownConfig, align?: "left" | "right" }) => {
    const [hoveredIndex, setHoveredIndex] = useState(0)
    const safeIndex = Math.min(hoveredIndex, config.subpages.length - 1)
    const active = config.subpages[safeIndex]

    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger
                className="bg-transparent! text-white! text-[16px]! font-semibold!
                    hover:bg-transparent! focus:bg-transparent!
                    data-[state=open]:bg-transparent!
                    px-0! py-0! h-auto! rounded-none!"
            >
                <Link href={config.href} className="relative no-wrap group/link">
                    <div
                        className="absolute bottom-0 left-0
                        right-0 h-0.5 bg-white scale-x-0 group-hover/link:scale-x-100
                        transition-transform origin-center"
                    />
                    {config.label}
                </Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent
                className={`bg-white! border-none! rounded-lg! shadow-xl! ${align === "right" ? "right-0! left-auto!" : ""}`}
            >
                <div className="grid grid-cols-[180px_1fr_160px] gap-4 p-5 w-[540px]">
                    <div className="flex flex-col gap-2">
                        {config.subpages.map((subpage, i) => (
                            <Link
                                key={subpage.href}
                                href={subpage.href}
                                onMouseEnter={() => setHoveredIndex(i)}
                                className={`text-sm py-1.5 px-2 rounded transition-colors ${
                                    i === safeIndex
                                        ? "text-pewter bg-pewter/10 font-semibold"
                                        : "text-pewter/70 hover:text-pewter hover:bg-pewter/10"
                                }`}
                            >
                                {subpage.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 px-2">
                        <h3 className="text-pewter font-serif font-semibold text-sm">
                            {active.label}
                        </h3>
                        <p className="text-pewter/70 text-xs leading-relaxed font-normal">
                            {active.description}
                        </p>
                    </div>

                    <div className="relative rounded overflow-hidden">
                        <Image
                            src={active.image}
                            alt={active.label}
                            fill
                            className="object-cover"
                            sizes="160px"
                        />
                    </div>
                </div>
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}

const MobileHeaderLink = (props: {
    href: string
    text: string
    onClick: () => void
}) => {
    return (
        <Link
            href={props.href}
            className="relative text-white "
            onClick={props.onClick}
        >
            {props.text}
        </Link>
    )
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const leftNavItems = [
        { label: "About", href: "/about" },
        { label: "What We Do", href: "/#what-we-do" },
        { label: "Learn", href: "/resources/learn" },
        { label: "News", href: "/resources/news" },
        { label: "Our Horses", href: "/horses/our-horses" },
    ]

    return (
        <header
            className={`
            w-full h-fit bg-pewter max-w-screen font-bold relative z-50
            xl:h-[135px]
            `}
        >
            <NavigationMenu
                viewport={false}
                className={`
                w-full hidden py-2 px-[5%] max-w-none!
                xl:flex xl:items-center xl:gap-6 xl:px-[3%]
                `}
            >
                <NavigationMenuList className="flex-1 flex items-center justify-end gap-4 xl:gap-6">
                    {leftNavItems.map((item) => {
                        const config = getDropdownConfig(item.label)
                        if (config) {
                            return (
                                <DropdownNavItem
                                    key={item.label}
                                    config={config}
                                />
                            )
                        }
                        return (
                            <NavigationMenuItem key={item.label}>
                                <HeaderLink
                                    href={item.href}
                                    text={item.label}
                                />
                            </NavigationMenuItem>
                        )
                    })}
                </NavigationMenuList>

                <div className="w-[180px] flex justify-center">
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src={RTFLogoWhite}
                            alt="logo"
                            width={180}
                            height={114}
                        />
                    </Link>
                </div>

                <NavigationMenuList className="flex-1 flex items-center justify-start gap-4 xl:gap-6">
                    <NavigationMenuItem>
                        <HeaderLink
                            href="/what-we-do/advocacy#take-action"
                            text="Take Action"
                        />
                    </NavigationMenuItem>
                    <DropdownNavItem config={getDropdownConfig("Visit Us")!} align="right" />
                    <NavigationMenuItem>
                        <HeaderLink
                            href="https://shop.returntofreedom.org"
                            text="Shop"
                            external
                            onClick={() =>
                                trackEvent(AnalyticsEvents.SHOP_LINK_CLICKED)
                            }
                        />
                    </NavigationMenuItem>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/donate"
                            className={`rounded-lg bg-cinnamon border-1 border-cinnamon w-[100px] flex items-center
                                    justify-center py-1 text-white text-sm`}
                        >
                            DONATE
                        </Link>

                        <Link
                            href="/contact"
                            className={`rounded-lg border-1 border-white w-[100px] flex items-center
                                    justify-center py-1 text-white text-sm`}
                        >
                            SUBSCRIBE
                        </Link>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Tablet nav: logo + text links left, buttons + hamburger right */}
            <NavigationMenu
                viewport={false}
                className="
                hidden w-full max-w-none! py-2 px-4
                sm:flex sm:items-center sm:justify-between
                xl:hidden
                "
            >
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src={RTFLogoWhite}
                            alt="logo"
                            className="w-[90px] h-[57px]"
                            width={180}
                            height={114}
                        />
                    </Link>
                    <NavigationMenuList className="flex items-center gap-4">
                        <div className="hidden lg:flex lg:items-center lg:gap-4">
                            <DropdownNavItem config={getDropdownConfig("About")!} />
                            <DropdownNavItem config={getDropdownConfig("What We Do")!} />
                            <DropdownNavItem config={getDropdownConfig("Our Horses")!} />
                        </div>
                        <NavigationMenuItem>
                            <HeaderLink
                                href="/what-we-do/advocacy#take-action"
                                text="Take Action"
                            />
                        </NavigationMenuItem>
                        <DropdownNavItem config={getDropdownConfig("Visit Us")!} />
                        <NavigationMenuItem>
                            <HeaderLink
                                href="https://shop.returntofreedom.org"
                                text="Shop"
                                external
                                onClick={() =>
                                    trackEvent(AnalyticsEvents.SHOP_LINK_CLICKED)
                                }
                            />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/donate"
                        className="rounded-lg bg-cinnamon border-1 border-cinnamon w-[100px] flex items-center
                            justify-center py-1 text-white text-sm"
                    >
                        DONATE
                    </Link>
                    <Link
                        href="/contact"
                        className="rounded-lg border-1 border-white w-[100px] flex items-center
                            justify-center py-1 text-white text-sm"
                    >
                        SUBSCRIBE
                    </Link>
                    <button
                        aria-label="open menu"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <IoMdMenu size={30} className="text-seashell" />
                    </button>
                </div>
            </NavigationMenu>

            {/* Mobile nav: logo + donate + hamburger */}
            <nav
                className="
                sm:hidden
                flex flex-row items-center justify-between
                top-0 left-0 w-screen p-2
                "
            >
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src={RTFLogoWhite}
                        alt="logo"
                        className="w-[90px] h-[57px]"
                        width={180}
                        height={114}
                    />
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/donate"
                        className={`rounded-lg bg-cinnamon border-1 border-cinnamon w-[100px] flex items-center
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
                    transform: isMobileMenuOpen
                        ? "translateX(0)"
                        : "translateX(110vw)",
                    visibility: isMobileMenuOpen ? "visible" : "hidden",
                    transition: isMobileMenuOpen
                        ? "transform 300ms ease-in-out, visibility 0s"
                        : "transform 300ms ease-in-out, visibility 0s 300ms",
                }}
            >
                <div className="absolute top-6 right-4">
                    <button
                        aria-label="close menu"
                        className="pr-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <IoMdClose
                            className={`
                                text-seashell ${!isMobileMenuOpen && "animate-spin"}
                                text-[30px]
                                md:text-[60px]
                            `}
                        />
                    </button>
                </div>

                <div
                    className="
                        absolute left-6 bottom-6 flex flex-col items-start justify-end
                        font-serif font-base underline underline-offset-4
                        gap-4 text-lg
                        md:text-4xl md:p-16 md:gap-6"
                >
                    <MobileHeaderLink
                        href="/about"
                        text="About"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileHeaderLink
                        href="/#what-we-do"
                        text="What We Do"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileHeaderLink
                        href="/resources/learn"
                        text="Learn"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileHeaderLink
                        href="/resources/news"
                        text="News"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileHeaderLink
                        href="/horses/our-horses"
                        text="Our Horses"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileHeaderLink
                        href="/take-action"
                        text="Take Action"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileHeaderLink
                        href="/visit-us"
                        text="Visit Us"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                </div>
            </div>
        </header>
    )
}
