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

type LocationDeleteDialogProps = {
    locationId: Id<"locations">
    locationName?: string
    children?: React.ReactNode
    onDeleted?: () => void
}

const LocationDeleteDialog = ({ locationId, locationName, children, onDeleted }: LocationDeleteDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deleteLocation = useMutation(api.locations.deleteLocation)

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            await deleteLocation({ id: locationId })
            setIsOpen(false)
            onDeleted?.()
        } catch (err) {
            console.error("Error deleting location:", err)
            setError("Failed to delete location")
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
                    <DialogTitle>Delete Location</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {locationName ? `"${locationName}"` : "this location"}? This action cannot be undone.
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
                            "Delete Location"
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

export default LocationDeleteDialog

