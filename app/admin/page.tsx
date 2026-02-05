"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    FileText,
    Calendar,
    Camera,
    Users,
    Heart,
    Building2,
    ArrowRight,
    Newspaper,
    TrendingUp,
} from "lucide-react"

const AdminPage = () => {
    // Fetch counts efficiently using aggregates
    const counts = useQuery(api.aggregates.getDashboardCounts)
    // Still need events for upcoming events calculation
    const events = useQuery(api.events.getAllEvents)

    const quickLinks = [
        {
            title: "News & Articles",
            description: "Manage articles and external news coverage",
            href: "/admin/news",
            icon: FileText,
            stats:
                counts !== undefined ? `${counts.articles} total` : undefined,
        },
        {
            title: "Events",
            description: "Schedule and manage upcoming events",
            href: "/admin/events",
            icon: Calendar,
            stats: counts !== undefined ? `${counts.events} events` : undefined,
        },
        {
            title: "Animals",
            description: "Manage sanctuary animals and their profiles",
            href: "/admin/animals",
            icon: Heart,
            stats:
                counts !== undefined ? `${counts.animals} animals` : undefined,
        },
        {
            title: "Media Library",
            description: "Upload and organize images",
            href: "/admin/images",
            icon: Camera,
            stats: counts !== undefined ? `${counts.images} images` : undefined,
        },
        {
            title: "People",
            description: "Team members and advisory board",
            href: "/admin/people",
            icon: Users,
            stats: counts !== undefined ? `${counts.people} people` : undefined,
        },
        {
            title: "Sponsors",
            description: "Manage sponsor logos and links",
            href: "/admin/sponsors",
            icon: Building2,
            stats:
                counts !== undefined
                    ? `${counts.sponsors} sponsors`
                    : undefined,
        },
    ]

    const totalArticles = counts?.articles ?? 0
    const upcomingEvents =
        events?.filter((e) => new Date(e.startDate) > new Date()).length ?? 0

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl p-8 border border-neutral-200">
                    <h2 className="text-2xl font-bold mb-2 text-neutral-900">
                        Welcome to the Admin Dashboard
                    </h2>
                    <p className="text-neutral-700 max-w-2xl">
                        Manage your sanctuary&apos;s content, events, and media
                        from one central location. Use the quick links below to
                        navigate to different sections.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-neutral-200">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-neutral-100 rounded-lg border border-neutral-200">
                                <Newspaper className="h-5 w-5 text-neutral-900" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {totalArticles}
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Articles
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-neutral-100 rounded-lg border border-neutral-200">
                                <Calendar className="h-5 w-5 text-neutral-900" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {upcomingEvents}
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Upcoming Events
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-neutral-100 rounded-lg border border-neutral-200">
                                <Heart className="h-5 w-5 text-neutral-900" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {counts?.animals ?? 0}
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Animals
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-neutral-100 rounded-lg border border-neutral-200">
                                <Camera className="h-5 w-5 text-neutral-900" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {counts?.images ?? 0}
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Images
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links Grid */}
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Quick Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                        <Link key={link.href} href={link.href}>
                            <Card className="h-full border-neutral-200 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200">
                                            <Icon className="h-6 w-6 text-neutral-900" />
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-neutral-500 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <CardTitle className="text-lg mt-4 text-neutral-900">
                                        {link.title}
                                    </CardTitle>
                                    <CardDescription className="text-neutral-600">
                                        {link.description}
                                    </CardDescription>
                                </CardHeader>
                                {link.stats && (
                                    <CardContent className="pt-0">
                                        <div className="flex items-center text-sm text-neutral-600">
                                            <TrendingUp className="h-4 w-4 mr-1 text-neutral-900" />
                                            {link.stats}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {/* Tips Section */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">
                    Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700">
                    <li>
                        • Use the <strong>News</strong> section to publish
                        articles and link external press coverage
                    </li>
                    <li>
                        • Upload images to the <strong>Media Library</strong>{" "}
                        before using them in articles or animal profiles
                    </li>
                    <li>
                        • Keep animal profiles updated with recent photos and
                        status information
                    </li>
                    <li>
                        • Schedule events in advance to give visitors time to
                        plan their visits
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AdminPage
