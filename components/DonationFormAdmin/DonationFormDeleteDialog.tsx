"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Loader2, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"

type DonationFormDeleteDialogProps = {
    donationFormId: Id<"donationForms">
    children?: ReactNode
    onDeleted?: (donationFormId: Id<"donationForms">) => void
}

const DonationFormDeleteDialog = ({ donationFormId, children, onDeleted }: DonationFormDeleteDialogProps) => {
    const deleteDonationForm = useMutation(api.donationForms.deleteDonationForm)

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            await deleteDonationForm({ id: donationFormId })
            onDeleted?.(donationFormId)
        } catch (err) {
            console.error("Error deleting donation form:", err)
            setError("Failed to delete donation form")
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
                    <DialogTitle>Delete Donation Form</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this donation form? This action cannot be undone.
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
                            "Delete Donation Form"
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

export default DonationFormDeleteDialog


