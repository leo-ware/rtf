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
import { Plus, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import DonationFormSelector from "./DonationFormSelector"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DONATE_LINK_PRESETS } from "./donateLinkPresets"

type PathwayType = "link" | "donationForm"

type DonatePathwayCreateDialogProps = {
    children?: React.ReactNode
    onCreated?: (id: Id<"donatePathways">) => void
}

const DonatePathwayCreateDialog = ({ children, onCreated }: DonatePathwayCreateDialogProps) => {
    const createDonatePathway = useMutation(api.donatePathways.createDonatePathway)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        imageId: null as Id<"images"> | null,
        pathwayType: "link" as PathwayType,
        link: "",
        donationFormId: null as Id<"donationForms"> | null,
        showInDialog: false,
    })

    const editingDisabled = isLoading
    const hasValidPathway = formData.pathwayType === "link"
        ? formData.link.trim() !== ""
        : formData.donationFormId !== null
    const saveDisabled = isLoading || !formData.name || !formData.imageId || !hasValidPathway

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            const id = await createDonatePathway({
                name: formData.name,
                imageId: formData.imageId!,
                link: formData.pathwayType === "link" ? formData.link : undefined,
                donationFormId: formData.pathwayType === "donationForm" ? formData.donationFormId! : undefined,
                showInDialog: formData.pathwayType === "donationForm" ? formData.showInDialog : undefined,
            })
            setIsOpen(false)
            resetForm()
            onCreated?.(id)
        } catch (err) {
            console.error("Error creating donate pathway:", err)
            setError(`Failed to create donate pathway. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: "",
            imageId: null,
            pathwayType: "link",
            link: "",
            donationFormId: null,
            showInDialog: false,
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
                    <Button onClick={resetForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Pathway
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Donate Pathway</DialogTitle>
                    <DialogDescription>
                        Add a new donation pathway card to the donate page.
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
                        <div className="space-y-3">
                            <div>
                                <Label>Quick select (optional)</Label>
                                <Select
                                    value=""
                                    onValueChange={(path) => setFormData({ ...formData, link: path })}
                                    disabled={editingDisabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a donate page…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DONATE_LINK_PRESETS.map((preset) => (
                                            <SelectItem key={preset.path} value={preset.path}>
                                                {preset.label} ({preset.path})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Pathway"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DonatePathwayCreateDialog
