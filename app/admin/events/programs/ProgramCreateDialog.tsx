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
import { Plus, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import LocationPickerDialog from "@/components/locations/LocationPickerDialog"
import TicketPriceEditorDialog, { TicketPriceOption } from "../TicketPriceEditorDialog"

const ProgramCreateDialog = () => {
    const createProgram = useMutation(api.programs.createProgram)
    const programGroups = useQuery(api.programGroups.getAllProgramGroups)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [ticketPriceOptions, setTicketPriceOptions] = useState<TicketPriceOption[]>([])

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        details: "",
        locationId: null as Id<"locations"> | null,
        maxAttendees: "",
        requiresRegistration: false,
        contactEmail: "",
        contactPhone: "",
        isPublic: true,
        programGroupId: "" as string,
        imageId: null as Id<"images"> | null,
    })

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name ||
        !formData.description ||
        !formData.locationId ||
        !formData.programGroupId ||
        ticketPriceOptions.length === 0
    )

    const handleCreate = async () => {
        if (saveDisabled || !formData.locationId) return

        setIsLoading(true)
        setError(null)
        try {
            await createProgram({
                name: formData.name,
                description: formData.description,
                details: formData.details,
                ticketPriceOptions: ticketPriceOptions,
                locationId: formData.locationId,
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
                requiresRegistration: formData.requiresRegistration,
                contactEmail: formData.contactEmail || undefined,
                contactPhone: formData.contactPhone || undefined,
                isPublic: formData.isPublic,
                imageId: formData.imageId || undefined,
                programGroupId: formData.programGroupId as Id<"programGroups">,
                order: 100,
            })
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error creating program:", err)
            setError(`Failed to create program. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: "",
            description: "",
            details: "",
            locationId: null,
            maxAttendees: "",
            requiresRegistration: false,
            contactEmail: "",
            contactPhone: "",
            isPublic: true,
            programGroupId: "",
            imageId: null,
        })
        setTicketPriceOptions([])
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Program
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Program</DialogTitle>
                    <DialogDescription>
                        Create a new program template that can be used to generate events.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Program Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter program name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="programGroupId">Program Group</Label>
                            <Select
                                value={formData.programGroupId}
                                disabled={editingDisabled}
                                onValueChange={(value) => setFormData({ ...formData, programGroupId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select program group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programGroups?.map((group) => (
                                        <SelectItem key={group._id} value={group._id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="A short description of the program"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="details">Details</Label>
                        <Textarea
                            id="details"
                            value={formData.details}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                            placeholder="A detailed description of the program"
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label>Image</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData({ ...formData, imageId: imageId || null })}
                            disabled={editingDisabled}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Location <span className="text-red-500">*</span></Label>
                            <LocationPickerDialog
                                locationId={formData.locationId}
                                onLocationSelect={(locationId) => setFormData({ ...formData, locationId })}
                                disabled={editingDisabled}
                            />
                        </div>
                        <div>
                            <Label>Ticket Pricing <span className="text-red-500">*</span></Label>
                            <TicketPriceEditorDialog
                                onComplete={(data) => setTicketPriceOptions(data.options)}
                            >
                                <Button variant="outline" className="w-full" disabled={editingDisabled}>
                                    {ticketPriceOptions.length > 0
                                        ? `${ticketPriceOptions.length} price option${ticketPriceOptions.length > 1 ? "s" : ""}`
                                        : "Configure Pricing (Required)"
                                    }
                                </Button>
                            </TicketPriceEditorDialog>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="maxAttendees">Max Attendees</Label>
                            <Input
                                id="maxAttendees"
                                type="number"
                                value={formData.maxAttendees}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                                placeholder="Leave blank for unlimited"
                            />
                        </div>
                        <div className="flex items-end pb-2">
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
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                                id="contactPhone"
                                type="tel"
                                value={formData.contactPhone}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                placeholder="(555) 123-4567"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="rounded"
                        />
                        <Label htmlFor="isPublic">Public Program</Label>
                    </div>

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
                                "Create Program"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProgramCreateDialog
