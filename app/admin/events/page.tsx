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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ImagePicker } from "@/components/ImagePicker"
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
    ExternalLink,
    Folder,
    FolderOpen,
    BookOpen,
    CalendarPlus
} from "lucide-react"
import { format } from "date-fns"

import Link from "next/link"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import EventCalendar from "@/components/EventCalendar"

type EventType = "tour" | "volunteer" | "photo_safari" | "educational" | "fundraising" | "other"

const AdminEventsPage = () => {
    const [activeTab, setActiveTab] = useState<'events' | 'programGroups' | 'programs'>('events')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Id<"events"> | null>(null)
    const [editingProgramGroup, setEditingProgramGroup] = useState<Id<"programGroups"> | null>(null)
    const [editingProgram, setEditingProgram] = useState<Id<"programs"> | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedEndDate, setSelectedEndDate] = useState<Date>()
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [searchTerm, setSearchTerm] = useState("")
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
    const [selectedImageData, setSelectedImageData] = useState<{ imageId: string; imageUrl: string } | null>(null)
    const [isScheduleEventDialogOpen, setIsScheduleEventDialogOpen] = useState(false)
    const [selectedProgramForEvent, setSelectedProgramForEvent] = useState<Id<"programs"> | null>(null)

    // Queries
    const events = useQuery(api.events.getAllEvents)
    const programGroups = useQuery(api.programGroups.getAllProgramGroups)
    const programs = useQuery(api.programs.getAllPrograms)

    // Mutations
    const createEvent = useMutation(api.events.createEvent)
    const updateEvent = useMutation(api.events.updateEvent)
    const deleteEvent = useMutation(api.events.deleteEvent)
    const createProgramGroup = useMutation(api.programGroups.createProgramGroup)
    const updateProgramGroup = useMutation(api.programGroups.updateProgramGroup)
    const deleteProgramGroup = useMutation(api.programGroups.deleteProgramGroup)
    const createProgram = useMutation(api.programs.createProgram)
    const updateProgram = useMutation(api.programs.updateProgram)
    const deleteProgram = useMutation(api.programs.deleteProgram)
    const createEventFromProgram = useMutation(api.programs.createEventFromProgram)

    const [formData, setFormData] = useState({
        // Event form data
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
        // Program Group form data
        groupName: "",
        groupDescription: "",
        groupOrder: 0,
        groupIsPublic: true,
        // Program form data
        programName: "",
        programDescription: "",
        programDetails: "",
        programPrice: "",
        programLocation: "",
        programOrder: 0,
        programIsPublic: true,
        programGroupId: "",
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

    const handleCreateProgramGroup = async () => {
        try {
            await createProgramGroup({
                name: formData.groupName,
                description: formData.groupDescription,
                imageId: selectedImageData?.imageId as Id<"images"> | undefined,
                order: formData.groupOrder,
                isPublic: formData.groupIsPublic,
            })

            setIsCreateDialogOpen(false)
            resetForm()
        } catch (error) {
            console.error("Error creating program group:", error)
            alert("Failed to create program group")
        }
    }

    const handleCreateProgram = async () => {
        try {
            await createProgram({
                name: formData.programName,
                description: formData.programDescription,
                details: formData.programDetails,
                price: formData.programPrice ? parseFloat(formData.programPrice) : undefined,
                location: formData.programLocation,
                isPublic: formData.programIsPublic,
                imageId: selectedImageData?.imageId as Id<"images"> | undefined,
                programGroupId: formData.programGroupId as Id<"programGroups">,
                order: formData.programOrder,
            })

            setIsCreateDialogOpen(false)
            resetForm()
        } catch (error) {
            console.error("Error creating program:", error)
            alert("Failed to create program")
        }
    }

    const handleCreateEventFromProgram = async (programId: Id<"programs">) => {
        if (!selectedDate || !selectedEndDate) {
            alert("Please select start and end dates")
            return
        }

        try {
            const eventId = await createEventFromProgram({
                programId,
                startDate: selectedDate.getTime(),
                endDate: selectedEndDate.getTime(),
                isPublic: false, // Default to not public
            })

            if (confirm("Event created from program template! Would you like to edit the event details?")) {
                window.open(`/admin/events/edit/${eventId}`, '_blank')
            }

            setIsScheduleEventDialogOpen(false)
            setSelectedDate(undefined)
            setSelectedEndDate(undefined)
            setSelectedProgramForEvent(null)
        } catch (error) {
            console.error("Error creating event from program:", error)
            alert("Failed to create event from program")
        }
    }

    const openScheduleEventDialog = (programId: Id<"programs">) => {
        setSelectedProgramForEvent(programId)
        setSelectedDate(undefined)
        setSelectedEndDate(undefined)
        setIsScheduleEventDialogOpen(true)
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
            groupName: "",
            groupDescription: "",
            groupOrder: 0,
            groupIsPublic: true,
            programName: "",
            programDescription: "",
            programDetails: "",
            programPrice: "",
            programLocation: "",
            programOrder: 0,
            programIsPublic: true,
            programGroupId: "",
        })
        setSelectedDate(undefined)
        setSelectedEndDate(undefined)
        setSelectedImageData(null)
    }

    const openEditDialog = (event: any) => {
        setEditingEvent(event._id)
        setFormData({
            ...formData,
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

    const handleDeleteProgramGroup = async (programGroupId: Id<"programGroups">) => {
        if (confirm("Are you sure you want to delete this program group?")) {
            try {
                await deleteProgramGroup({ id: programGroupId })
            } catch (error) {
                console.error("Error deleting program group:", error)
                alert("Failed to delete program group")
            }
        }
    }

    const handleDeleteProgram = async (programId: Id<"programs">) => {
        if (confirm("Are you sure you want to delete this program?")) {
            try {
                await deleteProgram({ id: programId })
            } catch (error) {
                console.error("Error deleting program:", error)
                alert("Failed to delete program")
            }
        }
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

    const filteredProgramGroups = programGroups?.filter(group => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            group.name.toLowerCase().includes(searchLower) ||
            group.description.toLowerCase().includes(searchLower)
        )
    }) || []

    const filteredPrograms = programs?.filter(program => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            program.name.toLowerCase().includes(searchLower) ||
            program.description.toLowerCase().includes(searchLower) ||
            program.location.toLowerCase().includes(searchLower)
        )
    }) || []

    if (events === undefined || programGroups === undefined || programs === undefined) {
        return <div className="p-8">Loading...</div>
    }

    const getCreateButton = () => {
        switch (activeTab) {
            case 'events':
                return (
                    <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true) }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </Button>
                )
            case 'programGroups':
                return (
                    <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true) }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Program Group
                    </Button>
                )
            case 'programs':
                return (
                    <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true) }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Program
                    </Button>
                )
        }
    }

    const getCreateDialog = () => {
        switch (activeTab) {
            case 'events':
                return (
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
                )
            case 'programGroups':
                return (
                    <ProgramGroupForm
                        formData={formData}
                        setFormData={setFormData}
                        selectedImageData={selectedImageData}
                        setSelectedImageData={setSelectedImageData}
                        isImagePickerOpen={isImagePickerOpen}
                        setIsImagePickerOpen={setIsImagePickerOpen}
                        onSubmit={handleCreateProgramGroup}
                        submitLabel="Create Program Group"
                    />
                )
            case 'programs':
                return (
                    <ProgramForm
                        formData={formData}
                        setFormData={setFormData}
                        selectedImageData={selectedImageData}
                        setSelectedImageData={setSelectedImageData}
                        isImagePickerOpen={isImagePickerOpen}
                        setIsImagePickerOpen={setIsImagePickerOpen}
                        programGroups={programGroups}
                        onSubmit={handleCreateProgram}
                        submitLabel="Create Program"
                    />
                )
        }
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
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {getCreateButton()}
                            {activeTab === 'events' && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="events" className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Events
                        </TabsTrigger>
                        <TabsTrigger value="programGroups" className="flex items-center gap-2">
                            <Folder className="h-4 w-4" />
                            Program Groups
                        </TabsTrigger>
                        <TabsTrigger value="programs" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Programs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="space-y-6">
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
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="programGroups" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Program Groups</CardTitle>
                                <CardDescription>Organize programs into groups for better management</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {filteredProgramGroups.map((group) => (
                                        <AccordionItem key={group._id} value={group._id}>
                                            <AccordionTrigger className="hover:no-underline">
                                                <div className="flex items-center space-x-3">
                                                    <FolderOpen className="h-5 w-5 text-blue-500" />
                                                    <div className="text-left">
                                                        <div className="font-medium">{group.name}</div>
                                                        <div className="text-sm text-gray-500">{group.description}</div>
                                                    </div>
                                                    <div className="ml-auto flex items-center space-x-2">
                                                        <Badge variant={group.isPublic ? "default" : "secondary"}>
                                                            {group.isPublic ? "Public" : "Private"}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">Order: {group.order}</span>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="pt-4 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm text-gray-600">
                                                            Created: {format(new Date(group.createdAt), "MMM dd, yyyy")}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        groupName: group.name,
                                                                        groupDescription: group.description,
                                                                        groupOrder: group.order,
                                                                        groupIsPublic: group.isPublic,
                                                                    })
                                                                    setEditingProgramGroup(group._id)
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDeleteProgramGroup(group._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="programs" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Programs</CardTitle>
                                <CardDescription>Create program templates that can be used to generate events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {filteredPrograms.map((program) => (
                                        <AccordionItem key={program._id} value={program._id}>
                                            <AccordionTrigger className="hover:no-underline" icon={null}>
                                                <div className="flex items-start gap-1 space-x-3">
                                                    <div className="text-left">
                                                        <div className="font-medium">{program.name}</div>
                                                        <Badge variant="outline" className="border-2">
                                                            {programGroups.find((group) => group._id === program.programGroupId)?.name}
                                                        </Badge>
                                                        <div className="text-sm text-gray-500 font-light">{program.description}</div>
                                                    </div>
                                                    <Badge variant={program.isPublic ? "default" : "secondary"}>
                                                        {program.isPublic ? "Public" : "Private"}
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="pt-4 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <strong>Location:</strong> {program.location}
                                                        </div>
                                                        <div>
                                                            <strong>Price:</strong> {program.price ? `$${program.price}` : "Free"}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <strong>Details:</strong> {program.details}
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm text-gray-600">
                                                            Created: {format(new Date(program.createdAt), "MMM dd, yyyy")}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        programName: program.name,
                                                                        programDescription: program.description,
                                                                        programDetails: program.details,
                                                                        programPrice: program.price?.toString() || "",
                                                                        programLocation: program.location,
                                                                        programOrder: program.order,
                                                                        programIsPublic: program.isPublic,
                                                                        programGroupId: program.programGroupId,
                                                                    })
                                                                    setEditingProgram(program._id)
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDeleteProgram(program._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="border-t pt-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="font-medium">Schedule Event from Program</h4>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => openScheduleEventDialog(program._id)}
                                                            >
                                                                <CalendarPlus className="h-4 w-4 mr-2" />
                                                                Schedule Event
                                                            </Button>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Select dates to create a new event using this program as a template.
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create/Edit Dialogs */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {activeTab === 'events' && 'Create New Event'}
                            {activeTab === 'programGroups' && 'Create New Program Group'}
                            {activeTab === 'programs' && 'Create New Program'}
                        </DialogTitle>
                        <DialogDescription>
                            {activeTab === 'events' && 'Add a new event to the RTF calendar'}
                            {activeTab === 'programGroups' && 'Create a new program group to organize programs'}
                            {activeTab === 'programs' && 'Create a new program template'}
                        </DialogDescription>
                    </DialogHeader>
                    {getCreateDialog()}
                </DialogContent>
            </Dialog>

            {/* Image Picker */}
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={(imageData) => {
                    setSelectedImageData(imageData)
                    setIsImagePickerOpen(false)
                }}
                title="Select Image"
                description="Choose an image for this item"
            />

            {/* Schedule Event Dialog */}
            <Dialog open={isScheduleEventDialogOpen} onOpenChange={setIsScheduleEventDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Schedule Event from Program</DialogTitle>
                        <DialogDescription>
                            Select dates to create a new event using the program as a template.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
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
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsScheduleEventDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => selectedProgramForEvent && handleCreateEventFromProgram(selectedProgramForEvent)}
                                disabled={!selectedDate || !selectedEndDate || !selectedProgramForEvent}
                            >
                                Create Event
                            </Button>
                        </div>
                    </div>
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

// Program Group Form Component
const ProgramGroupForm = ({
    formData,
    setFormData,
    selectedImageData,
    setSelectedImageData,
    isImagePickerOpen,
    setIsImagePickerOpen,
    onSubmit,
    submitLabel
}: {
    formData: any
    setFormData: (data: any) => void
    selectedImageData: { imageId: string; imageUrl: string } | null
    setSelectedImageData: (data: { imageId: string; imageUrl: string } | null) => void
    isImagePickerOpen: boolean
    setIsImagePickerOpen: (open: boolean) => void
    onSubmit: () => void
    submitLabel: string
}) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                    id="groupName"
                    value={formData.groupName}
                    onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    placeholder="Enter program group name"
                />
            </div>

            <div>
                <Label htmlFor="groupDescription">Description</Label>
                <Textarea
                    id="groupDescription"
                    value={formData.groupDescription}
                    onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
                    placeholder="Enter program group description"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="groupOrder">Display Order</Label>
                    <Input
                        id="groupOrder"
                        type="number"
                        value={formData.groupOrder}
                        onChange={(e) => setFormData({ ...formData, groupOrder: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                    />
                </div>
                <div>
                    <Label>Image</Label>
                    <div className="flex items-center space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsImagePickerOpen(true)}
                            className="flex-1"
                        >
                            {selectedImageData ? "Change Image" : "Select Image"}
                        </Button>
                        {selectedImageData && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedImageData(null)}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    {selectedImageData && (
                        <div className="mt-2">
                            <img
                                src={selectedImageData.imageUrl}
                                alt="Selected"
                                className="w-20 h-20 object-cover rounded"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="groupIsPublic"
                    checked={formData.groupIsPublic}
                    onChange={(e) => setFormData({ ...formData, groupIsPublic: e.target.checked })}
                    className="rounded"
                />
                <Label htmlFor="groupIsPublic">Public Program Group</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setFormData({ ...formData, groupName: "", groupDescription: "", groupOrder: 0, groupIsPublic: true })}>
                    Reset
                </Button>
                <Button onClick={onSubmit}>
                    {submitLabel}
                </Button>
            </div>
        </div>
    )
}

// Program Form Component
const ProgramForm = ({
    formData,
    setFormData,
    selectedImageData,
    setSelectedImageData,
    isImagePickerOpen,
    setIsImagePickerOpen,
    programGroups,
    onSubmit,
    submitLabel
}: {
    formData: any
    setFormData: (data: any) => void
    selectedImageData: { imageId: string; imageUrl: string } | null
    setSelectedImageData: (data: { imageId: string; imageUrl: string } | null) => void
    isImagePickerOpen: boolean
    setIsImagePickerOpen: (open: boolean) => void
    programGroups: any[]
    onSubmit: () => void
    submitLabel: string
}) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="programName">Program Name</Label>
                    <Input
                        id="programName"
                        value={formData.programName}
                        onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                        placeholder="Enter program name"
                    />
                </div>
                <div>
                    <Label htmlFor="programGroupId">Program Group</Label>
                    <Select value={formData.programGroupId} onValueChange={(value) => setFormData({ ...formData, programGroupId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select program group" />
                        </SelectTrigger>
                        <SelectContent>
                            {programGroups.map((group) => (
                                <SelectItem key={group._id} value={group._id}>
                                    {group.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label htmlFor="programDescription">Description</Label>
                <Textarea
                    id="programDescription"
                    value={formData.programDescription}
                    onChange={(e) => setFormData({ ...formData, programDescription: e.target.value })}
                    placeholder="Enter program description"
                    rows={3}
                />
            </div>

            <div>
                <Label htmlFor="programDetails">Details</Label>
                <Textarea
                    id="programDetails"
                    value={formData.programDetails}
                    onChange={(e) => setFormData({ ...formData, programDetails: e.target.value })}
                    placeholder="Enter detailed program information"
                    rows={4}
                />
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="programLocation">Location</Label>
                    <Input
                        id="programLocation"
                        value={formData.programLocation}
                        onChange={(e) => setFormData({ ...formData, programLocation: e.target.value })}
                        placeholder="Program location"
                    />
                </div>
                <div>
                    <Label htmlFor="programPrice">Price ($)</Label>
                    <Input
                        id="programPrice"
                        type="number"
                        step="0.01"
                        value={formData.programPrice}
                        onChange={(e) => setFormData({ ...formData, programPrice: e.target.value })}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="programOrder">Display Order</Label>
                    <Input
                        id="programOrder"
                        type="number"
                        value={formData.programOrder}
                        onChange={(e) => setFormData({ ...formData, programOrder: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                    />
                </div>
                <div>
                    <Label>Image</Label>
                    <div className="flex items-center space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsImagePickerOpen(true)}
                            className="flex-1"
                        >
                            {selectedImageData ? "Change Image" : "Select Image"}
                        </Button>
                        {selectedImageData && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedImageData(null)}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    {selectedImageData && (
                        <div className="mt-2">
                            <img
                                src={selectedImageData.imageUrl}
                                alt="Selected"
                                className="w-20 h-20 object-cover rounded"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="programIsPublic"
                    checked={formData.programIsPublic}
                    onChange={(e) => setFormData({ ...formData, programIsPublic: e.target.checked })}
                    className="rounded"
                />
                <Label htmlFor="programIsPublic">Public Program</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setFormData({ ...formData, programName: "", programDescription: "", programDetails: "", programPrice: "", programLocation: "", programOrder: 0, programIsPublic: true, programGroupId: "" })}>
                    Reset
                </Button>
                <Button onClick={onSubmit}>
                    {submitLabel}
                </Button>
            </div>
        </div>
    )
}

export default AdminEventsPage