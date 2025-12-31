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
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Loader2, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type ProgramDeleteDialogProps = {
    programId: Id<"programs">
    children?: React.ReactNode
}

const ProgramDeleteDialog = ({ programId, children }: ProgramDeleteDialogProps) => {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [confirmed, setConfirmed] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const deleteProgram = useMutation(api.programs.deleteProgram)
    const associatedEvents = useQuery(
        api.programs.getEventsByProgram,
        isOpen ? { programId } : "skip"
    )

    const eventCount = associatedEvents?.length ?? 0

    const handleDelete = async () => {
        if (saving || !confirmed) return

        setSaving(true)
        setError(null)
        try {
            await deleteProgram({ id: programId })
            setIsOpen(false)
        } catch (err) {
            console.error("Error deleting program:", err)
            setError("Failed to delete program")
        } finally {
            setSaving(false)
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setConfirmed(false)
            setError(null)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Program - Destructive Action
                    </DialogTitle>
                    <DialogDescription className="space-y-4 pt-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                            <p className="font-semibold mb-2">
                                ⚠️ WARNING: This action is IRREVERSIBLE
                            </p>
                            <p>
                                Deleting this program will <strong>permanently destroy</strong> all associated data, including:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>The program configuration and settings</li>
                                <li>
                                    <strong className="text-red-900">
                                        {eventCount} scheduled event{eventCount !== 1 ? "s" : ""}
                                    </strong>
                                    {eventCount > 0 && " and all their registrations/RSVPs"}
                                </li>
                            </ul>
                        </div>

                        {eventCount > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                                <p className="font-semibold">
                                    🗓️ {eventCount} event{eventCount !== 1 ? "s" : ""} will be deleted:
                                </p>
                                <p className="text-sm mt-1">
                                    All past and future events associated with this program will be permanently removed. 
                                    Any attendee registrations and RSVPs will also be lost.
                                </p>
                            </div>
                        )}

                        <div className="flex items-start space-x-3 pt-2">
                            <Checkbox
                                id="confirm-delete"
                                checked={confirmed}
                                onCheckedChange={(checked) => setConfirmed(checked === true)}
                            />
                            <Label
                                htmlFor="confirm-delete"
                                className="text-sm font-medium leading-tight cursor-pointer"
                            >
                                I understand that this action is permanent and will delete the program
                                {eventCount > 0 && ` along with ${eventCount} associated event${eventCount !== 1 ? "s" : ""}`}.
                            </Label>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleDelete}
                        disabled={saving || !confirmed}
                        variant="destructive"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Program{eventCount > 0 && ` & ${eventCount} Event${eventCount !== 1 ? "s" : ""}`}
                            </>
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

export default ProgramDeleteDialog
