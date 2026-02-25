"use client"

import { use, useEffect, useState } from "react"
import { useQuery, useMutation, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { notFound } from "next/navigation"
import { TiptapEditor } from "@/components/TiptapEditor"
import { ImagePicker } from "@/components/images/ImagePicker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Alert,
    AlertTitle,
    AlertDescription,
} from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
    Save,
    ArrowLeft,
    Calendar,
    User,
    Settings,
    ExternalLink,
    Heart,
    Image as ImageIcon,
    Trash2,
    Code,
    Video
} from "lucide-react"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"
import ConvexImage from "@/components/images/ConvexImage"
import { formatDate, generateSlug } from "@/lib/utils"
import GalleryItemPicker, { GalleryItemType } from "@/components/GalleryItemPicker"
import VideoPickerDialog from "@/components/VideoPickerDialog"
import DonationFormSection from "@/components/DonationFormAdmin/DonationFormSection"
import ReorderableList from "@/components/ReorderableList"
import { VideoSource } from "@/lib/videoUtils"


type AnimalEditPageProps = {
    params: Promise<{
        animalId: string
    }>
}

type FormDataType = {
    _initialized: boolean
    name: string
    slug: string
    type: "horse" | "burro"
    herdId: Id<"herds"> | undefined
    description: string
    imageId: string | Id<"images">
    gallery: GalleryItemType[]
    gender: string
    dob: number | undefined
    sanctuary: string
    inMemoriam: boolean | undefined
    adoptable: boolean | undefined
    adoptionFee: string
    content: string
    donationFormId: Id<"donationForms"> | null | undefined
}

