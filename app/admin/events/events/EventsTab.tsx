"use client"

import { useState } from "react"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Calendar as CalendarIcon,
    MapPin,
    Users,
    Eye,
    EyeOff,
    List,
    Plus,
    CalendarPlus,
    Edit
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import EventCalendar from "@/components/EventCalendar"
import EventCreateDialog from "./EventCreateDialog"
import EventDeleteDialog from "./EventDeleteDialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ScheduleEventDialog from "../programs/ScheduleEventDialog"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import ScrollDiv from "@/components/ScrollDiv"
import { ImSpinner8 } from "react-icons/im"
import LocationWidget from "@/components/locations/LocationWidget"
import { formatDateRange } from "@/lib/utils"
import EventEditDialog from "./EventEditDialog"
import ProgramEditDialog from "../programs/ProgramEditDialog"

const EventsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [createDropdownOpen, setCreateDropdownOpen] = useState(false)

    // Queries
    const { results: events, loadMore, status: eventsStatus } = usePaginatedQuery(
        api.events.getPaginatedEvents,
        { paginationOpts: { numItems: 100 } },
        { initialNumItems: 100 }
    )

    const filteredEvents = events?.filter(event => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.location?.toLowerCase().includes(searchLower) ||
            event.contactEmail?.toLowerCase().includes(searchLower)
        )
    }) || []

    if (events === undefined) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[200px]">
                <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                    <span className="text-gray-500 text-sm mt-1">Fetching events...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu open={createDropdownOpen} onOpenChange={setCreateDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4" />
                                Create Event
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2 flex flex-col gap-2">
                            <DropdownMenuItem asChild>
                                <EventCreateDialog>
                                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                                        <Plus className="h-4 w-4" />
                                        Create One-Time Event
                                    </div>
                                </EventCreateDialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <ScheduleEventDialog>
                                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                                        <CalendarPlus className="h-4 w-4" />
                                        Schedule Recurring Event
                                    </div>
                                </ScheduleEventDialog>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "calendar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </Button> */}
                </div>
            </div>

            {/* Content */}
            {viewMode === 'calendar' ? (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Calendar</h2>
                            <p className="text-gray-600">Click on any event to view details. Use edit and delete buttons for management.</p>
                        </div>
                        <EventCalendar
                            events={filteredEvents}
                            isAdminMode={true}
                        />
                    </div>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Events List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollDiv
                            className="max-h-[400px] overflow-x-auto"
                            onScrollNearBottom={() => loadMore(50)}
                            threshold={200}
                            >
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Capacity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEvents.map((event) => (
                                        <tr key={event._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <CalendarIcon className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                    <div className="ml-3 min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[300px]">
                                                            {event.title}
                                                        </p>
                                                        {event.registrationLink && (
                                                            <span className="text-sm text-gray-500 mt-1">
                                                                Registration link set
                                                            </span>
                                                        )}
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                            {event.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap w-fit">
                                                <div className="w-fit">
                                                    <div className="flex items-center mb-1 whitespace-nowrap w-fit">
                                                        <CalendarIcon className="h-4 w-4 mr-2" />
                                                        <span className="whitespace-nowrap w-full">
                                                            {formatDateRange(
                                                                new Date(event.startDate),
                                                                new Date(event.endDate),
                                                                { forceIncludeYear: true }
                                                            )}
                                                        </span>
                                                    </div>
                                                    {event.locationId && (
                                                        <div className="flex items-center whitespace-nowrap w-full">
                                                            <LocationWidget locationId={event.locationId} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    <span>
                                                        {event.maxAttendees ?? "Unlimited"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <Badge variant={event.isPublic ? "default" : "secondary"}>
                                                        {event.isPublic ? (
                                                            <>
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                Public
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="h-3 w-3 mr-1" />
                                                                Private
                                                            </>
                                                        )}
                                                    </Badge>
                                                    {event.requiresRegistration && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Registration Required
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <EventEditDialog eventId={event._id} />
                                                    {event.programId && (
                                                        <ProgramEditDialog programId={event.programId} />
                                                    )}
                                                    <EventDeleteDialog eventId={event._id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {eventsStatus === "CanLoadMore" && (
                                <Button variant="outline" onClick={() => loadMore(50)}>
                                    Load More
                                </Button>
                            )}
                            {filteredEvents.length === 0 && (
                                <div className="text-center py-12 w-full">
                                    <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchTerm
                                            ? `No events match "${searchTerm}"`
                                            : "Get started by creating your first event."
                                        }
                                    </p>
                                </div>
                            )}
                        <div className="w-full flex items-center justify-center">
                            {eventsStatus === "LoadingMore" && (
                                <ImSpinner8 className="w-4 h-4 animate-spin" />
                            )}
                        </div>
                        </ScrollDiv>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default EventsTab
