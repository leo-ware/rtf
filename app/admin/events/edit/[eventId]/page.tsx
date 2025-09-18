"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    MapPin,
    Users,
    DollarSign,
    Save,
    Eye,
    EyeOff
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { TiptapEditor } from "@/components/TiptapEditor"

type EventType = "tour" | "volunteer" | "photo_safari" | "educational" | "fundraising" | "other"

interface EditEventPageProps {
    params: Promise<{
        eventId: string
    }>
}

const EditEventPage = ({ params }: EditEventPageProps) => {
    const router = useRouter()
    const eventId = use(params).eventId as Id<"events">

    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedEndDate, setSelectedEndDate] = useState<Date>()
    const [longDescription, setLongDescription] = useState("")

    const event = useQuery(api.events.getEventById, { id: eventId })
    const updateEvent = useMutation(api.events.updateEvent)

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

    // Load event data when it becomes available
    useEffect(() => {
        if (event) {
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
            // Initialize with existing description if no separate long description exists yet
            setLongDescription(event.longDescription || event.description)
        }
    }, [event])

    const handleSave = async () => {
        if (!selectedDate || !selectedEndDate) {
            alert("Please select start and end dates")
            return
        }

        try {
            await updateEvent({
                id: eventId,
                ...formData,
                startDate: selectedDate.getTime(),
                endDate: selectedEndDate.getTime(),
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
                price: formData.price ? parseFloat(formData.price) : undefined,
                longDescription: longDescription,
            })

            router.push("/admin/events")
        } catch (error) {
            console.error("Error updating event:", error)
            alert("Failed to update event")
        }
    }

    if (event === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (event === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
                    <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
                    <Link href="/admin/events">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Events
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/events">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Events
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
                                <p className="text-gray-600 mt-1">Update event details and description</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    View Site
                                </Button>
                            </Link>
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Details Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Update the basic details of your event
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                        <Select value={formData.eventType} onValueChange={(value) => setFormData({ ...formData, eventType: value as EventType })}>
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
                                    <Label htmlFor="description">Short Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description for listings and previews"
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
                            </CardContent>
                        </Card>

                        {/* Long Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Description</CardTitle>
                                <CardDescription>
                                    Provide a comprehensive description of the event with rich formatting
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TiptapEditor
                                    content={longDescription}
                                    onChange={setLongDescription}
                                    placeholder="Write a detailed description of your event. You can use rich text formatting, add lists, links, and more..."
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Event Preview */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Event Preview</span>
                                    <Badge className={eventTypeColors[formData.eventType]}>
                                        {eventTypeLabels[formData.eventType]}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{formData.title || "Event Title"}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{formData.description || "Event description"}</p>
                                </div>

                                <div className="space-y-3">
                                    {(selectedDate || selectedEndDate) && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            <span>
                                                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Start Date"}
                                                {selectedEndDate && selectedDate?.getTime() !== selectedEndDate?.getTime() && (
                                                    <> - {format(selectedEndDate, "MMM dd, yyyy")}</>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {formData.location && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{formData.location}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span>{event.currentAttendees}{formData.maxAttendees ? ` / ${formData.maxAttendees}` : ""} attendees</span>
                                    </div>

                                    {formData.price && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            <span>${formData.price}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Visibility:</span>
                                        <Badge variant={formData.isPublic ? "default" : "secondary"}>
                                            {formData.isPublic ? (
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
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Registration:</span>
                                        <Badge variant={formData.requiresRegistration ? "default" : "secondary"}>
                                            {formData.requiresRegistration ? "Required" : "Not Required"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button onClick={handleSave} className="w-full">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditEventPage