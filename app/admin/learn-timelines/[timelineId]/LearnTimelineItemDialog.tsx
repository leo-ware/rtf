"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
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
import ImagePickerDialog from "@/components/images/ImagePickerDialog"

type LearnTimelineItemType = {
    _id: Id<"learnTimelineItems">
    date: string
    title: string
    content: string
    imageId?: Id<"images">
}

type LearnTimelineItemDialogProps = {
    timelineId: Id<"learnTimelines">
    mode: "create" | "edit"
    editItem?: LearnTimelineItemType
    children?: React.ReactNode
}

const LearnTimelineItemDialog = ({
    timelineId,
    mode,
    editItem,
    children,
}: LearnTimelineItemDialogProps) => {
    const createItem = useMutation(api.learnTimelines.createTimelineItem)
    const updateItem = useMutation(api.learnTimelines.updateTimelineItem)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        date: editItem?.date ?? "",
        title: editItem?.title ?? "",
        content: editItem?.content ?? "",
        imageId: (editItem?.imageId ?? null) as Id<"images"> | null,
    })

    const isEditing = mode === "edit"
    const saveDisabled = isLoading || !formData.title.trim() || !formData.content.trim()

    const resetForm = () => {
        if (isEditing && editItem) {
            setFormData({
                date: editItem.date,
                title: editItem.title,
                content: editItem.content,
                imageId: editItem.imageId ?? null,
            })
        } else {
            setFormData({
                date: "",
                title: "",
                content: "",
                imageId: null,
            })
        }
        setError(null)
    }

    const handleOpenChange = (open: boolean) => {
        if (open) resetForm()
        setIsOpen(open)
    }

    const handleSubmit = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            if (isEditing && editItem) {
                await updateItem({
                    id: editItem._id,
                    date: formData.date,
                    title: formData.title.trim(),
                    content: formData.content.trim(),
                    imageId: formData.imageId ?? null,
                })
            } else {
                await createItem({
                    timelineId,
                    date: formData.date,
                    title: formData.title.trim(),
                    content: formData.content.trim(),
                    imageId: formData.imageId ?? undefined,
                })
            }
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error saving timeline item:", err)
            setError(`Failed to ${isEditing ? "update" : "create"} item. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children ? children : isEditing ? (
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit" : "Add"} Timeline Item</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update" : "Create"} a timeline item.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="item-date">Date</Label>
                        <Input
                            id="item-date"
                            value={formData.date}
                            disabled={isLoading}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            placeholder='e.g., "50 Million Years Ago" or "1971"'
                        />
                    </div>

                    <div>
                        <Label htmlFor="item-title">Title *</Label>
                        <Input
                            id="item-title"
                            value={formData.title}
                            disabled={isLoading}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Item title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="item-content">Content *</Label>
                        <Textarea
                            id="item-content"
                            value={formData.content}
                            disabled={isLoading}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Describe this timeline entry"
                            rows={6}
                        />
                    </div>

                    <div>
                        <Label>Image (Optional)</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData(prev => ({ ...prev, imageId }))}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="text-black text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={saveDisabled}>
                            {isEditing ? "Update" : "Create"} Item
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LearnTimelineItemDialog
