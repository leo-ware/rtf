"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { handleConvexError } from "@/lib/errorHandler"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import { Loader2, Plus } from "lucide-react"
import DonationFormConfigurationDialog from "@/components/DonationFormAdmin/DonationFormConfigurationDialog"

type HerdCreateDialogProps = {
    children?: React.ReactNode
    navigateToEdit?: boolean
    onCreated?: (args: { herdId: Id<"herds">, name: string }) => void
}

const HerdCreateDialog = (props: HerdCreateDialogProps) => {
    const router = useRouter()

    const createHerd = useMutation(api.herds.createHerd)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageId: null as Id<"images"> | null,
    })
    const [donationFormId, setDonationFormId] = useState<Id<"donationForms"> | null | undefined>(undefined)

    const editingDisabled = isLoading
    const saveDisabled = isLoading || !formData.name

    const resetForm = () => {
        if (editingDisabled) return

        setFormData({
            name: "",
            description: "",
            imageId: null,
        })
        setDonationFormId(undefined)
        setError(null)
    }

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            const navigateToEdit = props.navigateToEdit !== false
            const herdId = await createHerd({
                name: formData.name,
                description: formData.description || undefined,
                imageId: formData.imageId ?? undefined,
                donationFormId: donationFormId ?? undefined,
            })

            setIsOpen(false)
            resetForm()
            props.onCreated?.({ herdId, name: formData.name })
            if (navigateToEdit) {
                router.push(`/admin/animals/edit-herd/${herdId}`)
            }
        } catch (err: any) {
            console.error("Error creating herd:", err)
            if (err?.message?.includes("permission") || err?.message?.includes("not authenticated")) {
                handleConvexError(err, "create herd", router)
            } else {
                setError(err?.message || "Failed to create herd")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
                if (open) resetForm()
            }}
        >
            <DialogTrigger asChild>
                {props.children ? props.children : (
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Herd
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Herd</DialogTitle>
                    <DialogDescription>
                        Add a new herd to your collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="herd-name">Name</Label>
                        <Input
                            id="herd-name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Herd name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="herd-description">Description</Label>
                        <Textarea
                            id="herd-description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the herd"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Image (Optional)</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData((prev) => ({ ...prev, imageId }))}
                            disabled={editingDisabled}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Donation Form (Optional)</Label>
                        {donationFormId === undefined ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDonationFormId(null)}
                                    disabled={editingDisabled}
                                >
                                    Add Donation Form
                                </Button>
                                <div className="text-sm text-gray-500">
                                    No donation form configured
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-4">
                                <DonationFormConfigurationDialog
                                    donationFormId={donationFormId}
                                    setDonationFormId={setDonationFormId}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDonationFormId(undefined)}
                                    disabled={editingDisabled}
                                >
                                    Clear
                                </Button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={editingDisabled}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Herd"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default HerdCreateDialog


