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

type AdvisoryBoardDeleteDialogProps = {
    advisoryBoardId: Id<"advisoryBoards">
    children?: React.ReactNode
    beforeDelete?: () => void
    afterDelete?: () => void
}

const AdvisoryBoardDeleteDialog = ({ advisoryBoardId, children, beforeDelete, afterDelete }: AdvisoryBoardDeleteDialogProps) => {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deleteAdvisoryBoard = useMutation(api.advisoryBoards.deleteAdvisoryBoard)

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            beforeDelete?.()
            await deleteAdvisoryBoard({ id: advisoryBoardId })
            afterDelete?.()
        } catch (err) {
            console.error("Error deleting advisory board:", err)
            setError("Failed to delete advisory board")
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
                    <DialogTitle>Delete Advisory Board</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this advisory board? This action cannot be undone and will remove all associations with people.
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
                            "Delete Advisory Board"
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

export default AdvisoryBoardDeleteDialog
