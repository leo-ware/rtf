"use client"

import { useState, useEffect, use } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ReorderableList from "@/components/ReorderableList"
import LearnTimelineItemDialog from "./LearnTimelineItemDialog"
import LearnTimelineItemDeleteDialog from "./LearnTimelineItemDeleteDialog"

type EditLearnTimelinePageProps = {
    params: Promise<{
        timelineId: string
    }>
}

const EditLearnTimelinePage = ({ params }: EditLearnTimelinePageProps) => {
    const timelineId = use(params).timelineId as Id<"learnTimelines">

    const timeline = useQuery(api.learnTimelines.getTimeline, { id: timelineId })
    const items = useQuery(api.learnTimelines.listTimelineItems, { timelineId })
    const updateTimeline = useMutation(api.learnTimelines.updateTimeline)
    const reorderItems = useMutation(api.learnTimelines.reorderTimelineItems)

    const [title, setTitle] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (timeline) {
            setTitle(timeline.title)
            setIsPublic(timeline.isPublic)
            document.title = `${timeline.title} - RTF Admin`
        }
    }, [timeline])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateTimeline({
                id: timelineId,
                title: title.trim(),
                isPublic,
            })
        } catch (error: any) {
            console.error("Error saving timeline:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleItemReorder = (newOrder: string[]) => {
        const reorderedItems = newOrder.map((id, index) => ({
            id: id as Id<"learnTimelineItems">,
            order: index,
        }))
        reorderItems({ items: reorderedItems })
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (timeline === undefined || items === undefined) {
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

    if (timeline === null) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline not found</h2>
                    <p className="text-gray-600 mb-4">The timeline you're looking for doesn't exist.</p>
                    <Link href="/admin/learn-timelines">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Timelines
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
                <Link href="/admin/learn-timelines">
                    <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Timelines
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    {timeline.isPublic && (
                        <Link href="/resources/learn" target="_blank">
                            <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Site
                            </Button>
                        </Link>
                    )}
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Items */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Timeline Items</CardTitle>
                                <LearnTimelineItemDialog
                                    timelineId={timelineId}
                                    mode="create"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {items.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No items yet. Add one to get started.
                                </div>
                            ) : (
                                <ReorderableList
                                    items={items.map((item) => ({
                                        id: item._id,
                                        widget: (
                                            <div className="flex items-start gap-4 w-full">
                                                {/* Thumbnail */}
                                                {item.image?.url && (
                                                    <div className="relative h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={item.image.url}
                                                            alt={item.image.altText || item.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        {item.date && (
                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                {item.date}
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2 flex-shrink-0">
                                                            <LearnTimelineItemDialog
                                                                timelineId={timelineId}
                                                                mode="edit"
                                                                editItem={item}
                                                            />
                                                            <LearnTimelineItemDeleteDialog
                                                                itemId={item._id}
                                                                itemTitle={item.title}
                                                            />
                                                        </div>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                                    <p className="text-gray-600 text-sm line-clamp-2">{item.content}</p>
                                                </div>
                                            </div>
                                        ),
                                    }))}
                                    onReorder={handleItemReorder}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="timeline-title">Title</Label>
                                <Input
                                    id="timeline-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Timeline title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="timeline-slug">Slug</Label>
                                <Input
                                    id="timeline-slug"
                                    value={timeline.slug}
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    The slug is automatically generated from the title
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="timeline-public">Published</Label>
                                    <p className="text-sm text-gray-500">
                                        Visible on the Learn page
                                    </p>
                                </div>
                                <Switch
                                    id="timeline-public"
                                    checked={isPublic}
                                    onCheckedChange={setIsPublic}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Created</p>
                                <p className="font-medium">{formatDate(timeline._creationTime)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Items</p>
                                <p className="font-medium">{items.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default EditLearnTimelinePage
