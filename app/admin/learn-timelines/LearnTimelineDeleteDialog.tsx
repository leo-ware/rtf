"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"

type LearnTimelineDeleteDialogProps = {
    timelineId: Id<"learnTimelines">
    timelineName?: string
    children?: React.ReactNode
}

const LearnTimelineDeleteDialog = ({ timelineId, timelineName, children }: LearnTimelineDeleteDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deleteTimeline = useMutation(api.learnTimelines.deleteTimeline)

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            await deleteTimeline({ id: timelineId })
            setIsOpen(false)
        } catch (err) {
            console.error("Error deleting timeline:", err)
            setError("Failed to delete timeline")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Timeline</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {timelineName ? `"${timelineName}"` : "this timeline"}?
                        This will also delete all items within this timeline. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleDelete}
                        disabled={saving}
                        variant="outline"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Timeline"
                        )}
                    </Button>
                </DialogFooter>
                {error && (
                    <div className="text-black text-sm mt-2">{error}</div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default LearnTimelineDeleteDialog
