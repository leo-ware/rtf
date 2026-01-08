"use client"

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
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type JobListingDeleteDialogProps = {
    jobListingId: Id<"jobListings">
    children?: React.ReactNode
}

const JobListingDeleteDialog = ({ jobListingId, children }: JobListingDeleteDialogProps) => {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deleteJobListing = useMutation(api.jobListing.deleteJobListing)

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            await deleteJobListing({ id: jobListingId })
        } catch (err) {
            console.error("Error deleting job listing:", err)
            setError("Failed to delete job listing")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Job Listing</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this job listing? This action cannot be undone.
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
                        variant="destructive"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Job Listing"
                        )}
                    </Button>
                </DialogFooter>
                {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default JobListingDeleteDialog


