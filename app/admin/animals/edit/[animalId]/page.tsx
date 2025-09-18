"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { notFound } from "next/navigation"
import { TiptapEditor } from "@/components/TiptapEditor"
import { ImagePicker } from "@/components/ImagePicker"
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
    Save,
    Eye,
    EyeOff,
    ArrowLeft,
    ExternalLink,
    Calendar,
    User,
    Settings,
    Award,
    Heart,
    Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"
import ConvexImage from "@/components/ConvexImage"

type AnimalEditPageProps = {
    params: Promise<{
        animalId: string
    }>
}

type AnimalType = {
    _id: Id<"animals">
    _creationTime: number
    name: string
    slug: string
    type: "horse" | "burro"
    herdId: Id<"herds">
    description: string
    content?: string
    imageId?: Id<"images">
    ambassador: boolean
    inMemoriam: boolean
    public: boolean
    createdBy: Id<"users">
    createdAt: number
    updatedAt: number
    herd: {
        _id: Id<"herds">
        name: string
        slug: string
    }
    image?: {
        _id: Id<"images">
        fileName: string
        originalName: string
        mimeType: string
        size: number
        storageId: Id<"_storage">
        altText?: string
        description?: string
        isPublic: boolean
        width?: number
        height?: number
        url: string
    }
}

const AnimalEditPage = ({ params }: AnimalEditPageProps) => {
    const resolvedParams = React.use(params)
    const animal: AnimalType | null | undefined = useQuery(api.animals.getAnimal, {
        id: resolvedParams.animalId as any,
    })
    const herds = useQuery(api.herds.listHerds, { limit: 100 })
    
    return (
        animal && herds ? (
            <AnimalEditPageInner animal={animal} herds={herds} />
        ) : (
            <div>Loading...</div>
        )
    )
}

const AnimalEditPageInner = ({ animal, herds }: { animal: AnimalType, herds: any[] }) => {
    const updateAnimal = useMutation(api.animals.updateAnimal)

    const [formData, setFormData] = useState({
        name: animal.name,
        slug: animal.slug,
        type: animal.type,
        herdId: animal.herdId,
        description: animal.description,
        imageId: animal.imageId || "",
        ambassador: animal.ambassador,
        inMemoriam: animal.inMemoriam,
        public: animal.public,
    })
    const [content, setContent] = useState(animal.content || "")
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)

    // Track changes
    useEffect(() => {
        if (animal) {
            const hasChanges =
                formData.name !== animal.name ||
                formData.slug !== animal.slug ||
                formData.type !== animal.type ||
                formData.herdId !== animal.herdId ||
                formData.description !== animal.description ||
                formData.imageId !== (animal.imageId || "") ||
                formData.ambassador !== animal.ambassador ||
                formData.inMemoriam !== animal.inMemoriam ||
                formData.public !== animal.public ||
                content !== (animal.content || "")
            setHasUnsavedChanges(hasChanges)
        }
    }, [formData, content, animal])

    const handleSave = async (publishNow = false) => {
        if (!animal) return

        setIsSaving(true)
        try {
            await updateAnimal({
                id: animal._id,
                name: formData.name,
                type: formData.type,
                herdId: formData.herdId,
                description: formData.description,
                content: content || undefined,
                imageId: formData.imageId as Id<"images"> || undefined,
                ambassador: formData.ambassador,
                inMemoriam: formData.inMemoriam,
                public: publishNow ? true : formData.public,
            })

            if (publishNow) {
                setFormData(prev => ({ ...prev, public: true }))
            }

            setLastSaved(new Date())
            setHasUnsavedChanges(false)
        } catch (error) {
            console.error("Error saving animal:", error)
            alert("Failed to save animal. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const handlePublicToggle = async () => {
        const newPublicState = !formData.public
        setFormData(prev => ({ ...prev, public: newPublicState }))
        await updateAnimal({
            id: animal._id,
            public: newPublicState,
        })
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const handleImageSelect = (imageData: { imageId: string; imageUrl: string }) => {
        setFormData(prev => ({ ...prev, imageId: imageData.imageId }))
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePublicToggle}
                                disabled={isSaving}
                            >
                                {formData.public ? (
                                    <>
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Make Private
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Make Public
                                    </>
                                )}
                            </Button>

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
                                <TiptapEditor
                                    content={content}
                                    onChange={setContent}
                                    placeholder="Tell this animal's story..."
                                />
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
                                    <Select value={formData.herdId} onValueChange={(value: Id<"herds">) => setFormData(prev => ({ ...prev, herdId: value }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
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

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="ambassador"
                                            checked={formData.ambassador}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ambassador: checked }))}
                                        />
                                        <Label htmlFor="ambassador" className="flex items-center">
                                            <Award className="h-4 w-4 mr-1 text-yellow-500" />
                                            Ambassador
                                        </Label>
                                    </div>

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
                                            id="public"
                                            checked={formData.public}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, public: checked }))}
                                        />
                                        <Label htmlFor="public" className="flex items-center">
                                            {formData.public ? (
                                                <Eye className="h-4 w-4 mr-1 text-green-500" />
                                            ) : (
                                                <EyeOff className="h-4 w-4 mr-1 text-gray-500" />
                                            )}
                                            Public
                                        </Label>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex flex-wrap gap-1">
                                        <Badge variant={formData.public ? "default" : "secondary"}>
                                            {formData.public ? "Public" : "Private"}
                                        </Badge>
                                        {formData.ambassador && (
                                            <Badge variant="outline" className="text-yellow-600">
                                                <Award className="h-3 w-3 mr-1" />
                                                Ambassador
                                            </Badge>
                                        )}
                                        {formData.inMemoriam && (
                                            <Badge variant="outline" className="text-red-600">
                                                <Heart className="h-3 w-3 mr-1" />
                                                In Memoriam
                                            </Badge>
                                        )}
                                    </div>
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
                                        onClick={() => setIsImagePickerOpen(true)}
                                        className="flex-1"
                                    >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        {formData.imageId ? "Change" : "Select"} Image
                                    </Button>
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

                        {/* Animal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Animal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>Herd: {animal.herd.name}</span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Created: {formatDate(animal._creationTime)}</span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Updated: {formatDate(animal.updatedAt)}</span>
                                </div>

                                <Separator />

                                <div className="text-sm text-gray-600">
                                    <p>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</p>
                                    <p>Characters: {content.replace(/<[^>]*>/g, '').length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Image Picker Modal */}
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={handleImageSelect}
                title="Select Animal Image"
                description="Choose an image for this animal"
            />
        </div>
    )
}

export default AnimalEditPage
