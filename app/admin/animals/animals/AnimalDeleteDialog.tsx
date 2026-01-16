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
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { handleConvexError } from "@/lib/errorHandler"

type AnimalDeleteDialogProps = {
    animalId: Id<"animals">
    children?: React.ReactNode
}

const AnimalDeleteDialog = (props: AnimalDeleteDialogProps) => {
    const router = useRouter()
    const deleteAnimal = useMutation(api.animals.deleteAnimal)

    const [isOpen, setIsOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            await deleteAnimal({ id: props.animalId })
            setIsOpen(false)
        } catch (err: any) {
            console.error("Error deleting animal:", err)
            if (err?.message?.includes("permission") || err?.message?.includes("not authenticated")) {
                handleConvexError(err, "delete animal", router)
            } else {
                setError(err?.message || "Failed to delete animal")
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) setError(null)
        }}>
            <DialogTrigger asChild>
                {props.children ? props.children : (
                    <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Animal</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this animal? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={saving}>
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
                            "Delete Animal"
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

export default AnimalDeleteDialog


