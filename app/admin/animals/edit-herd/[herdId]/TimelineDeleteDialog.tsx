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
import { Trash2 } from "lucide-react"
import { handleConvexError } from "@/lib/errorHandler"

type TimelineDeleteDialogProps = {
    herdId: Id<"herds">
    timelineItemId: Id<"timelineItem">
}

const TimelineDeleteDialog = ({
    herdId,
    timelineItemId,
}: TimelineDeleteDialogProps) => {
    const router = useRouter()

    const removeTimelineItem = useMutation(api.herds.removeTimelineItem)
    const deleteTimelineItem = useMutation(api.timelineItems.deleteTimelineItem)

    const [isOpen, setIsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await removeTimelineItem({ herdId, timelineItemId })
            await deleteTimelineItem({ id: timelineItemId })
            setIsOpen(false)
        } catch (error: any) {
            console.error("Error deleting timeline item:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "delete timeline item", router)
            } else {
                alert("Failed to delete timeline item: " + (error?.message || "Unknown error"))
            }
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the timeline item.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TimelineDeleteDialog
