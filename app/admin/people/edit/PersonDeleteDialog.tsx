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

type PersonDeleteDialogProps = {
    personId: Id<"people">
    children?: React.ReactNode
}

const PersonDeleteDialog = ({ personId, children }: PersonDeleteDialogProps) => {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deletePerson = useMutation(api.people.deletePerson)

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            await deletePerson({ id: personId })
        } catch (err) {
            console.error("Error deleting person:", err)
            setError("Failed to delete person")
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
                    <DialogTitle>Delete Person</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this person? This action cannot be undone and will permanently remove the person from your organization directory and all advisory board associations.
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
                            "Delete Person"
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

export default PersonDeleteDialog
