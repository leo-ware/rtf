"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Plus, Edit, Trash2, Save, Calendar } from "lucide-react"
import Link from "next/link"
import { handleConvexError } from "@/lib/errorHandler"
import { ImagePicker } from "@/components/ImagePicker"
import ConvexImage from "@/components/ConvexImage"

interface EditHerdPageProps {
    params: {
        herdId: string
    }
}

const EditHerdPage = ({ params }: EditHerdPageProps) => {
    const router = useRouter()
    const herdId = params.herdId as Id<"herds">
    
    const herd = useQuery(api.herds.getHerd, { id: herdId })
    const timeline = useQuery(api.herds.getHerdTimeline, { herdId })
    const updateHerd = useMutation(api.herds.updateHerd)
    const createTimelineItem = useMutation(api.timelineItems.createTimelineItem)
    const updateTimelineItem = useMutation(api.timelineItems.updateTimelineItem)
    const deleteTimelineItem = useMutation(api.timelineItems.deleteTimelineItem)
    const addTimelineItem = useMutation(api.herds.addTimelineItem)
    const removeTimelineItem = useMutation(api.herds.removeTimelineItem)

    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
    const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false)
    const [editingTimelineId, setEditingTimelineId] = useState<Id<"timelineItem"> | null>(null)
    const [confirmDeleteTimelineId, setConfirmDeleteTimelineId] = useState<Id<"timelineItem"> | null>(null)
    const [isTimelineImagePickerOpen, setIsTimelineImagePickerOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        imageId: "",
    })

    const [timelineFormData, setTimelineFormData] = useState({
        order: 0,
        date: "",
        title: "",
        description: "",
        imageId: "",
    })

    const [isSaving, setIsSaving] = useState(false)

    // Update form data when herd loads
    useEffect(() => {
        if (herd) {
            setFormData({
                name: herd.name,
                slug: herd.slug,
                description: herd.description || "",
                imageId: herd.imageId || "",
            })
        }
    }, [herd])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateHerd({
                id: herdId,
                name: formData.name,
                description: formData.description || undefined,
                imageId: formData.imageId as Id<"images"> || undefined,
            })
            alert("Herd saved successfully!")
        } catch (error: any) {
            console.error("Error saving herd:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "save herd", router)
            } else {
                alert("Failed to save herd: " + (error?.message || "Unknown error"))
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleCreateTimeline = async () => {
        try {
            const timelineItemId = await createTimelineItem({
                order: timelineFormData.order,
                date: timelineFormData.date,
                title: timelineFormData.title,
                description: timelineFormData.description,
                imageId: timelineFormData.imageId as Id<"images"> || undefined,
            })

            await addTimelineItem({
                herdId,
                timelineItemId,
            })

            setIsTimelineDialogOpen(false)
            resetTimelineForm()
        } catch (error: any) {
            console.error("Error creating timeline item:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "create timeline item", router)
            } else {
                alert("Failed to create timeline item: " + (error?.message || "Unknown error"))
            }
        }
    }

    const handleUpdateTimeline = async () => {
        if (!editingTimelineId) return
        try {
            await updateTimelineItem({
                id: editingTimelineId,
                order: timelineFormData.order,
                date: timelineFormData.date,
                title: timelineFormData.title,
                description: timelineFormData.description,
                imageId: timelineFormData.imageId as Id<"images"> || undefined,
            })

            setIsTimelineDialogOpen(false)
            setEditingTimelineId(null)
            resetTimelineForm()
        } catch (error: any) {
            console.error("Error updating timeline item:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "update timeline item", router)
            } else {
                alert("Failed to update timeline item: " + (error?.message || "Unknown error"))
            }
        }
    }

    const handleDeleteTimeline = async (timelineId: Id<"timelineItem">) => {
        try {
            await removeTimelineItem({ herdId, timelineItemId: timelineId })
            await deleteTimelineItem({ id: timelineId })
            setConfirmDeleteTimelineId(null)
        } catch (error: any) {
            console.error("Error deleting timeline item:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "delete timeline item", router)
            } else {
                alert("Failed to delete timeline item: " + (error?.message || "Unknown error"))
            }
        }
    }

    const openEditTimelineDialog = (item: any) => {
        setEditingTimelineId(item._id)
        setTimelineFormData({
            order: item.order,
            date: item.date,
            title: item.title,
            description: item.description,
            imageId: item.imageId || "",
        })
        setIsTimelineDialogOpen(true)
    }

    const resetTimelineForm = () => {
        setTimelineFormData({
            order: timeline ? timeline.length : 0,
            date: "",
            title: "",
            description: "",
            imageId: "",
        })
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (herd === undefined || timeline === undefined) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="h-48 bg-gray-200 rounded"></div>
                        <div className="h-48 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (herd === null) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Herd not found</h2>
                    <p className="text-gray-600 mb-4">The herd you're looking for doesn't exist.</p>
                    <Link href="/admin/animals">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Animals
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/animals">
                    <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Animals
                    </Button>
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{herd.name}</h1>
                        <p className="text-gray-600 mt-1">Slug: {herd.slug}</p>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Herd Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Herd Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Herd name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    The slug is automatically generated from the name
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the herd"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <Label>Image</Label>
                                <div className="space-y-2">
                                    {herd.image?.url && (
                                        <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                                            <ConvexImage
                                                src={herd.image.url}
                                                alt={herd.name}
                                                width={herd.image.width || 800}
                                                height={herd.image.height || 600}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsImagePickerOpen(true)}
                                            className="flex-1"
                                        >
                                            {formData.imageId ? "Change" : "Select"} Image
                                        </Button>
                                        {formData.imageId && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setFormData(prev => ({ ...prev, imageId: "" }))}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Timeline</CardTitle>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        resetTimelineForm()
                                        setEditingTimelineId(null)
                                        setIsTimelineDialogOpen(true)
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Timeline Item
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {timeline.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No timeline items yet. Add one to get started.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {timeline.map((item) => (
                                        <div
                                            key={item._id}
                                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">Order: {item.order}</Badge>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {item.date}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditTimelineDialog(item)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setConfirmDeleteTimelineId(item._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                            <p className="text-gray-600 text-sm">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Created</p>
                                <p className="font-medium">{formatDate(herd._creationTime)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Last Updated</p>
                                <p className="font-medium">{formatDate(herd.updatedAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Timeline Items</p>
                                <p className="font-medium">{timeline.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Image Picker Modal */}
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={(imageData) => {
                    setFormData(prev => ({ ...prev, imageId: imageData.imageId }))
                }}
                title="Select Herd Image"
                description="Choose an image for this herd"
            />

            {/* Timeline Dialog */}
            <Dialog open={isTimelineDialogOpen} onOpenChange={setIsTimelineDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingTimelineId ? "Edit" : "Add"} Timeline Item</DialogTitle>
                        <DialogDescription>
                            {editingTimelineId ? "Update" : "Create"} a timeline item for this herd.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="order">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={timelineFormData.order}
                                    onChange={(e) => setTimelineFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="text"
                                    value={timelineFormData.date}
                                    onChange={(e) => setTimelineFormData(prev => ({ ...prev, date: e.target.value }))}
                                    placeholder="e.g., October - November 2023"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={timelineFormData.title}
                                onChange={(e) => setTimelineFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Timeline item title"
                            />
                        </div>

                        <div>
                            <Label htmlFor="timeline-description">Description</Label>
                            <Textarea
                                id="timeline-description"
                                value={timelineFormData.description}
                                onChange={(e) => setTimelineFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe this timeline item"
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label>Image (Optional)</Label>
                            <div className="space-y-2">
                                {timelineFormData.imageId ? (
                                    <div className="text-sm text-gray-600">
                                        Image selected
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        No image selected
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsTimelineImagePickerOpen(true)}
                                        className="flex-1"
                                    >
                                        {timelineFormData.imageId ? "Change" : "Select"} Image
                                    </Button>
                                    {timelineFormData.imageId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setTimelineFormData(prev => ({ ...prev, imageId: "" }))}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => {
                                setIsTimelineDialogOpen(false)
                                setEditingTimelineId(null)
                                resetTimelineForm()
                            }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={editingTimelineId ? handleUpdateTimeline : handleCreateTimeline}
                                disabled={!timelineFormData.title || !timelineFormData.description}
                            >
                                {editingTimelineId ? "Update" : "Create"} Timeline Item
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Timeline Image Picker Modal */}
            <ImagePicker
                isOpen={isTimelineImagePickerOpen}
                onClose={() => setIsTimelineImagePickerOpen(false)}
                onImageSelect={(imageData) => {
                    setTimelineFormData(prev => ({ ...prev, imageId: imageData.imageId }))
                }}
                title="Select Timeline Image"
                description="Choose an image for this timeline item"
            />

            {/* Delete Timeline Confirmation Dialog */}
            <AlertDialog open={!!confirmDeleteTimelineId} onOpenChange={() => setConfirmDeleteTimelineId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the timeline item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteTimelineId && handleDeleteTimeline(confirmDeleteTimelineId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default EditHerdPage

