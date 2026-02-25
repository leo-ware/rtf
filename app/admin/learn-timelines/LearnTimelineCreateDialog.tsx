"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
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
import { Plus, Loader2 } from "lucide-react"

const LearnTimelineCreateDialog = () => {
    const createTimeline = useMutation(api.learnTimelines.createTimeline)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [title, setTitle] = useState("")

    const saveDisabled = isLoading || !title.trim()

    const resetForm = () => {
        setTitle("")
        setError(null)
    }

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await createTimeline({ title: title.trim() })
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error creating timeline:", err)
            setError(`Failed to create timeline. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (open) resetForm() }}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Timeline
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Timeline</DialogTitle>
                    <DialogDescription>
                        Add a new timeline to the Learn page. It will start as unpublished.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="timeline-title">Title *</Label>
                        <Input
                            id="timeline-title"
                            value={title}
                            disabled={isLoading}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., The Story of America's Wild Horses"
                        />
                    </div>

                    {error && (
                        <div className="text-black text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Timeline"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LearnTimelineCreateDialog
