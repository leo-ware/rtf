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
import LocationPickerDialog from "@/components/locations/LocationPickerDialog"
import { TiptapEditor } from "@/components/TiptapEditor"
import { Switch } from "@/components/ui/switch"

export type Program = {
    _id: Id<"programs">
    name: string
    description: string
    details: string
    ticketPriceId?: Id<"ticketPrice">
    ticketPriceText?: string
    locationId: Id<"locations">
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
} | {
    programId: Id<"programs">
    children?: React.ReactNode
}

const ProgramEditDialog = ({ children, ...props }: ProgramEditDialogProps) => {
    const programId = "programId" in props ? props.programId : props.program._id
    const program = useQuery(api.programs.getProgramById, { id: programId })

    const updateProgram = useMutation(api.programs.updateProgram)
    const programGroups = useQuery(api.programGroups.getAllProgramGroups)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: undefined as string | undefined,
        description: undefined as string | undefined,
        details: undefined as string | undefined,
        locationId: null as Id<"locations"> | null,
        ticketPriceText: undefined as string | undefined,
        requiresRegistration: undefined as boolean | undefined,
        contactEmail: undefined as string | undefined,
        contactPhone: undefined as string | undefined,
        isPublic: undefined as boolean | undefined,
        programGroupId: undefined as string | undefined,
        imageId: null as Id<"images"> | null,
    })

    // Reset form when program changes
    useEffect(() => {
        if (program) {
            setFormData({
                name: program.name,
                description: program.description,
                details: program.details,
                locationId: program.locationId,
                ticketPriceText: program.ticketPriceText || "",
                requiresRegistration: program.requiresRegistration || false,
                contactEmail: program.contactEmail || "",
                contactPhone: program.contactPhone || "",
                isPublic: program.isPublic,
                programGroupId: program.programGroupId as string,
                imageId: program.imageId || null,
            })
        }
    }, [program])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name ||
        !formData.description ||
        !formData.locationId ||
        !formData.programGroupId
    )

    const handleUpdate = async () => {
        if (saveDisabled || !formData.locationId) return

        setIsLoading(true)
        setError(null)
        try {
            await updateProgram({
                id: programId,
                name: formData.name,
                description: formData.description,
                details: formData.details,
                locationId: formData.locationId,
                ticketPriceText: formData.ticketPriceText || undefined,
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
        if (program) {
            setFormData({
                name: program.name,
                description: program.description,
                details: program.details,
                locationId: program.locationId,
                ticketPriceText: program.ticketPriceText || "",
                requiresRegistration: program.requiresRegistration || false,
                contactEmail: program.contactEmail || "",
                contactPhone: program.contactPhone || "",
                isPublic: program.isPublic,
                programGroupId: program.programGroupId as string,
                imageId: program.imageId || null,
            })
            setError(null)
        }
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
                            <Label htmlFor="name">Program Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                value={formData.name}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter program name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="programGroupId">Program Group <span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
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

                    <div>
                        <Label htmlFor="ticketPriceText">Price</Label>
                        <Input
                            id="ticketPriceText"
                            value={formData.ticketPriceText}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, ticketPriceText: e.target.value })}
                            placeholder="e.g., Free, $25, or Adults $25, Children $15"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Location <span className="text-red-500">*</span></Label>
                            {formData.locationId && (
                                <LocationPickerDialog
                                    locationId={formData.locationId}
                                    onLocationSelect={(locationId) => setFormData({ ...formData, locationId })}
                                    disabled={editingDisabled}
                                />
                            )}
                        </div>
                        <div />
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
                        <Switch
                            id="isPublic"
                            checked={formData.isPublic}
                            disabled={editingDisabled}
                            onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
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