const AnimalEditPage = ({ params }: AnimalEditPageProps) => {
    const resolvedParams = use(params)
    const animal = useQuery(api.animals.getAnimal, {
        id: resolvedParams.animalId as Id<"animals">,
    })
    const {results: herds} = usePaginatedQuery(api.herds.listHerds, {}, {initialNumItems: 100})
    const updateAnimal = useMutation(api.animals.updateAnimal)
    const createImageGalleryItem = useMutation(api.galleryItems.createImageGalleryItem)
    const createVideoGalleryItem = useMutation(api.galleryItems.createVideoGalleryItem)
    const deleteGalleryItem = useMutation(api.galleryItems.deleteGalleryItem)

    const galleryItemsRaw = useQuery(api.animals.getAnimalGalleryItems,
        { ids: (animal && animal._id) ? [animal._id] : [] as Id<"animals">[] }
    )
    const galleryItemsServer = galleryItemsRaw?.[0]?.items || []

    const [formData, setFormData] = useState<FormDataType>({
        _initialized: false,
        name: "",
        slug: "",
        type: "horse",
        herdId: "" as Id<"herds">,
        description: "",
        imageId: "",
        gallery: [],
        gender: "",
        dob: undefined,
        sanctuary: "",
        inMemoriam: undefined,
        adoptable: undefined,
        adoptionFee: "",
        content: "",
        donationFormId: undefined,
    })

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

            setFormData(prev => ({
                ...prev,
                gallery: validItems
            }))
        }
    }, [galleryItemsServer.map(item => item?._id).sort().join(",")])

    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [isPrimaryImagePickerOpen, setIsPrimaryImagePickerOpen] = useState(false)
    const [idxGalleryImagePickerOpen, setIdxGalleryImagePickerOpen] = useState<number | null>(null)
    const [emptyImagePickerOpen, setEmptyImagePickerOpen] = useState(false)
    const [videoPickerOpen, setVideoPickerOpen] = useState(false)

    useEffect(() => {
        if (animal && !formData._initialized) {
            setFormData(prev => ({
                ...prev,
                _initialized: !!animal._id,
                name: animal.name,
                slug: animal.slug,
                type: animal.type,
                herdId: animal.herdId,
                description: animal.description,
                imageId: animal.imageId || "",
                gender: animal.gender || "",
                dob: animal.dob || undefined,
                sanctuary: animal.sanctuary || "",
                inMemoriam: animal.inMemoriam,
                adoptable: animal.adoptable,
                adoptionFee: animal.adoptionFee || "",
                content: animal.content || "",
                donationFormId: animal.donationFormId ?? undefined,
            }))
        }
    }, [animal])

    // Determine if there are unsaved changes
    useEffect(() => {
        if (animal) {
            const currentGalleryIds = formData.gallery.map(item => item.galleryItemId).sort().join(",")
            const serverGalleryIds = (animal.gallery || []).sort().join(",")
            const hasChanges =
                formData.name !== animal.name ||
                formData.slug !== animal.slug ||
                formData.type !== animal.type ||
                formData.herdId !== animal.herdId ||
                formData.description !== animal.description ||
                formData.imageId !== (animal.imageId || "") ||
                currentGalleryIds !== serverGalleryIds ||
                formData.gender !== (animal.gender || "") ||
                formData.dob !== (animal.dob || undefined) ||
                formData.sanctuary !== (animal.sanctuary || "") ||
                formData.inMemoriam !== animal.inMemoriam ||
                formData.adoptable !== animal.adoptable ||
                formData.adoptionFee !== (animal.adoptionFee || "") ||
                formData.content !== (animal.content || "") ||
                formData.donationFormId !== (animal.donationFormId ?? undefined)
            setHasUnsavedChanges(hasChanges)
        }
    }, [formData, animal])

    const handleSave = async () => {
        if (!animal) return

        setIsSaving(true)
        try {
            const validGallery = formData.gallery
                .map(item => item.galleryItemId)
                .filter(id => id !== undefined && id !== null)

            await updateAnimal({
                id: animal._id,
                name: formData.name,
                slug: formData.slug,
                type: formData.type,
                herdId: formData.herdId,
                description: formData.description,
                content: formData.content || undefined,
                imageId: formData.imageId as Id<"images"> || undefined,
                gallery: validGallery.length > 0 ? validGallery : undefined,
                gender: formData.gender || undefined,
                dob: formData.dob || undefined,
                sanctuary: formData.sanctuary || undefined,
                inMemoriam: formData.inMemoriam,
                adoptable: formData.adoptable,
                adoptionFee: formData.adoptionFee || undefined,
                donationFormId: formData.donationFormId ?? undefined,
            })

            setLastSaved(new Date())
            setHasUnsavedChanges(false)
        } catch (error: any) {
            console.error("Error saving animal:", error)
            setErrorMessage(error?.message || "Failed to save animal. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleImageSelect = (imageData: { imageId: Id<"images">; url: string }) => {
        setFormData(prev => ({ ...prev, imageId: imageData.imageId }))
    }

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
            setFormData(prev => ({
                ...prev,
                gallery: [...prev.gallery, newItem]
            }))
            setEmptyImagePickerOpen(false)
        } catch (error: any) {
            console.error("Error creating gallery item:", error)
            setErrorMessage(error?.message || "Failed to add image to gallery.")
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
            setFormData(prev => ({
                ...prev,
                gallery: [...prev.gallery, newItem]
            }))
            setVideoPickerOpen(false)
        } catch (error: any) {
            console.error("Error creating video gallery item:", error)
            setErrorMessage(error?.message || "Failed to add video to gallery.")
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
            // Delete old gallery item and create new one
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

    if (animal === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="h-96 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (animal === null) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {errorMessage && (
                <Alert variant="destructive">
                    <AlertTitle>Error Saving Animal</AlertTitle>
                    <AlertDescription>
                        {errorMessage}
                    </AlertDescription>
                    <Button size="sm" onClick={() => setErrorMessage(null)}>OK</Button>
                </Alert>
            )}
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/animals">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Animals
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Edit Animal</h1>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    {lastSaved && (
                                        <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                                    )}
                                    {hasUnsavedChanges && (
                                        <Badge variant="secondary">Unsaved changes</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Link href={`/horses/our-horses/${animal.slug}`} target="_blank">
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Live
                                </Button>
                            </Link>
                            <Button
                                onClick={() => handleSave()}
                                disabled={isSaving || !hasUnsavedChanges}
                                size="sm"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Animal Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Animal Story</CardTitle>
                                <CardDescription>
                                    Write the animal's story using the rich text editor (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {formData._initialized && (
                                    <TiptapEditor
                                        content={formData.content}
                                        onChange={(content) => setFormData(prev => ({ ...prev, content: content }))}
                                        placeholder="Tell this animal's story..."
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* Gallery Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Gallery</CardTitle>
                                <CardDescription>
                                    Manage images and videos for the animal's gallery
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
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Animal Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Animal Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                name: e.target.value,
                                                slug: generateSlug(e.target.value)
                                            }))
                                        }}
                                        placeholder="Animal name"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                slug: e.target.value
                                            }))
                                        }}
                                        placeholder="animal-slug"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        URL: /horses/our-horses/{formData.slug || "animal-slug"}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={formData.type} onValueChange={(value: "horse" | "burro") => setFormData(prev => ({ ...prev, type: value }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="horse">Horse</SelectItem>
                                            <SelectItem value="burro">Burro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="herdId">Herd</Label>
                                    <Select
                                        defaultValue="__undefined"
                                        value={formData.herdId}
                                        onValueChange={(value: Id<"herds">) => (
                                            setFormData(prev => ({ ...prev, herdId: value === "__undefined" ? undefined : value }))
                                        )}
                                        >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"__undefined"}>None</SelectItem>
                                            {herds?.map((herd) => (
                                                <SelectItem key={herd._id} value={herd._id}>
                                                    {herd.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Brief description of the animal"
                                        rows={3}
                                    />
                                </div>

                                <Separator />

                                <div>
                                    <Label htmlFor="gender">Gender</Label>
                                    <Input
                                        id="gender"
                                        value={formData.gender}
                                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                        placeholder="e.g., Male, Female, Stallion, Mare"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value ? new Date(e.target.value).getTime() : undefined }))}
                                        placeholder="Date of Birth"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sanctuary">Sanctuary</Label>
                                    <Input
                                        id="sanctuary"
                                        value={formData.sanctuary}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sanctuary: e.target.value }))}
                                        placeholder="e.g., Lompoc Sanctuary"
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="inMemoriam"
                                            checked={formData.inMemoriam}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inMemoriam: checked }))}
                                        />
                                        <Label htmlFor="inMemoriam" className="flex items-center">
                                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                                            In Memoriam
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="adoptable"
                                            checked={formData.adoptable}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, adoptable: checked }))}
                                        />
                                        <Label htmlFor="adoptable">
                                            Available for Adoption
                                        </Label>
                                    </div>

                                    {formData.adoptable && (
                                        <div>
                                            <Label htmlFor="adoptionFee">Adoption Fee</Label>
                                            <Input
                                                id="adoptionFee"
                                                value={formData.adoptionFee}
                                                onChange={(e) => setFormData(prev => ({ ...prev, adoptionFee: e.target.value }))}
                                                placeholder="e.g., $2000, Contact us"
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Featured Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {animal.image?.url ? (
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <ConvexImage
                                            src={animal.image.url}
                                            alt={formData.name}
                                            width={animal.image.width || 400}
                                            height={animal.image.height || 400}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <div className="text-center">
                                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No image selected</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsPrimaryImagePickerOpen(true)}
                                        className="flex-1"
                                    >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        {formData.imageId ? "Change" : "Select"} Image
                                    </Button>
                                    <ImagePicker
                                        isOpen={isPrimaryImagePickerOpen}
                                        onClose={() => setIsPrimaryImagePickerOpen(false)}
                                        onImageSelect={handleImageSelect}
                                    />
                                    {formData.imageId && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setFormData(prev => ({ ...prev, imageId: "" }))}
                                        >
                                            Remove
                                        </Button>
                                    )}
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

                        {/* Animal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Animal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>Herd: {animal.herd ? animal.herd.name : "None"}</span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Created: {formatDate(new Date(animal._creationTime))}</span>
                                </div>

                                <Separator />

                                <div className="text-sm text-gray-600">
                                    <p>Words: {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</p>
                                    <p>Characters: {formData.content.replace(/<[^>]*>/g, '').length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Error Dialog */}
            <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error Saving Animal</AlertDialogTitle>
                        <AlertDialogDescription>
                            {errorMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setErrorMessage(null)}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AnimalEditPage
