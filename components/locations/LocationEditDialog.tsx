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
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"

export type Location = {
    _id: Id<"locations">
    name: string
    address?: string
    notes?: string
    mapsUrl?: string
    imageId?: Id<"images">
}

type LocationEditDialogProps = {
    location: Location
    children?: React.ReactNode
    onUpdated?: () => void
}

const LocationEditDialog = ({ location, children, onUpdated }: LocationEditDialogProps) => {
    const updateLocation = useMutation(api.locations.updateLocation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: location.name,
        address: location.address || "",
        notes: location.notes || "",
        mapsUrl: location.mapsUrl || "",
        imageId: location.imageId || null as Id<"images"> | null,
    })

    useEffect(() => {
        setFormData({
            name: location.name,
            address: location.address || "",
            notes: location.notes || "",
            mapsUrl: location.mapsUrl || "",
            imageId: location.imageId || null,
        })
    }, [location])

    const editingDisabled = isLoading
    const saveDisabled = isLoading || !formData.name

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateLocation({
                id: location._id,
                name: formData.name,
                address: formData.address || undefined,
                notes: formData.notes || undefined,
                mapsUrl: formData.mapsUrl || undefined,
                imageId: formData.imageId || undefined,
            })
            setIsOpen(false)
            onUpdated?.()
        } catch (err) {
            console.error("Error updating location:", err)
            setError(`Failed to update location. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: location.name,
            address: location.address || "",
            notes: location.notes || "",
            mapsUrl: location.mapsUrl || "",
            imageId: location.imageId || null,
        })
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
                    <DialogTitle>Edit Location</DialogTitle>
                    <DialogDescription>
                        Update the location details.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter location name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter street address"
                        />
                    </div>

                    <div>
                        <Label htmlFor="mapsUrl">Google Maps URL</Label>
                        <Input
                            id="mapsUrl"
                            value={formData.mapsUrl}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                            placeholder="https://maps.google.com/..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes about this location"
                            rows={3}
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
                                "Update Location"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LocationEditDialog

