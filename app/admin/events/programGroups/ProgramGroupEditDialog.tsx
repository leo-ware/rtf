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
import { TiptapEditor } from "@/components/TiptapEditor"

export type ProgramGroup = {
    _id: Id<"programGroups">
    name: string
    description: string
    isPublic: boolean
    imageId?: Id<"images">
    order: number
}

type ProgramGroupEditDialogProps = {
    programGroup: ProgramGroup
    children?: React.ReactNode
}

const ProgramGroupEditDialog = ({ programGroup, children }: ProgramGroupEditDialogProps) => {
    const updateProgramGroup = useMutation(api.programGroups.updateProgramGroup)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: programGroup.name,
        description: programGroup.description,
        isPublic: programGroup.isPublic,
        imageId: programGroup.imageId || null as Id<"images"> | null,
    })

    // Reset form when programGroup changes
    useEffect(() => {
        setFormData({
            name: programGroup.name,
            description: programGroup.description,
            isPublic: programGroup.isPublic,
            imageId: programGroup.imageId || null,
        })
    }, [programGroup])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name ||
        !formData.description
    )

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateProgramGroup({
                id: programGroup._id,
                name: formData.name,
                description: formData.description,
                imageId: formData.imageId || undefined,
                isPublic: formData.isPublic,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating program group:", err)
            setError(`Failed to update program group. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: programGroup.name,
            description: programGroup.description,
            isPublic: programGroup.isPublic,
            imageId: programGroup.imageId || null,
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
                    <DialogTitle>Edit Program Group</DialogTitle>
                    <DialogDescription>
                        Update the program group details.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Group Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter program group name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter program group description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <div>
                            <Label>Image</Label>
                            <ImagePickerDialog
                                imageId={formData.imageId}
                                onImageSelect={(imageId) => setFormData({ ...formData, imageId: imageId || null })}
                                disabled={editingDisabled}
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
                        <Label htmlFor="isPublic">Public Program Group</Label>
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
                                "Update Program Group"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProgramGroupEditDialog
