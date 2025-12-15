"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/images/ImagePicker"

type SponsorCreateDialogProps = {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const SponsorCreateDialog = ({ isOpen, onClose, onSuccess }: SponsorCreateDialogProps) => {
    const [name, setName] = useState("")
    const [imageId, setImageId] = useState<Id<"images"> | null>(null)
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const createSponsor = useMutation(api.sponsors.createSponsor)

    const resetForm = () => {
        setName("")
        setImageId(null)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const handleSubmit = async () => {
        if (!name.trim()) return

        setIsSubmitting(true)
        try {
            await createSponsor({
                name: name.trim(),
                imageId: imageId || undefined,
            })
            resetForm()
            onSuccess?.()
            onClose()
        } catch (error: any) {
            console.error("Error creating sponsor:", error)
            alert(`Failed to create sponsor: ${error?.message || "Unknown error"}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Sponsor</DialogTitle>
                        <DialogDescription>
                            Add a new sponsor to display on your site.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="sponsor-name">Name</Label>
                            <Input
                                id="sponsor-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Sponsor name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Logo Image (Optional)</Label>
                            <div className="space-y-2">
                                {imageId ? (
                                    <div className="text-sm text-gray-600">
                                        Image selected
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        No image selected
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsImagePickerOpen(true)}
                                        className="flex-1"
                                    >
                                        {imageId ? "Change" : "Select"} Image
                                    </Button>
                                    {imageId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setImageId(null)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!name.trim() || isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create Sponsor"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={(imageData) => setImageId(imageData.imageId)}
            />
        </>
    )
}

export default SponsorCreateDialog


