"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Users,
    FileText,
    DollarSign,
    Calendar,
    BarChart3,
    Heart,
    Camera,
    BookOpen,
    Shield,
    Loader2
} from "lucide-react"

// Helper function to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

// Helper function to calculate time ago
const timeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const weeks = Math.floor(diff / 604800000)
    const months = Math.floor(diff / 2629746000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    return `${months} month${months > 1 ? 's' : ''} ago`
}

// Helper function to get events scheduled this month
const getEventsThisMonth = (events: any[]) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime()
    
    return events.filter(event => 
        event.startDate >= startOfMonth && event.startDate <= endOfMonth
    ).length
}

// Helper function to get articles published this month
const getArticlesThisMonth = (articles: any[]) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime()
    
    return articles.filter(article => 
        article.publishedAt && 
        article.publishedAt >= startOfMonth && 
        article.publishedAt <= endOfMonth
    ).length
}

const AdminPage = () => {
    const hasAdminAccess = useQuery(api.userManagement.hasAdminAccess)
    const donationStats = useQuery(api.donations.getDonationStats)
    const allUsers = useQuery(api.userManagement.listUsers, { limit: 1000 })
    const allArticles = useQuery(api.articles.listArticles, { limit: 1000, publishedOnly: false })
    const allEvents = useQuery(api.events.getAllEvents)
    const recentDonations = useQuery(api.donations.getAllDonations, { limit: 10 })

    // Loading state
    if (hasAdminAccess === undefined || !donationStats || !allUsers || !allArticles || !allEvents || !recentDonations) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            </div>
        )
    }

    // Calculate stats
    const totalDonations = donationStats.totalAmount || 0
    const totalUsers = allUsers.length || 0
    const publishedArticles = allArticles.filter(article => article.published).length || 0
    const eventsThisMonth = getEventsThisMonth(allEvents)
    const articlesThisMonth = getArticlesThisMonth(allArticles)

    const stats = [
        {
            title: "Total Donations",
            value: formatCurrency(totalDonations),
            change: `${donationStats.totalCount} donations`,
            icon: DollarSign,
            description: "All time"
        },
        {
            title: "Active Users",
            value: totalUsers.toString(),
            change: `All registered users`,
            icon: Users,
            description: "Total count"
        },
        {
            title: "News Articles",
            value: publishedArticles.toString(),
            change: `+${articlesThisMonth} this month`,
            icon: FileText,
            description: "Published"
        },
        {
            title: "Events Scheduled",
            value: allEvents.length.toString(),
            change: `+${eventsThisMonth} this month`,
            icon: Calendar,
            description: "Total events"
        }
    ]

    // Generate recent activities
    const recentActivities = [
        // Recent donations
        ...recentDonations
            .filter(donation => donation.paymentStatus === "completed")
            .slice(0, 3)
            .map((donation, index) => ({
                id: `donation-${donation._id}`,
                type: "donation",
                message: `New donation of ${formatCurrency(donation.amount)} received${donation.isAnonymous ? '' : ` from ${donation.donorName}`}`,
                time: timeAgo(donation.completedAt || donation.createdAt),
                icon: Heart
            })),
        
        // Recent articles  
        ...allArticles
            .filter(article => article.published && article.publishedAt)
            .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
            .slice(0, 2)
            .map(article => ({
                id: `article-${article._id}`,
                type: "article",
                message: `New article '${article.title}' published`,
                time: timeAgo(article.publishedAt || 0),
                icon: FileText
            })),
        
        // Recent events
        ...allEvents
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 2)
            .map(event => ({
                id: `event-${event._id}`,
                type: "event",
                message: `${event.title} event scheduled for ${new Date(event.startDate).toLocaleDateString()}`,
                time: timeAgo(event.createdAt),
                icon: Calendar
            }))
    ].slice(0, 6) // Limit to 6 activities

    const baseQuickActions = [
        {
            title: "Manage Articles",
            description: "Create and edit news articles",
            icon: FileText,
            href: "/admin/news"
        },
        {
            title: "View Donations",
            description: "Track and manage donations",
            icon: DollarSign,
            href: "/admin/donations"
        },
        {
            title: "Volunteer Management",
            description: "Manage volunteer programs",
            icon: Users,
            href: "/admin/volunteers"
        },
        {
            title: "Event Planning",
            description: "Schedule and manage events",
            icon: Calendar,
            href: "/admin/events"
        },
        {
            title: "Media Library",
            description: "Upload and manage images",
            icon: Camera,
            href: "/admin/images"
        }
    ];

    const adminQuickActions = [
        {
            title: "User Management",
            description: "Manage user accounts and permissions",
            icon: Shield,
            href: "/admin/users"
        }
    ];

    const quickActions = hasAdminAccess === true
        ? [...baseQuickActions, ...adminQuickActions]
        : baseQuickActions;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Badge variant="secondary" className="text-green-600 bg-green-50">
                                    {stat.change}
                                </Badge>
                                <span>{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>
                                Latest updates from your organization
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <activity.icon className="h-4 w-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">{activity.message}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common administrative tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {quickActions.map((action, index) => (
                                    <Link key={index} href={action.href}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start h-auto p-4"
                                        >
                                            <action.icon className="h-4 w-4 mr-3" />
                                            <div className="text-left">
                                                <div className="font-medium">{action.title}</div>
                                                <div className="text-xs text-gray-500">{action.description}</div>
                                            </div>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organization Info */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Heart className="h-5 w-5 mr-2 text-red-500" />
                                RTF Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Dedicated to protecting and preserving wild horses and burros through
                                education, advocacy, and direct care.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>Educational Programs</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Camera className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>Photo Safaris</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>Volunteer Opportunities</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AdminPage
