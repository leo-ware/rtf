"use client"

import { useState, useEffect, use } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Calendar, Code, Image as ImageIcon, Video } from "lucide-react"
import Link from "next/link"
import { handleConvexError } from "@/lib/errorHandler"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import { ImagePicker } from "@/components/images/ImagePicker"
import TimelineCreateDialog from "./TimelineCreateDialog"
import TimelineDeleteDialog from "./TimelineDeleteDialog"
import { TiptapEditor } from "@/components/TiptapEditor"
import DonationFormSection from "@/components/DonationFormAdmin/DonationFormSection"
import ReorderableList from "@/components/ReorderableList"
import GalleryItemPicker, { GalleryItemType } from "@/components/GalleryItemPicker"
import VideoPickerDialog from "@/components/VideoPickerDialog"
import { VideoSource } from "@/lib/videoUtils"
import { ArticleRenderer } from "@/components/ArticleRenderer"

type EditHerdPageProps = {
    params: Promise<{
        herdId: string
    }>
}

const EditHerdPage = ({ params }: EditHerdPageProps) => {
    const router = useRouter()
    const herdId = use(params).herdId as Id<"herds">

    const herd = useQuery(api.herds.getHerd, { id: herdId })
    const timeline = useQuery(api.herds.getHerdTimeline, { herdId })
    const updateHerd = useMutation(api.herds.updateHerd)
    const reorderTimeline = useMutation(api.timelineItems.reorderTimelineItems)
    const createImageGalleryItem = useMutation(api.galleryItems.createImageGalleryItem)
    const createVideoGalleryItem = useMutation(api.galleryItems.createVideoGalleryItem)
    const deleteGalleryItem = useMutation(api.galleryItems.deleteGalleryItem)

    const galleryItemsRaw = useQuery(api.herds.getHerdGalleryItems, {
        ids: [herdId],
    })
    const galleryItemsServer = galleryItemsRaw?.[0]?.items || []

    const [formData, setFormData] = useState({
        _initialized: false,
        name: "",
        slug: "",
        description: "",
        imageId: null as Id<"images"> | null,
        gallery: [] as GalleryItemType[],
        content: undefined as string | undefined,
        donationFormId: undefined as Id<"donationForms"> | null | undefined,
    })

    const [isSaving, setIsSaving] = useState(false)
    const [idxGalleryImagePickerOpen, setIdxGalleryImagePickerOpen] = useState<number | null>(null)
    const [emptyImagePickerOpen, setEmptyImagePickerOpen] = useState(false)
    const [videoPickerOpen, setVideoPickerOpen] = useState(false)

    // Update form data when herd loads
    useEffect(() => {
        if (herd && !formData._initialized) {
            setFormData(prev => ({
                ...prev,
                _initialized: true,
                name: herd.name,
                slug: herd.slug,
                description: herd.description || "",
                imageId: (herd.imageId as Id<"images">) || null,
                content: herd.content || "",
                donationFormId: herd.donationFormId ?? undefined,
            }))
        }
    }, [herd])

    // Hydrate gallery from server
    useEffect(() => {
        if (galleryItemsServer && galleryItemsServer.length > 0) {
            const validItems: GalleryItemType[] = galleryItemsServer
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

            setFormData(prev => ({ ...prev, gallery: validItems }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galleryItemsServer.map(item => item?._id).sort().join(",")])

    const handleGalleryReorder = (newOrder: string[]) => {
        const reorderedGallery = newOrder
            .map(id => formData.gallery.find(item => item.galleryItemId === id))
            .filter((item): item is GalleryItemType => item !== undefined)
        setFormData(prev => ({ ...prev, gallery: reorderedGallery }))
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
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery, newItem] }))
            setEmptyImagePickerOpen(false)
        } catch (error: any) {
            console.error("Error creating gallery item:", error)
            alert(error?.message || "Failed to add image to gallery.")
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
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery, newItem] }))
            setVideoPickerOpen(false)
        } catch (error: any) {
            console.error("Error creating video gallery item:", error)
            alert(error?.message || "Failed to add video to gallery.")
        }
    }

    const handleDeleteGalleryItem = async (index: number) => {
        const item = formData.gallery[index]
        if (item && item.galleryItemId) {
            try {
                await deleteGalleryItem({ id: item.galleryItemId })
            } catch (error) {
                console.error("Error deleting gallery item:", error)
            }
        }
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }))
    }

    const handleGalleryImageChange = async (index: number, imageData: { imageId: Id<"images">; url: string }) => {
        const item = formData.gallery[index]
        if (item && item.type === "image") {
            if (item.galleryItemId) {
                try {
                    await deleteGalleryItem({ id: item.galleryItemId })
                } catch (error) {
                    console.error("Error deleting old gallery item:", error)
                }
            }
            const newGalleryItemId = await createImageGalleryItem({ imageId: imageData.imageId })
            const newItem: GalleryItemType = {
                type: "image",
                galleryItemId: newGalleryItemId,
                imageId: imageData.imageId,
                url: imageData.url,
            }
            setFormData(prev => ({
                ...prev,
                gallery: prev.gallery.map((g, i) => i === index ? newItem : g)
            }))
        }
        setIdxGalleryImagePickerOpen(null)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const validGallery = formData.gallery
                .map(item => item.galleryItemId)
                .filter((id): id is Id<"galleryItems"> => id !== undefined && id !== null)

            await updateHerd({
                id: herdId,
                name: formData.name,
                description: formData.description || undefined,
                imageId: formData.imageId || undefined,
                gallery: validGallery.length > 0 ? validGallery : undefined,
                content: formData.content || "",
                donationFormId: formData.donationFormId ?? undefined,
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

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const handleTimelineReorder = async (newOrder: Id<"timelineItem">[]) => {
        const items = newOrder.map((id, index) => ({ id, order: index }))
        await reorderTimeline({ items })
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
            <div className="flex mb-8 justify-between items-start">
                <Link href="/admin/animals">
                    <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Animals
                    </Button>
                </Link>

                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Timeline</CardTitle>
                                <TimelineCreateDialog
                                    herdId={herdId}
                                    mode="create"
                                    defaultOrder={timeline.length}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {timeline.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No timeline items yet. Add one to get started.
                                </div>
                            ) : (
                                <ReorderableList
                                    items={timeline.map((item) => ({
                                        id: item._id,
                                        widget: (
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {item.date}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <TimelineCreateDialog
                                                            herdId={herdId}
                                                            mode="edit"
                                                            editItem={item}
                                                        />
                                                        <TimelineDeleteDialog
                                                            herdId={herdId}
                                                            timelineItemId={item._id}
                                                        />
                                                    </div>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                                <ArticleRenderer content={item.description} className="text-gray-600 text-sm" />
                                            </div>
                                        ),
                                    }))}
                                    onReorder={handleTimelineReorder}
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Gallery Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Gallery</CardTitle>
                            <CardDescription>
                                Manage images and videos for the herd's gallery
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <ReorderableList
                                    items={formData.gallery.map((item, index) => ({
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
                                    onReorder={handleGalleryReorder}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setEmptyImagePickerOpen(true)}
                                    className="flex-1"
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Add Image
                                </Button>
                                <Button
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

                            {formData.gallery.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No gallery items yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Add images or videos to create a gallery</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(typeof formData.content === "string") && (
                                <TiptapEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
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
                                <ImagePickerDialog
                                    imageId={formData.imageId}
                                    onImageSelect={(imageId) => setFormData(prev => ({ ...prev, imageId }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-4 w-4 mr-2" />
                                Donation Form
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DonationFormSection
                                donationFormId={formData.donationFormId}
                                setDonationFormId={(donationFormId) => setFormData((prev) => ({ ...prev, donationFormId }))}
                            />
                        </CardContent>
                    </Card>

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
        </div>
    )
}

export default EditHerdPage
