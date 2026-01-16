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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Edit, Loader2 } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

export type DonationForm = {
    _id: Id<"donationForms">
    _creationTime: number
    name: string
    notes?: string
    formId: string
    formTemplateId: string
    updatedAt: number
}

type DonationFormEditDialogProps = {
    donationForm: DonationForm
    children?: ReactNode
}

const DonationFormEditDialog = ({ donationForm, children }: DonationFormEditDialogProps) => {
    const updateDonationForm = useMutation(api.donationForms.updateDonationForm)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: donationForm.name,
        notes: donationForm.notes ?? "",
        formId: donationForm.formId,
        formTemplateId: donationForm.formTemplateId,
    })

    useEffect(() => {
        setFormData({
            name: donationForm.name,
            notes: donationForm.notes ?? "",
            formId: donationForm.formId,
            formTemplateId: donationForm.formTemplateId,
        })
    }, [donationForm])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name ||
        !formData.formId ||
        !formData.formTemplateId
    )

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: donationForm.name,
            notes: donationForm.notes ?? "",
            formId: donationForm.formId,
            formTemplateId: donationForm.formTemplateId,
        })
        setError(null)
    }

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateDonationForm({
                id: donationForm._id,
                name: formData.name,
                notes: formData.notes,
                formId: formData.formId,
                formTemplateId: formData.formTemplateId,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating donation form:", err)
            setError(`Failed to update donation form. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Donation Form</DialogTitle>
                    <DialogDescription>
                        Update this donation form configuration.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="donationFormName">Name</Label>
                        <Input
                            id="donationFormName"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => {
                                const { value } = e.target
                                setFormData({ ...formData, name: value })
                            }}
                        />
                    </div>

                    <div>
                        <Label htmlFor="donationFormNotes">Notes</Label>
                        <Textarea
                            id="donationFormNotes"
                            value={formData.notes}
                            disabled={editingDisabled}
                            onChange={(e) => {
                                const { value } = e.target
                                setFormData({ ...formData, notes: value })
                            }}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="donationFormFormId">Form ID</Label>
                            <Input
                                id="donationFormFormId"
                                value={formData.formId}
                                disabled={editingDisabled}
                                onChange={(e) => {
                                    const { value } = e.target
                                    setFormData({ ...formData, formId: value })
                                }}
                            />
                        </div>

                        <div>
                            <Label htmlFor="donationFormTemplateId">Form Template ID</Label>
                            <Input
                                id="donationFormTemplateId"
                                value={formData.formTemplateId}
                                disabled={editingDisabled}
                                onChange={(e) => {
                                    const { value } = e.target
                                    setFormData({ ...formData, formTemplateId: value })
                                }}
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
                                "Update Donation Form"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DonationFormEditDialog


