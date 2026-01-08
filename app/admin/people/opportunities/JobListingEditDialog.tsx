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
import { Edit, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export type JobListing = {
    _id: Id<"jobListings">
    _creationTime: number
    name: string
    description: string
    applicationDeadline: number
    applicationFormLink: string
}

type JobListingEditDialogProps = {
    jobListing: JobListing
    children?: React.ReactNode
}

const toDatetimeLocalValue = (ms: number) => {
    const d = new Date(ms)
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const parseDatetimeLocalToMs = (value: string) => {
    const [datePart, timePart] = value.split("T")
    const [year, month, day] = datePart.split("-").map((x) => parseInt(x, 10))
    const [hour, minute] = timePart.split(":").map((x) => parseInt(x, 10))
    return new Date(year, month - 1, day, hour, minute).getTime()
}

const JobListingEditDialog = ({ jobListing, children }: JobListingEditDialogProps) => {
    const updateJobListing = useMutation(api.jobListing.updateJobListing)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: jobListing.name,
        description: jobListing.description,
        applicationDeadline: toDatetimeLocalValue(jobListing.applicationDeadline),
        applicationFormLink: jobListing.applicationFormLink,
    })

    useEffect(() => {
        setFormData({
            name: jobListing.name,
            description: jobListing.description,
            applicationDeadline: toDatetimeLocalValue(jobListing.applicationDeadline),
            applicationFormLink: jobListing.applicationFormLink,
        })
        setError(null)
    }, [jobListing])

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
            name: jobListing.name,
            description: jobListing.description,
            applicationDeadline: toDatetimeLocalValue(jobListing.applicationDeadline),
            applicationFormLink: jobListing.applicationFormLink,
        })
        setError(null)
    }

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateJobListing({
                id: jobListing._id,
                name: formData.name.trim(),
                description: formData.description.trim(),
                applicationDeadline: parseDatetimeLocalToMs(formData.applicationDeadline),
                applicationFormLink: formData.applicationFormLink.trim(),
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating job listing:", err)
            setError(`Failed to update job listing. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm" onClick={resetForm}>
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Job Listing</DialogTitle>
                    <DialogDescription>
                        Update the job listing details.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-job-name">Name</Label>
                        <Input
                            id="edit-job-name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter job listing title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-job-description">Description</Label>
                        <Textarea
                            id="edit-job-description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter job description"
                            rows={6}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-job-deadline">Application deadline</Label>
                            <Input
                                id="edit-job-deadline"
                                type="datetime-local"
                                value={formData.applicationDeadline}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-job-link">Application form link</Label>
                            <Input
                                id="edit-job-link"
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
                        <Button onClick={handleUpdate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Job Listing"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default JobListingEditDialog


