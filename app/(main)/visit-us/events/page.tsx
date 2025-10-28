"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import EventCalendar from "@/components/EventCalendar"
import {
    Calendar as CalendarIcon,
    MapPin,
    Users,
    DollarSign,
    Clock,
    ExternalLink,
    Phone,
    Mail
} from "lucide-react"
import { format, isToday, isTomorrow, isThisWeek } from "date-fns"

const EventsPage = () => {
    const events = useQuery(api.events.getPublicEvents)

    const upcomingEvents = events?.filter(event => {
        const eventDate = new Date(event.startDate)
        return eventDate >= new Date()
    }).sort((a, b) => a.startDate - b.startDate) || []

    const todayEvents = upcomingEvents.filter(event => isToday(new Date(event.startDate)))
    const thisWeekEvents = upcomingEvents.filter(event => {
        const date = new Date(event.startDate)
        return isThisWeek(date) && !isToday(date)
    })

    const eventTypeColors: Record<string, string> = {
        tour: "bg-blue-100 text-blue-800",
        volunteer: "bg-green-100 text-green-800",
        photo_safari: "bg-purple-100 text-purple-800",
        educational: "bg-yellow-100 text-yellow-800",
        fundraising: "bg-red-100 text-red-800",
        other: "bg-gray-100 text-gray-800"
    }

    const eventTypeLabels: Record<string, string> = {
        tour: "Tour",
        volunteer: "Volunteer",
        photo_safari: "Photo Safari",
        educational: "Educational",
        fundraising: "Fundraising",
        other: "Other"
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-12">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Upcoming Events
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Join us for tours, volunteer opportunities, photo safaris, and educational programs at Return to Freedom Wild Horse Conservation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {upcomingEvents.length === 0 ? (
                    <div className="text-center py-16">
                        <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                        <p className="text-gray-600 mb-8">
                            Check back soon for new events and programs at RTF.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild>
                                <a href="/visit">Explore Other Ways to Visit</a>
                            </Button>
                            <Button asChild variant="outline">
                                <a href="/subscribe">Subscribe for Updates</a>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                                <div className="text-2xl font-bold text-blue-600">{todayEvents.length}</div>
                                <div className="text-sm text-gray-600">Today</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                                <div className="text-2xl font-bold text-orange-600">{thisWeekEvents.length}</div>
                                <div className="text-sm text-gray-600">This Week</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                                <div className="text-2xl font-bold text-green-600">{upcomingEvents.filter(e => e.eventType === 'volunteer').length}</div>
                                <div className="text-sm text-gray-600">Volunteer Events</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                                <div className="text-2xl font-bold text-purple-600">{upcomingEvents.filter(e => e.eventType === 'photo_safari').length}</div>
                                <div className="text-sm text-gray-600">Photo Safaris</div>
                            </div>
                        </div>

                        {/* Event Legend */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Tours</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Volunteer</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Photo Safari</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Educational</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Fundraising</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Other</span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Calendar</h2>
                                <p className="text-gray-600">Click on any event to view details and registration information.</p>
                            </div>
                            <EventCalendar events={upcomingEvents} />
                        </div>

                        {/* Featured Events */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingEvents.slice(0, 6).map((event) => (
                                    <Card key={event._id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{event.title}</CardTitle>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <Badge className={eventTypeColors[event.eventType]}>
                                                            {eventTypeLabels[event.eventType]}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                                    {format(new Date(event.startDate), "MMM dd, yyyy")} - {format(new Date(event.endDate), "MMM dd, yyyy")}
                                                </div>

                                                {event.location && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        {event.location}
                                                    </div>
                                                )}

                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    {event.currentAttendees}{event.maxAttendees ? ` / ${event.maxAttendees}` : ""} attendees
                                                </div>

                                                {event.price && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <DollarSign className="h-4 w-4 mr-2" />
                                                        ${event.price}
                                                    </div>
                                                )}

                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {event.description}
                                                </p>

                                                {event.requiresRegistration && event.contactEmail && (
                                                    <div className="pt-2">
                                                        <Button asChild size="sm" className="w-full">
                                                            <a href={`mailto:${event.contactEmail}?subject=Registration for ${event.title}`}>
                                                                Register Now
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Want to Stay Updated?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Subscribe to our newsletter to receive updates about new events, volunteer opportunities, and conservation news.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <a href="/subscribe">Subscribe to Newsletter</a>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <a href="/visit/volunteer">Volunteer with Us</a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventsPage