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
import { Plus, Loader2, AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import LocationPickerDialog from "@/components/locations/LocationPickerDialog"
import { DateTimePicker } from "@/components/DateTimePicker"
import { TiptapEditor } from "@/components/TiptapEditor"
import { Switch } from "@/components/ui/switch"

const EventCreateDialog = ({ children }: { children?: React.ReactNode }) => {
    const createEvent = useMutation(api.events.createEvent)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedDate, _setSelectedDate] = useState<Date>()
    const [selectedEndDate, _setSelectedEndDate] = useState<Date>()
    const [imageId, setImageId] = useState<Id<"images"> | null>(null)
    const [locationId, setLocationId] = useState<Id<"locations"> | null>(null)

    const setSelectedDate = (date: Date | undefined) => {
        _setSelectedDate(date)
        if (date) {
            // Auto-init end date to start + 2 hours if not set
            if (!selectedEndDate) {
                const endDate = new Date(date)
                endDate.setHours(endDate.getHours() + 2)
                _setSelectedEndDate(endDate)
            }
        }
    }

    const setSelectedEndDate = (date: Date | undefined) => {
        _setSelectedEndDate(date)
    }

    // Duration warning
    const durationWarning = selectedDate && selectedEndDate && selectedDate >= selectedEndDate
        ? "Warning: Event has zero or negative duration"
        : null

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        longDescription: "",
        ticketPriceText: "",
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
            await createEvent({
                ...formData,
                startDate: selectedDate.toISOString(),
                endDate: selectedEndDate.toISOString(),
                imageId: imageId ?? undefined,
                locationId: locationId ?? undefined,
                registrationLink: formData.requiresRegistration ? formData.registrationLink.trim() : undefined,
                ticketPriceText: formData.ticketPriceText.trim() || undefined,
                longDescription: formData.longDescription || undefined,
            })

            setIsOpen(false)
            resetForm()
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
            longDescription: "",
            ticketPriceText: "",
            isPublic: true,
            requiresRegistration: true,
            registrationLink: "",
            contactEmail: "",
            contactPhone: "",
        })
        _setSelectedDate(undefined)
        _setSelectedEndDate(undefined)
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
                        <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            value={formData.title}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter event title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter event description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="longDescription">Details</Label>
                        <TiptapEditor
                            content={formData.longDescription}
                            onChange={(value) => setFormData({ ...formData, longDescription: value })}
                            placeholder="Add rich text details..."
                        />
                    </div>

                    <div>
                        <Label>Start Date/Time <span className="text-red-500">*</span></Label>
                        <DateTimePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            disabled={editingDisabled}
                            dateRequired={true}
                            timeRequired={true}
                        />
                    </div>
                    <div>
                        <Label>End Date/Time <span className="text-red-500">*</span></Label>
                        <DateTimePicker
                            value={selectedEndDate}
                            onChange={setSelectedEndDate}
                            disabled={editingDisabled}
                            dateRequired={true}
                            timeRequired={true}
                        />
                    </div>

                    {durationWarning && (
                        <div className="text-amber-600 text-sm flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            {durationWarning}
                        </div>
                    )}

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
                            <Label htmlFor="ticketPriceText">Price</Label>
                            <Input
                                id="ticketPriceText"
                                value={formData.ticketPriceText}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, ticketPriceText: e.target.value })}
                                placeholder="e.g., Free, $25"
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

                    <div className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isPublic"
                                checked={formData.isPublic}
                                disabled={editingDisabled}
                                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                            />
                            <Label htmlFor="isPublic">Public Event</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="requiresRegistration"
                                checked={formData.requiresRegistration}
                                disabled={editingDisabled}
                                onCheckedChange={(checked) => setFormData({ ...formData, requiresRegistration: checked })}
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
