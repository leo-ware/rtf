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
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import DonationFormSelector from "./DonationFormSelector"

type PathwayType = "link" | "donationForm"

export type DonatePathway = {
    _id: Id<"donatePathways">
    name: string
    imageId: Id<"images">
    order: number
    link?: string
    donationFormId?: Id<"donationForms">
    showInDialog?: boolean
}

type DonatePathwayEditDialogProps = {
    pathway: DonatePathway
    children?: React.ReactNode
    onUpdated?: () => void
}

const DonatePathwayEditDialog = ({ pathway, children, onUpdated }: DonatePathwayEditDialogProps) => {
    const updateDonatePathway = useMutation(api.donatePathways.updateDonatePathway)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getInitialPathwayType = (): PathwayType => {
        return pathway.donationFormId ? "donationForm" : "link"
    }

    const [formData, setFormData] = useState({
        name: pathway.name,
        imageId: pathway.imageId as Id<"images"> | null,
        pathwayType: getInitialPathwayType(),
        link: pathway.link || "",
        donationFormId: pathway.donationFormId || null as Id<"donationForms"> | null,
        showInDialog: pathway.showInDialog || false,
    })

    useEffect(() => {
        setFormData({
            name: pathway.name,
            imageId: pathway.imageId,
            pathwayType: getInitialPathwayType(),
            link: pathway.link || "",
            donationFormId: pathway.donationFormId || null,
            showInDialog: pathway.showInDialog || false,
        })
    }, [pathway])

    const editingDisabled = isLoading
    const hasValidPathway = formData.pathwayType === "link"
        ? formData.link.trim() !== ""
        : formData.donationFormId !== null
    const saveDisabled = isLoading || !formData.name || !formData.imageId || !hasValidPathway

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateDonatePathway({
                id: pathway._id,
                name: formData.name,
                imageId: formData.imageId!,
                link: formData.pathwayType === "link" ? formData.link : null,
                donationFormId: formData.pathwayType === "donationForm" ? formData.donationFormId! : null,
                showInDialog: formData.pathwayType === "donationForm" ? formData.showInDialog : null,
            })
            setIsOpen(false)
            onUpdated?.()
        } catch (err) {
            console.error("Error updating donate pathway:", err)
            setError(`Failed to update donate pathway. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: pathway.name,
            imageId: pathway.imageId,
            pathwayType: getInitialPathwayType(),
            link: pathway.link || "",
            donationFormId: pathway.donationFormId || null,
            showInDialog: pathway.showInDialog || false,
        })
        setError(null)
    }

    const handlePathwayTypeChange = (value: PathwayType) => {
        setFormData({
            ...formData,
            pathwayType: value,
            // Clear the other field when switching types
            link: value === "link" ? formData.link : "",
            donationFormId: value === "donationForm" ? formData.donationFormId : null,
            showInDialog: value === "donationForm" ? formData.showInDialog : false,
        })
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
                    <DialogTitle>Edit Donate Pathway</DialogTitle>
                    <DialogDescription>
                        Update the donation pathway card.
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
                            placeholder="Enter pathway name"
                        />
                    </div>

                    <div>
                        <Label>Image *</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData({ ...formData, imageId: imageId || null })}
                            disabled={editingDisabled}
                        />
                    </div>

                    <div>
                        <Label>Pathway Type *</Label>
                        <div className="flex gap-2 mt-2">
                            <Button
                                type="button"
                                variant={formData.pathwayType === "link" ? "default" : "outline"}
                                onClick={() => handlePathwayTypeChange("link")}
                                disabled={editingDisabled}
                            >
                                Link
                            </Button>
                            <Button
                                type="button"
                                variant={formData.pathwayType === "donationForm" ? "default" : "outline"}
                                onClick={() => handlePathwayTypeChange("donationForm")}
                                disabled={editingDisabled}
                            >
                                Donation Form
                            </Button>
                        </div>
                    </div>

                    {formData.pathwayType === "link" && (
                        <div>
                            <Label htmlFor="link">Link URL *</Label>
                            <Input
                                id="link"
                                value={formData.link}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="e.g., /donate/sponsor-a-horse or https://example.com"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Use relative paths (starting with /) for internal pages, or full URLs for external links.
                            </p>
                        </div>
                    )}

                    {formData.pathwayType === "donationForm" && (
                        <>
                            <div>
                                <Label>Donation Form *</Label>
                                <DonationFormSelector
                                    value={formData.donationFormId}
                                    onChange={(id) => setFormData({ ...formData, donationFormId: id })}
                                    disabled={editingDisabled}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="showInDialog"
                                    checked={formData.showInDialog}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, showInDialog: checked === true })
                                    }
                                    disabled={editingDisabled}
                                />
                                <Label htmlFor="showInDialog" className="text-sm font-normal cursor-pointer">
                                    Show in donation dialog fund selector
                                </Label>
                            </div>
                        </>
                    )}

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
                                "Update Pathway"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DonatePathwayEditDialog
