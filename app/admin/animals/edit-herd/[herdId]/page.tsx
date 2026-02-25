"use client"

import { useState, useEffect, use } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Calendar, Code } from "lucide-react"
import Link from "next/link"
import { handleConvexError } from "@/lib/errorHandler"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import TimelineCreateDialog from "./TimelineCreateDialog"
import TimelineDeleteDialog from "./TimelineDeleteDialog"
import { TiptapEditor } from "@/components/TiptapEditor"
import DonationFormSection from "@/components/DonationFormAdmin/DonationFormSection"
import ReorderableList from "@/components/ReorderableList"

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

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        imageId: null as Id<"images"> | null,
        content: undefined as string | undefined,
        donationFormId: undefined as Id<"donationForms"> | null | undefined,
    })

    const [isSaving, setIsSaving] = useState(false)

    // Update form data when herd loads
    useEffect(() => {
        if (herd) {
            setFormData({
                name: herd.name,
                slug: herd.slug,
                description: herd.description || "",
                imageId: (herd.imageId as Id<"images">) || null,
                content: herd.content || "",
                donationFormId: herd.donationFormId ?? undefined,
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
                imageId: formData.imageId || undefined,
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
                                                <p className="text-gray-600 text-sm">{item.description}</p>
                                            </div>
                                        ),
                                    }))}
                                    onReorder={handleTimelineReorder}
                                />
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
