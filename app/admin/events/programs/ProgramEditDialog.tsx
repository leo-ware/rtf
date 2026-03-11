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
import { Edit, Loader2, Image as ImageIcon, Video } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import { ImagePicker } from "@/components/images/ImagePicker"
import LocationPickerDialog from "@/components/locations/LocationPickerDialog"
import { TiptapEditor } from "@/components/TiptapEditor"
import { Switch } from "@/components/ui/switch"
import GalleryItemPicker, { GalleryItemType } from "@/components/GalleryItemPicker"
import VideoPickerDialog from "@/components/VideoPickerDialog"
import ReorderableList from "@/components/ReorderableList"
import { VideoSource } from "@/lib/videoUtils"

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
    const createImageGalleryItem = useMutation(api.galleryItems.createImageGalleryItem)
    const createVideoGalleryItem = useMutation(api.galleryItems.createVideoGalleryItem)
    const deleteGalleryItemMutation = useMutation(api.galleryItems.deleteGalleryItem)

    const galleryItemsRaw = useQuery(api.galleryItems.getGalleryItems,
        program?.gallery && program.gallery.length > 0
            ? { ids: program.gallery }
            : "skip"
    )

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [gallery, setGallery] = useState<GalleryItemType[]>([])
    const [idxGalleryImagePickerOpen, setIdxGalleryImagePickerOpen] = useState<number | null>(null)
    const [emptyImagePickerOpen, setEmptyImagePickerOpen] = useState(false)
    const [videoPickerOpen, setVideoPickerOpen] = useState(false)

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

    // Sync gallery items from server
    useEffect(() => {
        if (galleryItemsRaw && galleryItemsRaw.length > 0) {
            const validItems: GalleryItemType[] = galleryItemsRaw
                .filter((item): item is NonNullable<typeof item> => item !== null)
                .map(item => {
                    if (item.type === "image" && item.imageId && item.image) {
                        return {
                            type: "image" as const,
                            galleryItemId: item._id,
                            imageId: item.imageId,
                            url: item.image.url || "",
                            altText: item.image.altText,
                        }
                    } else if (item.type === "video" && item.videoSource && item.videoId) {
                        return {
                            type: "video" as const,
                            galleryItemId: item._id,
                            videoSource: item.videoSource,
                            videoId: item.videoId,
                            videoTitle: item.videoTitle,
                            thumbnailUrl: item.thumbnailUrl,
                        }
                    }
                    return null
                })
                .filter((item): item is GalleryItemType => item !== null)
            setGallery(validItems)
        } else if (galleryItemsRaw && galleryItemsRaw.length === 0) {
            setGallery([])
        }
    }, [galleryItemsRaw?.map(item => item?._id).sort().join(",")])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name ||
        !formData.description ||
        !formData.locationId ||
        !formData.programGroupId
    )

    const handleGalleryReorder = (newOrder: string[]) => {
        const reorderedGallery = newOrder
            .map(id => gallery.find(item => item.galleryItemId === id))
            .filter((item): item is GalleryItemType => item !== undefined)
        setGallery(reorderedGallery)
    }

    const handleAddImage = async (imageData: { imageId: Id<"images">; url: string }) => {
        try {
            const galleryItemId = await createImageGalleryItem({ imageId: imageData.imageId })
            const newItem: GalleryItemType = {
                type: "image",
                galleryItemId,
                imageId: imageData.imageId,
                url: imageData.url,
            }
            const newGallery = [...gallery, newItem]
            setGallery(newGallery)
            setEmptyImagePickerOpen(false)
            await updateProgram({
                id: programId,
                gallery: newGallery.map(item => item.galleryItemId),
            })
        } catch (err) {
            console.error("Error adding gallery image:", err)
            setError(`Failed to add image. ${err}`)
        }
    }

    const handleAddVideo = async (videoData: {
        videoSource: VideoSource
        videoId: string
        videoTitle?: string
        thumbnailUrl?: string
    }) => {
        try {
            const galleryItemId = await createVideoGalleryItem({
                videoSource: videoData.videoSource,
                videoId: videoData.videoId,
                videoTitle: videoData.videoTitle,
                thumbnailUrl: videoData.thumbnailUrl,
            })
            const newItem: GalleryItemType = {
                type: "video",
                galleryItemId,
                videoSource: videoData.videoSource,
                videoId: videoData.videoId,
                videoTitle: videoData.videoTitle,
                thumbnailUrl: videoData.thumbnailUrl,
            }
            const newGallery = [...gallery, newItem]
            setGallery(newGallery)
            setVideoPickerOpen(false)
            await updateProgram({
                id: programId,
                gallery: newGallery.map(item => item.galleryItemId),
            })
        } catch (err) {
            console.error("Error adding gallery video:", err)
            setError(`Failed to add video. ${err}`)
        }
    }

    const handleDeleteGalleryItem = async (index: number) => {
        const item = gallery[index]
        if (item && item.galleryItemId) {
            try {
                await deleteGalleryItemMutation({ id: item.galleryItemId })
            } catch (err) {
                console.error("Error deleting gallery item:", err)
            }
        }
        const newGallery = gallery.filter((_, i) => i !== index)
        setGallery(newGallery)
        await updateProgram({
            id: programId,
            gallery: newGallery.map(item => item.galleryItemId),
        })
    }

    const handleGalleryImageChange = async (index: number, imageData: { imageId: Id<"images">; url: string }) => {
        const item = gallery[index]
        if (item && item.type === "image") {
            if (item.galleryItemId) {
                try {
                    await deleteGalleryItemMutation({ id: item.galleryItemId })
                } catch (err) {
                    console.error("Error deleting old gallery item:", err)
                }
            }
            const newGalleryItemId = await createImageGalleryItem({ imageId: imageData.imageId })
            const newItem: GalleryItemType = {
                type: "image",
                galleryItemId: newGalleryItemId,
                imageId: imageData.imageId,
                url: imageData.url,
            }
            const newGallery = gallery.map((g, i) => i === index ? newItem : g)
            setGallery(newGallery)
            await updateProgram({
                id: programId,
                gallery: newGallery.map(item => item.galleryItemId),
            })
        }
        setIdxGalleryImagePickerOpen(null)
    }

    const handleGalleryReorderAndSave = async (newOrder: string[]) => {
        handleGalleryReorder(newOrder)
        const reorderedGallery = newOrder
            .map(id => gallery.find(item => item.galleryItemId === id))
            .filter((item): item is GalleryItemType => item !== undefined)
        await updateProgram({
            id: programId,
            gallery: reorderedGallery.map(item => item.galleryItemId),
        })
    }

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

                    <div>
                        <Label>Gallery</Label>
                        <div className="space-y-3 mt-2">
                            <ReorderableList
                                items={gallery.map((item, index) => ({
                                    id: item.galleryItemId,
                                    widget: (
                                        <GalleryItemPicker
                                            item={item}
                                            imagePickerOpen={idxGalleryImagePickerOpen === index}
                                            onOpenImagePicker={() => setIdxGalleryImagePickerOpen(index)}
                                            onCloseImagePicker={() => setIdxGalleryImagePickerOpen(null)}
                                            onDelete={() => handleDeleteGalleryItem(index)}
                                            onImageChange={(imageData) => handleGalleryImageChange(index, imageData)}
                                        />
                                    ),
                                }))}
                                onReorder={handleGalleryReorderAndSave}
                            />

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEmptyImagePickerOpen(true)}
                                    className="flex-1"
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Add Image
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setVideoPickerOpen(true)}
                                    className="flex-1"
                                >
                                    <Video className="h-4 w-4 mr-2" />
                                    Add Video
                                </Button>
                            </div>

                            <ImagePicker
                                isOpen={emptyImagePickerOpen}
                                onClose={() => setEmptyImagePickerOpen(false)}
                                onImageSelect={handleAddImage}
                            />

                            <VideoPickerDialog
                                isOpen={videoPickerOpen}
                                onClose={() => setVideoPickerOpen(false)}
                                onVideoSelect={handleAddVideo}
                            />

                            {gallery.length === 0 && (
                                <div className="text-center py-4 border-2 border-dashed rounded-lg">
                                    <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                    <p className="text-sm text-gray-500">No gallery items yet</p>
                                </div>
                            )}
                        </div>
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
