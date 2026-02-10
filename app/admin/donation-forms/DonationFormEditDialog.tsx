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
import { Edit, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

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
    form: DonationForm
    children?: React.ReactNode
    onUpdated?: () => void
}

const parseSalsaLabsUrl = (url: string): { formId: string; formTemplateId: string } | null => {
    try {
        const urlObj = new URL(url)
        // Extract templateId from path: /api/widget/template/{templateId}/
        const pathMatch = urlObj.pathname.match(/\/api\/widget\/template\/([^/]+)/)
        const templateId = pathMatch?.[1]
        // Extract formId from tId query param
        const formId = urlObj.searchParams.get("tId")

        if (templateId && formId) {
            return { formId, formTemplateId: templateId }
        }
        return null
    } catch {
        return null
    }
}

const DonationFormEditDialog = ({ form, children, onUpdated }: DonationFormEditDialogProps) => {
    const updateDonationForm = useMutation(api.donationForms.updateDonationForm)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: form.name,
        notes: form.notes || "",
        sourceUrl: "",
        formId: form.formId,
        formTemplateId: form.formTemplateId,
    })

    useEffect(() => {
        setFormData({
            name: form.name,
            notes: form.notes || "",
            sourceUrl: "",
            formId: form.formId,
            formTemplateId: form.formTemplateId,
        })
    }, [form])

    const editingDisabled = isLoading
    const saveDisabled = isLoading || !formData.name || !formData.formId || !formData.formTemplateId

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateDonationForm({
                id: form._id,
                name: formData.name,
                notes: formData.notes || undefined,
                formId: formData.formId,
                formTemplateId: formData.formTemplateId,
            })
            setIsOpen(false)
            onUpdated?.()
        } catch (err) {
            console.error("Error updating donation form:", err)
            setError(`Failed to update donation form. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: form.name,
            notes: form.notes || "",
            sourceUrl: "",
            formId: form.formId,
            formTemplateId: form.formTemplateId,
        })
        setError(null)
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
                        Update the Salsa Labs donation form configuration.
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
                        <Label htmlFor="sourceUrl">Source URL (optional)</Label>
                        <Input
                            id="sourceUrl"
                            value={formData.sourceUrl}
                            disabled={editingDisabled}
                            onChange={(e) => {
                                const url = e.target.value
                                const parsed = parseSalsaLabsUrl(url)
                                if (parsed) {
                                    setFormData(prev => ({
                                        ...prev,
                                        sourceUrl: url,
                                        formId: parsed.formId,
                                        formTemplateId: parsed.formTemplateId,
                                    }))
                                } else {
                                    setFormData(prev => ({ ...prev, sourceUrl: url }))
                                }
                            }}
                            placeholder="Paste Salsa Labs widget URL to auto-fill IDs"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            e.g., https://default.salsalabs.org/api/widget/template/xxx/?tId=yyy
                        </p>
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
                                "Update Form"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DonationFormEditDialog
