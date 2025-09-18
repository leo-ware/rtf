"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Plus,
    Edit,
    Trash2,
    Calendar as CalendarIcon,
    MapPin,
    Users,
    DollarSign,
    Clock,
    Eye,
    EyeOff,
    Search,
    Grid3X3,
    List,
    FileText,
    ExternalLink
} from "lucide-react"
import { format } from "date-fns"

import Link from "next/link"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import EventCalendar from "@/components/EventCalendar"

type EventType = "tour" | "volunteer" | "photo_safari" | "educational" | "fundraising" | "other"

const AdminEventsPage = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Id<"events"> | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedEndDate, setSelectedEndDate] = useState<Date>()
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [searchTerm, setSearchTerm] = useState("")

    const events = useQuery(api.events.getAllEvents)
    const createEvent = useMutation(api.events.createEvent)
    const updateEvent = useMutation(api.events.updateEvent)
    const deleteEvent = useMutation(api.events.deleteEvent)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        eventType: "tour" as EventType,
        maxAttendees: "",
        price: "",
        isPublic: true,
        requiresRegistration: true,
        contactEmail: "",
        contactPhone: "",
        imageUrl: "",
    })

    const eventTypeLabels: Record<EventType, string> = {
        tour: "Tour",
        volunteer: "Volunteer",
        photo_safari: "Photo Safari",
        educational: "Educational",
        fundraising: "Fundraising",
        other: "Other"
    }

    const eventTypeColors: Record<EventType, string> = {
        tour: "bg-blue-100 text-blue-800",
        volunteer: "bg-green-100 text-green-800",
        photo_safari: "bg-purple-100 text-purple-800",
        educational: "bg-yellow-100 text-yellow-800",
        fundraising: "bg-red-100 text-red-800",
        other: "bg-gray-100 text-gray-800"
    }

    const handleCreateEvent = async () => {
        if (!selectedDate || !selectedEndDate) {
            alert("Please select start and end dates")
            return
        }

        try {
            const eventId = await createEvent({
                ...formData,
                startDate: selectedDate.getTime(),
                endDate: selectedEndDate.getTime(),
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
                price: formData.price ? parseFloat(formData.price) : undefined,
            })

            // Show success message with option to edit details
            if (confirm("Event created successfully! Would you like to add more details and description?")) {
                window.open(`/admin/events/edit/${eventId}`, '_blank')
            }

            setIsCreateDialogOpen(false)
            resetForm()
        } catch (error) {
            console.error("Error creating event:", error)
            alert("Failed to create event")
        }
    }

    const handleUpdateEvent = async () => {
        if (!editingEvent || !selectedDate || !selectedEndDate) return

        try {
            await updateEvent({
                id: editingEvent,
                ...formData,
                startDate: selectedDate.getTime(),
                endDate: selectedEndDate.getTime(),
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
                price: formData.price ? parseFloat(formData.price) : undefined,
            })

            setEditingEvent(null)
            resetForm()
        } catch (error) {
            console.error("Error updating event:", error)
            alert("Failed to update event")
        }
    }

    const handleDeleteEvent = async (eventId: Id<"events">) => {
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent({ id: eventId })
            } catch (error) {
                console.error("Error deleting event:", error)
                alert("Failed to delete event")
            }
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            location: "",
            eventType: "tour",
            maxAttendees: "",
            price: "",
            isPublic: true,
            requiresRegistration: true,
            contactEmail: "",
            contactPhone: "",
            imageUrl: "",
        })
        setSelectedDate(undefined)
        setSelectedEndDate(undefined)
    }

    const openEditDialog = (event: any) => {
        setEditingEvent(event._id)
        setFormData({
            title: event.title,
            description: event.description,
            location: event.location || "",
            eventType: event.eventType,
            maxAttendees: event.maxAttendees?.toString() || "",
            price: event.price?.toString() || "",
            isPublic: event.isPublic,
            requiresRegistration: event.requiresRegistration,
            contactEmail: event.contactEmail || "",
            contactPhone: event.contactPhone || "",
            imageUrl: event.imageUrl || "",
        })
        setSelectedDate(new Date(event.startDate))
        setSelectedEndDate(new Date(event.endDate))
    }

    // Filter events based on search term
    const filteredEvents = events?.filter(event => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.location?.toLowerCase().includes(searchLower) ||
            event.eventType.toLowerCase().includes(searchLower) ||
            event.contactEmail?.toLowerCase().includes(searchLower)
        )
    }) || []

    if (events === undefined) {
        return <div className="p-8">Loading events...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={resetForm}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Event
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create New Event</DialogTitle>
                                        <DialogDescription>
                                            Add a new event to the RTF calendar
                                        </DialogDescription>
                                    </DialogHeader>
                                    <EventForm
                                        formData={formData}
                                        setFormData={setFormData}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                        selectedEndDate={selectedEndDate}
                                        setSelectedEndDate={setSelectedEndDate}
                                        onSubmit={handleCreateEvent}
                                        submitLabel="Create Event"
                                    />
                                </DialogContent>
                            </Dialog>
                            <Button
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
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Events
                            </CardTitle>
                            <CalendarIcon className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{filteredEvents.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Public Events
                            </CardTitle>
                            <Eye className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredEvents.filter(event => event.isPublic).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Private Events
                            </CardTitle>
                            <EyeOff className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredEvents.filter(event => !event.isPublic).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Attendees
                            </CardTitle>
                            <Users className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredEvents.reduce((acc, event) => acc + event.currentAttendees, 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
                                onEditEvent={(eventId) => {
                                    const event = events?.find(e => e._id === eventId)
                                    if (event) openEditDialog(event)
                                }}
                                onDeleteEvent={handleDeleteEvent}
                            />
                        </div>

                        {filteredEvents.length === 0 && (
                            <div className="text-center py-12">
                                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? "No events match your search" : "No events yet"}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? "Try adjusting your search criteria"
                                        : "Get started by creating your first event"
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Event
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Events List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
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
                                                Attendees
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
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {event.title}
                                                            </p>
                                                            <div className="mt-1 flex items-center space-x-2">
                                                                <Badge className={eventTypeColors[event.eventType]} variant="outline">
                                                                    {eventTypeLabels[event.eventType]}
                                                                </Badge>
                                                                {event.price && (
                                                                    <span className="text-sm text-gray-500">
                                                                        ${event.price}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                                {event.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                                            <span>
                                                                {format(new Date(event.startDate), "MMM dd, yyyy")}
                                                                {event.startDate !== event.endDate && (
                                                                    <> - {format(new Date(event.endDate), "MMM dd, yyyy")}</>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {event.location && (
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-2" />
                                                                <span className="truncate max-w-xs">{event.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-2" />
                                                        <span>
                                                            {event.currentAttendees}
                                                            {event.maxAttendees ? ` / ${event.maxAttendees}` : ""}
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
                                                        <Link href={`/admin/events/edit/${event._id}`}>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                title="Edit Details"
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(event)}
                                                            title="Quick Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteEvent(event._id)}
                                                            title="Delete Event"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredEvents.length === 0 && (
                                <div className="text-center py-12">
                                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {searchTerm ? "No events match your search" : "No events yet"}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchTerm
                                            ? "Try adjusting your search criteria"
                                            : "Get started by creating your first event"
                                        }
                                    </p>
                                    {!searchTerm && (
                                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Event
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Update the event details
                        </DialogDescription>
                    </DialogHeader>
                    <EventForm
                        formData={formData}
                        setFormData={setFormData}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedEndDate={selectedEndDate}
                        setSelectedEndDate={setSelectedEndDate}
                        onSubmit={handleUpdateEvent}
                        submitLabel="Update Event"
                        eventId={editingEvent || ""}
                        isEditing={true}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Event Form Component
const EventForm = ({
    formData,
    setFormData,
    selectedDate,
    setSelectedDate,
    selectedEndDate,
    setSelectedEndDate,
    onSubmit,
    submitLabel,
    eventId,
    isEditing = false
}: {
    formData: any
    setFormData: (data: any) => void
    selectedDate: Date | undefined
    setSelectedDate: (date: Date | undefined) => void
    selectedEndDate: Date | undefined
    setSelectedEndDate: (date: Date | undefined) => void
    onSubmit: () => void
    submitLabel: string
    eventId?: string
    isEditing?: boolean
}) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter event title"
                    />
                </div>
                <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select value={formData.eventType} onValueChange={(value) => setFormData({ ...formData, eventType: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tour">Tour</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                            <SelectItem value="photo_safari">Photo Safari</SelectItem>
                            <SelectItem value="educational">Educational</SelectItem>
                            <SelectItem value="fundraising">Fundraising</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter event description"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label>End Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedEndDate ? format(selectedEndDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedEndDate}
                                onSelect={setSelectedEndDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Event location"
                    />
                </div>
                <div>
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                        id="maxAttendees"
                        type="number"
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                        placeholder="Optional"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Optional image URL"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="contact@rtf.org"
                    />
                </div>
                <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="(555) 123-4567"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        className="rounded"
                    />
                    <Label htmlFor="isPublic">Public Event</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="requiresRegistration"
                        checked={formData.requiresRegistration}
                        onChange={(e) => setFormData({ ...formData, requiresRegistration: e.target.checked })}
                        className="rounded"
                    />
                    <Label htmlFor="requiresRegistration">Requires Registration</Label>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <div>
                    {isEditing && eventId && (
                        <Link href={`/admin/events/edit/${eventId}`} target="_blank">
                            <Button variant="outline" type="button">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                More Details
                            </Button>
                        </Link>
                    )}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setFormData({ ...formData, title: "", description: "", location: "", eventType: "tour", maxAttendees: "", price: "", isPublic: true, requiresRegistration: true, contactEmail: "", contactPhone: "", imageUrl: "" })}>
                        Reset
                    </Button>
                    <Button onClick={onSubmit}>
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AdminEventsPage
