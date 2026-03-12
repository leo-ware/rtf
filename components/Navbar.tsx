"use client"

import Image from "next/image"
import Link from "next/link"

import RTFLogoWhite from "@/public/img/rtf_logo_white.svg"
import { IoMdClose, IoMdMenu } from "react-icons/io"
import { IoChevronDown } from "react-icons/io5"
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
    children?: NavSubpage[]
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
                label: "About RTF",
                href: "/about",
                description: "Learn about Return to Freedom's mission to preserve and protect America's wild horses.",
                image: "/img/about_hero.jpg",
            },
            {
                label: "Our Team",
                href: "/about/people",
                description: "Meet the dedicated team behind Return to Freedom — staff, board members, and volunteers who make our mission possible.",
                image: "/img/neda-and-spirit.jpg",
            },
{
                label: "Our Storytellers",
                href: "/about/our-storytellers",
                description: "Photographers, filmmakers, and writers who share the beauty and spirit of wild horses with the world.",
                image: "/img/storytellers-dropdown.jpg",
            },
            {
                label: "Contact Us",
                href: "/contact",
                description: "Get in touch with Return to Freedom — we'd love to hear from you.",
                image: "/img/about_hero.jpg",
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
                image: "/img/sanctuary-dropdown.jpg",
            },
            {
                label: "Conservation",
                href: "/what-we-do/conservation",
                description: "Protecting the genetic diversity and ecological role of wild horses on public and private lands.",
                image: "/img/conservation-dropdown.jpg",
            },
            {
                label: "Education",
                href: "/what-we-do/education",
                description: "Programs that inspire understanding of wild horses and their importance to the American landscape.",
                image: "/img/education-dropdown.jpg",
            },
            {
                label: "Advocacy",
                href: "/what-we-do/advocacy",
                description: "Working to shape policy and legislation that safeguards wild horses and their habitats.",
                image: "/img/advocacy-dropdown.jpg",
                children: [
                    {
                        label: "Herd Management",
                        href: "/what-we-do/advocacy/herd-management",
                        description: "Designated Herd Management Areas balance wild horse populations with other public-land uses, but decades of over-allocation threaten the future of wild herds.",
                        image: "/img/advocacy-dropdown.jpg",
                    },
                    {
                        label: "Horse Slaughter",
                        href: "/what-we-do/advocacy/horse-slaughter",
                        description: "Though horse slaughter is banned in the U.S., thousands are still exported for slaughter each year. RTF advocates for lasting protections through the SAFE Act.",
                        image: "/img/advocacy-dropdown.jpg",
                    },
                    {
                        label: "Population Management",
                        href: "/what-we-do/advocacy/population-management",
                        description: "Humane, science-based fertility control can replace roundups, reduce costs, and allow wild herds to live naturally on the range.",
                        image: "/img/advocacy-dropdown.jpg",
                    },
                    {
                        label: "Roundups",
                        href: "/what-we-do/advocacy/roundups",
                        description: "Each year, thousands of wild horses and burros are chased by helicopters into traps on public lands, destroying family bands and costing taxpayers hundreds of millions.",
                        image: "/img/advocacy-dropdown.jpg",
                    },
                ],
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
                image: "/img/horses-dropdown.jpg",
            },
            {
                label: "Our Herds",
                href: "/horses/our-herds",
                description: "Learn about the distinct herds at Return to Freedom, representing different wild horse populations.",
                image: "/img/herds-dropdown.jpg",
            },
            {
                label: "Sponsor a Horse",
                href: "/donate/sponsor-a-horse",
                description: "Support a wild horse's care with a sponsorship — a meaningful way to make a difference.",
                image: "/img/sponsor-horse-dropdown.jpg",
            },
        ],
    },
    {
        label: "Our Burros",
        href: "/horses/our-burros",
        subpages: [
            {
                label: "Our Burros",
                href: "/horses/our-burros",
                description: "Meet the wild burros at Return to Freedom, resilient and full of personality.",
                image: "/img/ares-mares.jpg",
            },
            {
                label: "Sponsor a Burro",
                href: "/donate/sponsor-a-burro",
                description: "Support a wild burro's care with a sponsorship — a meaningful way to make a difference.",
                image: "/img/ares-mares.jpg",
            },
        ],
    },
    {
        label: "Learn",
        href: "/resources/learn",
        subpages: [
            {
                label: "Learn Hub",
                href: "/resources/learn",
                description: "Dive into the history, science, and policy behind America's wild horses and burros.",
                image: "/img/grazing-brown-horses-e1721864397332.png",
            },
            {
                label: "Resources",
                href: "/resources/learn/articles",
                description: "News, articles, and resources about wild horse conservation and advocacy.",
                image: "/img/ares-mares.jpg",
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
                image: "/img/programs-dropdown.jpg",
            },
            {
                label: "Events",
                href: "/visit-us/events",
                description: "Browse upcoming events, workshops, and special gatherings at Return to Freedom.",
                image: "/img/events-dropdown.jpg",
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
            className="relative whitespace-nowrap group/link text-white text-[16px] font-semibold"
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
    const [activeItem, setActiveItem] = useState<NavSubpage>(config.subpages[0])
    const [expandedParent, setExpandedParent] = useState<string | null>(null)

    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger
                className="bg-transparent! text-white! text-[16px]! font-semibold!
                    hover:bg-transparent! focus:bg-transparent!
                    data-[state=open]:bg-transparent!
                    px-0! py-0! h-auto! rounded-none!"
            >
                <Link href={config.href} className="relative whitespace-nowrap group/link">
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
                <div className="grid grid-cols-[180px_1fr_160px] gap-4 p-5 w-[600px]">
                    <div className="flex flex-col gap-1">
                        {config.subpages.map((subpage) => (
                            <div key={subpage.href}>
                                <Link
                                    href={subpage.href}
                                    onMouseEnter={() => {
                                        setActiveItem(subpage)
                                        setExpandedParent(subpage.children ? subpage.href : null)
                                    }}
                                    className={`flex items-center gap-1 text-sm py-1.5 px-2 rounded transition-colors ${
                                        activeItem.href === subpage.href
                                            ? "text-pewter bg-pewter/10 font-semibold"
                                            : "text-pewter/70 hover:text-pewter hover:bg-pewter/10"
                                    }`}
                                >
                                    {subpage.label}
                                    {subpage.children && (
                                        <IoChevronDown
                                            className={`text-[10px] transition-transform duration-200 ${
                                                expandedParent === subpage.href ? "rotate-180" : ""
                                            }`}
                                        />
                                    )}
                                </Link>
                                {subpage.children && expandedParent === subpage.href && (
                                    <div className="flex flex-col gap-0.5 ml-3 mt-0.5">
                                        {subpage.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onMouseEnter={() => setActiveItem(child)}
                                                className={`text-xs py-1 px-2 rounded transition-colors ${
                                                    activeItem.href === child.href
                                                        ? "text-pewter bg-pewter/10 font-semibold"
                                                        : "text-pewter/60 hover:text-pewter hover:bg-pewter/10"
                                                }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 px-2">
                        <h3 className="text-pewter font-serif font-semibold text-sm">
                            {activeItem.label}
                        </h3>
                        <p className="text-pewter/70 text-xs leading-relaxed font-normal">
                            {activeItem.description}
                        </p>
                    </div>

                    <div className="relative rounded overflow-hidden">
                        <Image
                            src={activeItem.image}
                            alt={activeItem.label}
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

const MobileNavSection = ({
    label,
    href,
    subpages,
    onNavigate,
    expanded,
    onToggle,
}: {
    label: string
    href: string
    subpages?: NavSubpage[]
    onNavigate: () => void
    expanded: boolean
    onToggle: () => void
}) => {
    if (!subpages || subpages.length === 0) {
        return (
            <MobileHeaderLink
                href={href}
                text={label}
                onClick={onNavigate}
            />
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <Link
                    href={href}
                    className="relative text-white"
                    onClick={onNavigate}
                >
                    {label}
                </Link>
                <button
                    onClick={onToggle}
                    aria-label={`${expanded ? "Collapse" : "Expand"} ${label}`}
                    className="text-white/60 hover:text-white transition-colors p-3 -m-2"
                >
                    <IoChevronDown
                        className={`text-sm transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                </button>
            </div>
            <div
                className={`flex flex-col gap-1.5 overflow-hidden transition-all duration-200 ${
                    expanded ? "max-h-[500px] mt-2 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                {subpages.map((sub) => (
                    <div key={sub.href} className="flex flex-col">
                        <Link
                            href={sub.href}
                            className="text-white/60 hover:text-white transition-colors pl-4 text-[0.85em]"
                            onClick={onNavigate}
                        >
                            {sub.label}
                        </Link>
                        {sub.children && (
                            <div className="flex flex-col gap-1 mt-1">
                                {sub.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className="text-white/40 hover:text-white transition-colors pl-8 text-[0.75em]"
                                        onClick={onNavigate}
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [expandedSection, setExpandedSection] = useState<string | null>(null)

    const leftNavItems = [
        { label: "About", href: "/about" },
        { label: "What We Do", href: "/#what-we-do" },
        { label: "Learn", href: "/resources/learn" },
        { label: "Our Horses", href: "/horses/our-horses" },
        { label: "Our Burros", href: "/horses/our-burros" },
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
                xl:flex xl:items-center xl:gap-4 xl:px-[3%]
                `}
            >
                <NavigationMenuList className="flex-1 flex items-center justify-end gap-3 xl:gap-4">
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

                <NavigationMenuList className="flex-1 flex items-center justify-start gap-3 xl:gap-4">
                    <NavigationMenuItem>
                        <HeaderLink
                            href="/what-we-do/advocacy#take-action"
                            text="Take Action"
                        />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <HeaderLink
                            href="/resources/news"
                            text="News"
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

                    <div className="flex items-center gap-4 whitespace-nowrap">
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
                            <NavigationMenuItem>
                                <HeaderLink href="/about" text="About" />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <HeaderLink href="/#what-we-do" text="What We Do" />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <HeaderLink href="/horses/our-horses" text="Our Horses" />
                            </NavigationMenuItem>
                        </div>
                        <NavigationMenuItem>
                            <HeaderLink
                                href="/what-we-do/advocacy#take-action"
                                text="Take Action"
                            />
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <HeaderLink href="/visit-us" text="Visit Us" />
                        </NavigationMenuItem>
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
                top-0 left-0 w-full p-2
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
                className="z-50 bg-pewter w-full h-screen fixed top-0 left-0"
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
                        absolute inset-0 top-16 flex flex-col items-start justify-end
                        font-serif font-base underline-offset-4
                        gap-3 text-lg overflow-y-auto overscroll-contain
                        px-6 pb-6
                        md:text-4xl md:px-16 md:pb-16 md:gap-5"
                >
                    <MobileNavSection
                        label="About"
                        href="/about"
                        subpages={getDropdownConfig("About")?.subpages}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                        expanded={expandedSection === "About"}
                        onToggle={() => setExpandedSection(expandedSection === "About" ? null : "About")}
                    />
                    <MobileNavSection
                        label="What We Do"
                        href="/#what-we-do"
                        subpages={getDropdownConfig("What We Do")?.subpages}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                        expanded={expandedSection === "What We Do"}
                        onToggle={() => setExpandedSection(expandedSection === "What We Do" ? null : "What We Do")}
                    />
                    <MobileNavSection
                        label="Learn"
                        href="/resources/learn"
                        subpages={getDropdownConfig("Learn")?.subpages}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                        expanded={expandedSection === "Learn"}
                        onToggle={() => setExpandedSection(expandedSection === "Learn" ? null : "Learn")}
                    />
                    <MobileNavSection
                        label="Our Horses"
                        href="/horses/our-horses"
                        subpages={getDropdownConfig("Our Horses")?.subpages}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                        expanded={expandedSection === "Our Horses"}
                        onToggle={() => setExpandedSection(expandedSection === "Our Horses" ? null : "Our Horses")}
                    />
                    <MobileNavSection
                        label="Our Burros"
                        href="/horses/our-burros"
                        subpages={getDropdownConfig("Our Burros")?.subpages}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                        expanded={expandedSection === "Our Burros"}
                        onToggle={() => setExpandedSection(expandedSection === "Our Burros" ? null : "Our Burros")}
                    />
                    <MobileHeaderLink
                        href="/take-action"
                        text="Take Action"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileHeaderLink
                        href="/resources/news"
                        text="News"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <MobileNavSection
                        label="Visit Us"
                        href="/visit-us"
                        subpages={getDropdownConfig("Visit Us")?.subpages}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                        expanded={expandedSection === "Visit Us"}
                        onToggle={() => setExpandedSection(expandedSection === "Visit Us" ? null : "Visit Us")}
                    />
                    <MobileHeaderLink
                        href="https://shop.returntofreedom.org"
                        text="Shop"
                        onClick={() => {
                            trackEvent(AnalyticsEvents.SHOP_LINK_CLICKED)
                            setIsMobileMenuOpen(false)
                        }}
                    />
                    <div className="flex items-center gap-3 pt-2">
                        <Link
                            href="/donate"
                            className="rounded-lg bg-cinnamon border-1 border-cinnamon px-5 py-1.5 text-white text-sm font-sans"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            DONATE
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-lg border-1 border-white px-5 py-1.5 text-white text-sm font-sans"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            SUBSCRIBE
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
