"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Edit, Loader2 } from "lucide-react"

type LearnTimelineEditDialogProps = {
    timeline: {
        _id: Id<"learnTimelines">
        title: string
        isPublic: boolean
    }
    children?: React.ReactNode
}

const LearnTimelineEditDialog = ({ timeline, children }: LearnTimelineEditDialogProps) => {
    const updateTimeline = useMutation(api.learnTimelines.updateTimeline)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [title, setTitle] = useState(timeline.title)
    const [isPublic, setIsPublic] = useState(timeline.isPublic)

    const saveDisabled = isLoading || !title.trim()

    const resetForm = () => {
        setTitle(timeline.title)
        setIsPublic(timeline.isPublic)
        setError(null)
    }

    const handleSave = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateTimeline({
                id: timeline._id,
                title: title.trim(),
                isPublic,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating timeline:", err)
            setError(`Failed to update timeline. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (open) resetForm() }}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Timeline</DialogTitle>
                    <DialogDescription>
                        Update this timeline's title and visibility.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-timeline-title">Title *</Label>
                        <Input
                            id="edit-timeline-title"
                            value={title}
                            disabled={isLoading}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Timeline title"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="edit-timeline-public">Published</Label>
                            <p className="text-sm text-gray-500">
                                When published, this timeline will appear on the Learn page.
                            </p>
                        </div>
                        <Switch
                            id="edit-timeline-public"
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="text-black text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LearnTimelineEditDialog
