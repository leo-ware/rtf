"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const parseDatetimeLocalToMs = (value: string) => {
    const [datePart, timePart] = value.split("T")
    const [year, month, day] = datePart.split("-").map((x) => parseInt(x, 10))
    const [hour, minute] = timePart.split(":").map((x) => parseInt(x, 10))
    return new Date(year, month - 1, day, hour, minute).getTime()
}

const JobListingCreateDialog = () => {
    const createJobListing = useMutation(api.jobListing.createJobListing)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        applicationDeadline: "",
        applicationFormLink: "",
    })

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name.trim() ||
        !formData.description.trim() ||
        !formData.applicationDeadline.trim() ||
        !formData.applicationFormLink.trim()
    )

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: "",
            description: "",
            applicationDeadline: "",
            applicationFormLink: "",
        })
        setError(null)
    }

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await createJobListing({
                name: formData.name.trim(),
                description: formData.description.trim(),
                applicationDeadline: parseDatetimeLocalToMs(formData.applicationDeadline),
                applicationFormLink: formData.applicationFormLink.trim(),
            })
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error creating job listing:", err)
            setError(`Failed to create job listing. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job Listing
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Job Listing</DialogTitle>
                    <DialogDescription>
                        Add a new paid opportunity to the public Opportunities page.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="job-name">Name</Label>
                        <Input
                            id="job-name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter job listing title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="job-description">Description</Label>
                        <Textarea
                            id="job-description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter job description"
                            rows={6}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="job-deadline">Application deadline</Label>
                            <Input
                                id="job-deadline"
                                type="datetime-local"
                                value={formData.applicationDeadline}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="job-link">Application form link</Label>
                            <Input
                                id="job-link"
                                type="url"
                                value={formData.applicationFormLink}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, applicationFormLink: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={resetForm} disabled={editingDisabled}>
                            Reset
                        </Button>
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Job Listing"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default JobListingCreateDialog


