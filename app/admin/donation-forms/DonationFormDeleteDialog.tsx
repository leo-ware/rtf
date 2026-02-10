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
import { Loader2, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type UsageInfo = {
    pathways: { _id: Id<"donatePathways">; name: string }[]
    animals: { _id: Id<"animals">; name: string }[]
    herds: { _id: Id<"herds">; name: string }[]
}

type DonationFormDeleteDialogProps = {
    formId: Id<"donationForms">
    formName?: string
    usage?: UsageInfo
    children?: React.ReactNode
    onDeleted?: () => void
}

const DonationFormDeleteDialog = ({ formId, formName, usage, children, onDeleted }: DonationFormDeleteDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deleteDonationForm = useMutation(api.donationForms.deleteDonationForm)

    const hasUsage = usage && (usage.pathways.length > 0 || usage.animals.length > 0 || usage.herds.length > 0)
    const totalUsageCount = usage
        ? usage.pathways.length + usage.animals.length + usage.herds.length
        : 0

    const handleDelete = async () => {
        if (saving) return

        setSaving(true)
        setError(null)
        try {
            await deleteDonationForm({ id: formId })
            setIsOpen(false)
            onDeleted?.()
        } catch (err) {
            console.error("Error deleting donation form:", err)
            setError("Failed to delete donation form")
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
                    <DialogTitle>Delete Donation Form</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {formName ? `"${formName}"` : "this donation form"}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {hasUsage && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-medium">This form is currently in use</p>
                                <p className="mt-1">
                                    Deleting it will affect {totalUsageCount} item{totalUsageCount !== 1 ? "s" : ""}:
                                </p>
                            </div>
                        </div>

                        <div className="pl-7 space-y-2">
                            {usage.pathways.length > 0 && (
                                <div>
                                    <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                                        Pathways ({usage.pathways.length})
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {usage.pathways.map(p => (
                                            <Badge key={p._id} variant="secondary" className="text-xs">
                                                {p.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {usage.animals.length > 0 && (
                                <div>
                                    <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                                        Animals ({usage.animals.length})
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {usage.animals.map(a => (
                                            <Badge key={a._id} variant="secondary" className="text-xs">
                                                {a.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {usage.herds.length > 0 && (
                                <div>
                                    <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                                        Herds ({usage.herds.length})
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {usage.herds.map(h => (
                                            <Badge key={h._id} variant="secondary" className="text-xs">
                                                {h.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
                            "Delete Form"
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
