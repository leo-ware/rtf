"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
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
import ConvexImage from "@/components/images/ConvexImage"
import { Image as ImageIcon } from "lucide-react"

type SponsorEditDialogProps = {
    sponsorId: Id<"sponsors"> | null
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const SponsorEditDialog = ({ sponsorId, isOpen, onClose, onSuccess }: SponsorEditDialogProps) => {
    const [name, setName] = useState("")
    const [imageId, setImageId] = useState<Id<"images"> | null>(null)
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const sponsors = useQuery(api.sponsors.getSponsors)
    const sponsor = sponsors?.find((s) => s._id === sponsorId) ?? null
    const updateSponsor = useMutation(api.sponsors.updateSponsor)

    useEffect(() => {
        if (sponsor) {
            setName(sponsor.name)
            setImageId(sponsor.imageId || null)
        }
    }, [sponsor])

    const handleClose = () => {
        onClose()
    }

    const handleSubmit = async () => {
        if (!sponsorId || !name.trim()) return

        setIsSubmitting(true)
        try {
            await updateSponsor({
                id: sponsorId,
                name: name.trim(),
                imageId: imageId || undefined,
            })
            onSuccess?.()
            onClose()
        } catch (error: any) {
            console.error("Error updating sponsor:", error)
            alert(`Failed to update sponsor: ${error?.message || "Unknown error"}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Sponsor</DialogTitle>
                        <DialogDescription>
                            Update sponsor information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-sponsor-name">Name</Label>
                            <Input
                                id="edit-sponsor-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Sponsor name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Logo Image</Label>
                            <div className="space-y-3">
                                {sponsor?.image?.url ? (
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                        <ConvexImage
                                            src={sponsor.image.url}
                                            alt={sponsor.name}
                                            width={sponsor.image.width || 128}
                                            height={sponsor.image.height || 128}
                                            className="object-contain w-full h-full"
                                            objectFit="contain"
                                        />
                                    </div>
                                ) : imageId ? (
                                    <div className="text-sm text-gray-600">
                                        New image selected
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsImagePickerOpen(true)}
                                        className="flex-1"
                                    >
                                        {imageId || sponsor?.imageId ? "Change" : "Select"} Image
                                    </Button>
                                    {(imageId || sponsor?.imageId) && (
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
                                {isSubmitting ? "Saving..." : "Save Changes"}
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

export default SponsorEditDialog


