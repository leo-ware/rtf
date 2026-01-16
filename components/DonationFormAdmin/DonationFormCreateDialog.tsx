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
import { Loader2, Plus } from "lucide-react"
import { useState, type ReactNode } from "react"

type DonationFormCreateDialogProps = {
    children?: ReactNode
    onCreated?: (donationFormId: Id<"donationForms">) => void
}

const DonationFormCreateDialog = ({ children, onCreated }: DonationFormCreateDialogProps) => {
    const createDonationForm = useMutation(api.donationForms.createDonationForm)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        notes: "",
        formId: "",
        formTemplateId: "",
    })

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
            name: "",
            notes: "",
            formId: "",
            formTemplateId: "",
        })
        setError(null)
    }

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            const donationFormId = await createDonationForm({
                name: formData.name,
                notes: formData.notes ? formData.notes : undefined,
                formId: formData.formId,
                formTemplateId: formData.formTemplateId,
            })
            onCreated?.(donationFormId)
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error creating donation form:", err)
            setError(`Failed to create donation form. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button onClick={resetForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Donation Form
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Donation Form</DialogTitle>
                    <DialogDescription>
                        Create a new donation form configuration.
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
                            placeholder="e.g. General Donation"
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
                            placeholder="Optional internal notes"
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
                                placeholder="Salsa form id"
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
                                placeholder="Salsa form template id"
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
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Donation Form"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DonationFormCreateDialog


