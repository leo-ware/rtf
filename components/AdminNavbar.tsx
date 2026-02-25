"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProfileDropdown from "@/components/ProfileDropdown"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Home,
    FileText,
    Calendar,
    Camera,
    Users,
    Shield,
    BookOpen,
    Menu,
    X,
    Heart,
    Code,
    Building2,
    FolderOpen,
    Megaphone,
    MapPin,
    Layers,
    Package,
    UserCog,
    LayoutDashboard,
    Mail,
    Gift,
    HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    href: string
    icon: React.ElementType
    description?: string
    requiresAdmin?: boolean
    badge?: string
}

interface NavGroup {
    name: string
    icon: React.ElementType
    items: NavItem[]
}

const AdminNavbar = () => {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const currentUser = useQuery(api.users.current)
    const hasAdminAccess = currentUser?.atLeastAdmin ?? false

    const overviewItems: NavItem[] = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: Home,
            description: "Overview and statistics"
        },
        {
            name: "Help",
            href: "/admin/help",
            icon: HelpCircle,
            description: "Guides and documentation"
        },
    ]

    const contentItems: NavItem[] = [
        {
            name: "News",
            href: "/admin/news",
            icon: FileText,
            description: "Manage articles and announcements"
        },
        {
            name: "Education Articles",
            href: "/admin/education-articles",
            icon: BookOpen,
            description: "Manage education page content"
        },
        {
            name: "Take Action Articles",
            href: "/admin/take-action-articles",
            icon: Megaphone,
            description: "Manage Take Action section content"
        },
        {
            name: "Learn Timelines",
            href: "/admin/learn-timelines",
            icon: BookOpen,
            description: "Manage learn page timelines"
        },
    ]

    const entityItems: NavItem[] = [
        {
            name: "People",
            href: "/admin/people",
            icon: Users,
            description: "Manage team member public profiles"
        },
        {
            name: "Sponsors",
            href: "/admin/sponsors",
            icon: Building2,
            description: "Manage sponsors and partners"
        },
        {
            name: "Animals",
            href: "/admin/animals",
            icon: Heart,
            description: "Manage animal profiles"
        },
        {
            name: "Locations",
            href: "/admin/locations",
            icon: MapPin,
            description: "Manage venue locations"
        },
    ]

    const donationItems: NavItem[] = [
        {
            name: "Donation Forms",
            href: "/admin/donation-forms",
            icon: FileText,
            description: "Manage Salsa Labs form configurations"
        },
        {
            name: "Donate Pathways",
            href: "/admin/donate-pathways",
            icon: Gift,
            description: "Manage donation pathway cards"
        },
    ]

    const calendarItems: NavItem[] = [
        {
            name: "Events",
            href: "/admin/events",
            icon: Calendar,
            description: "Schedule and manage events"
        },
    ]

    const assetsItems: NavItem[] = [
        {
            name: "Documents",
            href: "/admin/documents",
            icon: FolderOpen,
            description: "Upload and organize documents"
        },
        {
            name: "Media",
            href: "/admin/images",
            icon: Camera,
            description: "Image and media library"
        },
    ]

    const managementItems: NavItem[] = [
        {
            name: "Messages",
            href: "/admin/contact-messages",
            icon: Mail,
            description: "Contact form submissions"
        },
        {
            name: "Developer",
            href: "/admin/dev",
            icon: Code,
            description: "Developer tools and settings"
        },
        ...(hasAdminAccess ? [{
            name: "Users",
            href: "/admin/users",
            icon: Shield,
            description: "User accounts and permissions"
        }] : [])
    ]

    const navGroups: NavGroup[] = [
        { name: "Overview", icon: LayoutDashboard, items: overviewItems },
        { name: "Content", icon: Layers, items: contentItems },
        { name: "Entities", icon: Users, items: entityItems },
        { name: "Donations", icon: Heart, items: donationItems },
        { name: "Calendar", icon: Calendar, items: calendarItems },
        { name: "Assets", icon: Package, items: assetsItems },
        { name: "Management", icon: UserCog, items: managementItems },
    ]

    const allNavItems = navGroups.flatMap(group => group.items)

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin"
        }
        if (href === "/admin/dev") {
            return pathname === "/admin/dev" || pathname.startsWith("/admin/dev/")
        }
        if (href === "/admin/help") {
            return pathname === "/admin/help" || pathname.startsWith("/admin/help/")
        }
        return pathname.startsWith(href)
    }

    const isGroupActive = (items: NavItem[]) => {
        return items.some(item => isActive(item.href))
    }

    const getCurrentPageTitle = () => {
        const currentItem = allNavItems.find(item => isActive(item.href))
        if (currentItem) {
            return {
                title: currentItem.name,
                description: currentItem.description
            }
        }

        // Handle special cases
        if (pathname.includes("/profile")) {
            return { title: "Profile Settings", description: "Manage your account" }
        }
        if (pathname.includes("/pages")) {
            return { title: "Pages", description: "Website content" }
        }
        if (pathname.includes("/bootstrap")) {
            return { title: "Bootstrap", description: "System setup" }
        }
        if (pathname.includes("/errors")) {
            return { title: "Error", description: "Something went wrong" }
        }
        if (pathname.startsWith("/admin/help/")) {
            return { title: "Help Article", description: "Guides and documentation" }
        }

        return { title: "Admin", description: "Administration panel" }
    }

    const { title, description } = getCurrentPageTitle()

    return (
        <div className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Header */}
                <div className="flex justify-between items-center py-4">
                    {/* Left Section - Title & Breadcrumb */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>

                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
                            {description && (
                                <p className="text-gray-600 mt-1 text-sm lg:text-base">{description}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        <Link href="/" className="hidden sm:block">
                            <Button variant="outline" size="sm">
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span className="hidden md:inline">View Site</span>
                                <span className="md:hidden">Site</span>
                            </Button>
                        </Link>
                        <ProfileDropdown />
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:block pb-4">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {/* Navigation Groups */}
                            {navGroups.map((group) => {
                                const GroupIcon = group.icon
                                const groupActive = isGroupActive(group.items)

                                return (
                                    <NavigationMenuItem key={group.name}>
                                        <NavigationMenuTrigger className={cn(
                                            groupActive && "bg-accent"
                                        )}>
                                            <GroupIcon className="h-4 w-4 mr-2" />
                                            {group.name}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-1 p-2 md:w-[500px] md:grid-cols-2">
                                                {group.items.map((item) => {
                                                    const ItemIcon = item.icon
                                                    const active = isActive(item.href)

                                                    return (
                                                        <li key={item.href}>
                                                            <Link href={item.href} legacyBehavior passHref>
                                                                <NavigationMenuLink
                                                                    className={cn(
                                                                        "flex items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                                        active && "bg-accent"
                                                                    )}
                                                                >
                                                                    <ItemIcon className="h-5 w-5 mt-0.5 shrink-0" />
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="text-sm font-medium leading-none flex items-center gap-2">
                                                                            {item.name}
                                                                            {item.badge && (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    {item.badge}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        {item.description && (
                                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                                {item.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </NavigationMenuLink>
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <nav className="space-y-4">
                            {/* Grouped Navigation */}
                            {navGroups.map((group) => {
                                const GroupIcon = group.icon

                                return (
                                    <div key={group.name} className="space-y-1">
                                        <div className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <GroupIcon className="h-4 w-4" />
                                            <span>{group.name}</span>
                                        </div>
                                        {group.items.map((item) => {
                                            const ItemIcon = item.icon
                                            const active = isActive(item.href)

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={cn(
                                                        "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ml-2",
                                                        active
                                                            ? "bg-accent"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <ItemIcon className="h-5 w-5" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span>{item.name}</span>
                                                            {item.badge && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {item.description && (
                                                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                                        )}
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )
                            })}

                            {/* Mobile-only links */}
                            <div className="border-t pt-4 mt-4">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <BookOpen className="h-5 w-5" />
                                    <span>View Site</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminNavbar