"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit } from "lucide-react"
import { handleConvexError } from "@/lib/errorHandler"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"

type TimelineItem = {
    _id: Id<"timelineItem">
    order: number
    date: string
    title: string
    description: string
    imageId?: Id<"images">
}

type TimelineCreateDialogProps = {
    herdId: Id<"herds">
    mode: "create" | "edit"
    editItem?: TimelineItem
    defaultOrder?: number
}

const TimelineCreateDialog = ({
    herdId,
    mode,
    editItem,
    defaultOrder = 0,
}: TimelineCreateDialogProps) => {
    const router = useRouter()

    const createTimelineItem = useMutation(api.timelineItems.createTimelineItem)
    const updateTimelineItem = useMutation(api.timelineItems.updateTimelineItem)
    const addTimelineItem = useMutation(api.herds.addTimelineItem)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        order: editItem?.order ?? defaultOrder,
        date: editItem?.date ?? "",
        title: editItem?.title ?? "",
        description: editItem?.description ?? "",
        imageId: editItem?.imageId ?? null as Id<"images"> | null,
    })

    const isEditing = mode === "edit"
    const editingDisabled = isLoading
    const saveDisabled = isLoading || !formData.title || !formData.description

    const resetForm = () => {
        if (isEditing && editItem) {
            setFormData({
                order: editItem.order,
                date: editItem.date,
                title: editItem.title,
                description: editItem.description,
                imageId: editItem.imageId ?? null,
            })
        } else {
            setFormData({
                order: defaultOrder,
                date: "",
                title: "",
                description: "",
                imageId: null,
            })
        }
        setError(null)
    }

    const handleOpenChange = (open: boolean) => {
        if (open) {
            resetForm()
        }
        setIsOpen(open)
    }

    const handleCreate = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const timelineItemId = await createTimelineItem({
                order: formData.order,
                date: formData.date,
                title: formData.title,
                description: formData.description,
                imageId: formData.imageId ?? undefined,
            })

            await addTimelineItem({
                herdId,
                timelineItemId,
            })

            setIsOpen(false)
            resetForm()
        } catch (error: any) {
            console.error("Error creating timeline item:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "create timeline item", router)
            } else {
                setError("Failed to create timeline item: " + (error?.message || "Unknown error"))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async () => {
        if (!editItem) return

        try {
            setIsLoading(true)
            setError(null)

            await updateTimelineItem({
                id: editItem._id,
                order: formData.order,
                date: formData.date,
                title: formData.title,
                description: formData.description,
                imageId: formData.imageId ?? undefined,
            })

            setIsOpen(false)
        } catch (error: any) {
            console.error("Error updating timeline item:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "update timeline item", router)
            } else {
                setError("Failed to update timeline item: " + (error?.message || "Unknown error"))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = () => {
        if (isEditing) {
            handleUpdate()
        } else {
            handleCreate()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Timeline Item
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit" : "Add"} Timeline Item</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update" : "Create"} a timeline item for this herd.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="order">Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="text"
                                value={formData.date}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                placeholder="e.g., October - November 2023"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Timeline item title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="timeline-description">Description</Label>
                        <Textarea
                            id="timeline-description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe this timeline item"
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label>Image (Optional)</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData(prev => ({ ...prev, imageId }))}
                            disabled={editingDisabled}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={editingDisabled}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={saveDisabled}
                        >
                            {isEditing ? "Update" : "Create"} Timeline Item
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TimelineCreateDialog
