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
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"

type LocationCreateDialogProps = {
    children?: React.ReactNode
    onCreated?: (id: Id<"locations">) => void
}

const LocationCreateDialog = ({ children, onCreated }: LocationCreateDialogProps) => {
    const createLocation = useMutation(api.locations.createLocation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        notes: "",
        mapsUrl: "",
        imageId: null as Id<"images"> | null,
    })

    const editingDisabled = isLoading
    const saveDisabled = isLoading || !formData.name

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            const id = await createLocation({
                name: formData.name,
                address: formData.address || undefined,
                notes: formData.notes || undefined,
                mapsUrl: formData.mapsUrl || undefined,
                imageId: formData.imageId || undefined,
            })
            setIsOpen(false)
            resetForm()
            onCreated?.(id)
        } catch (err) {
            console.error("Error creating location:", err)
            setError(`Failed to create location. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: "",
            address: "",
            notes: "",
            mapsUrl: "",
            imageId: null,
        })
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button onClick={resetForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Location
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Location</DialogTitle>
                    <DialogDescription>
                        Add a new location for events and programs.
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
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Location"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LocationCreateDialog

