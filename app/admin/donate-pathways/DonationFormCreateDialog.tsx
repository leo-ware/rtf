"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

type DonationFormCreateDialogProps = {
    isOpen: boolean
    onClose: () => void
    onCreated?: (id: Id<"donationForms">) => void
}

const DonationFormCreateDialog = ({ isOpen, onClose, onCreated }: DonationFormCreateDialogProps) => {
    const createDonationForm = useMutation(api.donationForms.createDonationForm)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        notes: "",
        formId: "",
        formTemplateId: "",
    })

    const editingDisabled = isLoading
    const saveDisabled = isLoading || !formData.name || !formData.formId || !formData.formTemplateId

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            const id = await createDonationForm({
                name: formData.name,
                notes: formData.notes || undefined,
                formId: formData.formId,
                formTemplateId: formData.formTemplateId,
            })
            resetForm()
            onCreated?.(id)
            onClose()
        } catch (err) {
            console.error("Error creating donation form:", err)
            setError(`Failed to create donation form. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: "",
            notes: "",
            formId: "",
            formTemplateId: "",
        })
        setError(null)
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm()
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Donation Form</DialogTitle>
                    <DialogDescription>
                        Add a new Salsa Labs donation form configuration.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter form name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="formId">Form ID *</Label>
                        <Input
                            id="formId"
                            value={formData.formId}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, formId: e.target.value })}
                            placeholder="e.g., dLBXlrVwbC"
                        />
                    </div>

                    <div>
                        <Label htmlFor="formTemplateId">Form Template ID *</Label>
                        <Input
                            id="formTemplateId"
                            value={formData.formTemplateId}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, formTemplateId: e.target.value })}
                            placeholder="e.g., 5f528287-b12c-42a8-b6e5-fc5ee5fafa24"
                        />
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes about this form"
                            rows={3}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={editingDisabled}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Form"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DonationFormCreateDialog
