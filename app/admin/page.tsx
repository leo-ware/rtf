"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FileText,
    Calendar,
    Camera,
    Users,
    Heart,
    Building2,
    ArrowRight,
    Newspaper,
    TrendingUp
} from "lucide-react"

const AdminPage = () => {
    // Fetch counts efficiently using aggregates
    const counts = useQuery(api.counts.getDashboardCounts)
    // Still need events for upcoming events calculation
    const events = useQuery(api.events.getAllEvents)

    const quickLinks = [
        {
            title: "News & Articles",
            description: "Manage articles and external news coverage",
            href: "/admin/news",
            icon: FileText,
            color: "bg-blue-500",
            stats: counts !== undefined ? `${counts.articles} total` : undefined
        },
        {
            title: "Events",
            description: "Schedule and manage upcoming events",
            href: "/admin/events",
            icon: Calendar,
            color: "bg-purple-500",
            stats: counts !== undefined ? `${counts.events} events` : undefined
        },
        {
            title: "Animals",
            description: "Manage sanctuary animals and their profiles",
            href: "/admin/animals",
            icon: Heart,
            color: "bg-rose-500",
            stats: counts !== undefined ? `${counts.animals} animals` : undefined
        },
        {
            title: "Media Library",
            description: "Upload and organize images",
            href: "/admin/images",
            icon: Camera,
            color: "bg-amber-500",
            stats: counts !== undefined ? `${counts.images} images` : undefined
        },
        {
            title: "People",
            description: "Team members and advisory board",
            href: "/admin/people",
            icon: Users,
            color: "bg-green-500",
            stats: counts !== undefined ? `${counts.people} people` : undefined
        },
        {
            title: "Sponsors",
            description: "Manage sponsor logos and links",
            href: "/admin/sponsors",
            icon: Building2,
            color: "bg-indigo-500",
            stats: counts !== undefined ? `${counts.sponsors} sponsors` : undefined
        }
    ]

    const totalArticles = counts?.articles ?? 0
    const upcomingEvents = events?.filter(e => new Date(e.startDate) > new Date()).length ?? 0

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">Welcome to the Admin Dashboard</h2>
                    <p className="text-blue-100 max-w-2xl">
                        Manage your sanctuary&apos;s content, events, and media from one central location.
                        Use the quick links below to navigate to different sections.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Newspaper className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalArticles}</p>
                                <p className="text-sm text-gray-500">Articles</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcomingEvents}</p>
                                <p className="text-sm text-gray-500">Upcoming Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <Heart className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{counts?.animals ?? 0}</p>
                                <p className="text-sm text-gray-500">Animals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Camera className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{counts?.images ?? 0}</p>
                                <p className="text-sm text-gray-500">Images</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links Grid */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                        <Link key={link.href} href={link.href}>
                            <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl ${link.color}`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <CardTitle className="text-lg mt-4">{link.title}</CardTitle>
                                    <CardDescription>{link.description}</CardDescription>
                                </CardHeader>
                                {link.stats && (
                                    <CardContent className="pt-0">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <TrendingUp className="h-4 w-4 mr-1" />
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
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use the <strong>News</strong> section to publish articles and link external press coverage</li>
                    <li>• Upload images to the <strong>Media Library</strong> before using them in articles or animal profiles</li>
                    <li>• Keep animal profiles updated with recent photos and status information</li>
                    <li>• Schedule events in advance to give visitors time to plan their visits</li>
                </ul>
            </div>
        </div>
    )
}

export default AdminPage
