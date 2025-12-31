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
import { Edit, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import { TiptapEditor } from "@/components/TiptapEditor"
import TicketPriceEditorDialog, { TicketPriceOption } from "../TicketPriceEditorDialog"

export type Program = {
    _id: Id<"programs">
    name: string
    description: string
    details: string
    ticketPriceId?: Id<"ticketPrice">
    location: string
    maxAttendees?: number
    requiresRegistration?: boolean
    contactEmail?: string
    contactPhone?: string
    isPublic: boolean
    imageId?: Id<"images">
    programGroupId: Id<"programGroups">
}

type ProgramEditDialogProps = {
    program: Program
    children?: React.ReactNode
}

const ProgramEditDialog = ({ program, children }: ProgramEditDialogProps) => {
    const updateProgram = useMutation(api.programs.updateProgram)
    const programGroups = useQuery(api.programGroups.getAllProgramGroups)
    const existingTicketPrice = useQuery(
        api.ticketPrices.getTicketPrice,
        program.ticketPriceId ? { id: program.ticketPriceId } : "skip"
    )

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [ticketPriceOptions, setTicketPriceOptions] = useState<TicketPriceOption[]>([])

    const [formData, setFormData] = useState({
        name: program.name,
        description: program.description,
        details: program.details,
        location: program.location,
        maxAttendees: program.maxAttendees?.toString() || "",
        requiresRegistration: program.requiresRegistration || false,
        contactEmail: program.contactEmail || "",
        contactPhone: program.contactPhone || "",
        isPublic: program.isPublic,
        programGroupId: program.programGroupId as string,
        imageId: program.imageId || null as Id<"images"> | null,
    })

    // Reset form when program changes
    useEffect(() => {
        setFormData({
            name: program.name,
            description: program.description,
            details: program.details,
            location: program.location,
            maxAttendees: program.maxAttendees?.toString() || "",
            requiresRegistration: program.requiresRegistration || false,
            contactEmail: program.contactEmail || "",
            contactPhone: program.contactPhone || "",
            isPublic: program.isPublic,
            programGroupId: program.programGroupId as string,
            imageId: program.imageId || null,
        })
    }, [program])

    // Load existing ticket price options
    useEffect(() => {
        if (existingTicketPrice) {
            setTicketPriceOptions(existingTicketPrice.options)
        }
    }, [existingTicketPrice])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name ||
        !formData.description ||
        !formData.location ||
        !formData.programGroupId
    )

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateProgram({
                id: program._id,
                name: formData.name,
                description: formData.description,
                details: formData.details,
                ticketPriceOptions: ticketPriceOptions.length > 0 ? ticketPriceOptions : undefined,
                location: formData.location,
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
                requiresRegistration: formData.requiresRegistration,
                contactEmail: formData.contactEmail || undefined,
                contactPhone: formData.contactPhone || undefined,
                isPublic: formData.isPublic,
                imageId: formData.imageId || undefined,
                programGroupId: formData.programGroupId as Id<"programGroups">,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating program:", err)
            setError(`Failed to update program. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: program.name,
            description: program.description,
            details: program.details,
            location: program.location,
            maxAttendees: program.maxAttendees?.toString() || "",
            requiresRegistration: program.requiresRegistration || false,
            contactEmail: program.contactEmail || "",
            contactPhone: program.contactPhone || "",
            isPublic: program.isPublic,
            programGroupId: program.programGroupId as string,
            imageId: program.imageId || null,
        })
        setTicketPriceOptions(existingTicketPrice?.options || [])
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Program</DialogTitle>
                    <DialogDescription>
                        Update the program template details.
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
                            placeholder="Enter program description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="details">Details</Label>
                        {typeof formData.details === "string" && (
                            <TiptapEditor
                                content={formData.details}
                                onChange={(value) => setFormData({ ...formData, details: value })}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Program location"
                            />
                        </div>
                        <div>
                            <Label>Ticket Pricing</Label>
                            <TicketPriceEditorDialog
                                onComplete={(data) => setTicketPriceOptions(data.options)}
                            >
                                <Button variant="outline" className="w-full" disabled={editingDisabled}>
                                    {ticketPriceOptions.length > 0
                                        ? `${ticketPriceOptions.length} price option${ticketPriceOptions.length > 1 ? "s" : ""}`
                                        : "Configure Pricing"
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

                    <div>
                        <Label>Image</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData({ ...formData, imageId: imageId || null })}
                            disabled={editingDisabled}
                        />
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
                        <Button onClick={handleUpdate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Program"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProgramEditDialog
