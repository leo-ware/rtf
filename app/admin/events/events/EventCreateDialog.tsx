"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Calendar as CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { format } from "date-fns"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import LocationPickerDialog from "@/components/locations/LocationPickerDialog"

const EventCreateDialog = ({ children }: { children?: React.ReactNode }) => {
    const createEvent = useMutation(api.events.createEvent)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedEndDate, setSelectedEndDate] = useState<Date>()
    const [imageId, setImageId] = useState<Id<"images"> | null>(null)
    const [locationId, setLocationId] = useState<Id<"locations"> | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        maxAttendees: "",
        isPublic: true,
        requiresRegistration: true,
        registrationLink: "",
        contactEmail: "",
        contactPhone: "",
    })

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.title ||
        !formData.description ||
        !selectedDate ||
        !selectedEndDate ||
        (formData.requiresRegistration && !formData.registrationLink.trim())
    )

    const handleCreate = async () => {
        if (saveDisabled || !selectedDate || !selectedEndDate) return

        setIsLoading(true)
        setError(null)
        try {
            const eventId = await createEvent({
                ...formData,
                startDate: selectedDate.toISOString(),
                endDate: selectedEndDate.toISOString(),
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
                imageId: imageId ?? undefined,
                locationId: locationId ?? undefined,
                registrationLink: formData.requiresRegistration ? formData.registrationLink.trim() : undefined,
            })

            setIsOpen(false)
            resetForm()

            if (confirm("Event created successfully! Would you like to add more details and description?")) {
                window.open(`/admin/events/edit/${eventId}`, '_blank')
            }
        } catch (err) {
            console.error("Error creating event:", err)
            setError(`Failed to create event. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            title: "",
            description: "",
            maxAttendees: "",
            isPublic: true,
            requiresRegistration: true,
            registrationLink: "",
            contactEmail: "",
            contactPhone: "",
        })
        setSelectedDate(undefined)
        setSelectedEndDate(undefined)
        setImageId(null)
        setLocationId(null)
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children
                    ? children
                    : (
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create One-Time Event
                        </Button>
                    )
                }
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Add a new event to the RTF calendar.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter event title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            disabled={editingDisabled}
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
                                    <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={editingDisabled}>
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
                                    <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={editingDisabled}>
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
                            <Label>Location</Label>
                            <LocationPickerDialog
                                locationId={locationId}
                                onLocationSelect={setLocationId}
                                disabled={editingDisabled}
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxAttendees">Max Attendees</Label>
                            <Input
                                id="maxAttendees"
                                type="number"
                                value={formData.maxAttendees}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Event Image</Label>
                            <ImagePickerDialog
                                imageId={imageId}
                                onImageSelect={setImageId}
                                disabled={editingDisabled}
                            />
                        </div>
                        <div />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                value={formData.contactEmail}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                placeholder="contact@rtf.org"
                            />
                        </div>
                        <div>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                                id="contactPhone"
                                value={formData.contactPhone}
                                disabled={editingDisabled}
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
                                disabled={editingDisabled}
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
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, requiresRegistration: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="requiresRegistration">Requires Registration</Label>
                        </div>
                    </div>

                    {formData.requiresRegistration && (
                        <div>
                            <Label htmlFor="registrationLink">Registration Link <span className="text-red-500">*</span></Label>
                            <Input
                                id="registrationLink"
                                value={formData.registrationLink}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={resetForm} disabled={editingDisabled}>
                            Reset
                        </Button>
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Event"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EventCreateDialog
