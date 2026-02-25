"use client"

import { useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, BookOpen } from "lucide-react"
import { ImSpinner8 } from "react-icons/im"
import Link from "next/link"
import ReorderableList from "@/components/ReorderableList"
import LearnTimelineCreateDialog from "./LearnTimelineCreateDialog"
import LearnTimelineDeleteDialog from "./LearnTimelineDeleteDialog"

const AdminLearnTimelinesPage = () => {
    useEffect(() => {
        document.title = "Learn Timelines - RTF Admin"
    }, [])

    const timelines = useQuery(api.learnTimelines.listTimelines)
    const reorderTimelines = useMutation(api.learnTimelines.reorderTimelines)

    const handleReorder = (newOrder: string[]) => {
        reorderTimelines({ orderedIds: newOrder as Id<"learnTimelines">[] })
    }

    if (timelines === undefined) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center p-8 min-h-[200px]">
                        <div className="flex flex-col items-center gap-2">
                            <ImSpinner8 className="animate-spin h-6 w-6 text-gray-400" />
                            <span className="text-gray-500 text-sm mt-1">Loading timelines...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const reorderableItems = timelines.map((timeline) => ({
        id: timeline._id,
        widget: (
            <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">
                            {timeline.title}
                        </span>
                        <div className="flex items-center gap-2">
                            {timeline.isPublic ? (
                                <Badge variant="default">Published</Badge>
                            ) : (
                                <Badge variant="secondary">Draft</Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={`/admin/learn-timelines/${timeline._id}`}>
                        <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <LearnTimelineDeleteDialog
                        timelineId={timeline._id}
                        timelineName={timeline.title}
                    >
                        <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </LearnTimelineDeleteDialog>
                </div>
            </div>
        ),
    }))

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                    <div className="text-sm text-gray-600">
                        Drag and drop to reorder. Changes are saved automatically.
                    </div>
                    <LearnTimelineCreateDialog />
                </div>

                {/* Timelines List */}
                {timelines.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No timelines yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Get started by creating your first learn timeline.
                        </p>
                        <LearnTimelineCreateDialog />
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <ReorderableList
                            items={reorderableItems}
                            onReorder={handleReorder}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminLearnTimelinesPage
