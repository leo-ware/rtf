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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import { Plus, Loader2 } from "lucide-react"
import HerdCreateDialog from "../herds/HerdCreateDialog"
import DonationFormSection from "@/components/DonationFormAdmin/DonationFormSection"

type AnimalCreateDialogProps = {
    herds: Array<{ _id: Id<"herds">, name: string }>
    children?: React.ReactNode
}

const AnimalCreateDialog = (props: AnimalCreateDialogProps) => {
    const router = useRouter()

    const createAnimal = useMutation(api.animals.createAnimal)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [createdHerds, setCreatedHerds] = useState<Array<{ _id: Id<"herds">, name: string }>>([])
    const [donationFormId, setDonationFormId] = useState<Id<"donationForms"> | null | undefined>(undefined)

    const [formData, setFormData] = useState({
        name: "",
        type: "horse" as "horse" | "burro",
        herdId: "" as Id<"herds"> | "",
        description: "",
        imageId: null as Id<"images"> | null,
    })

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name ||
        !formData.description ||
        !formData.imageId ||
        !formData.herdId
    )

    const resetForm = () => {
        if (editingDisabled) return

        setFormData({
            name: "",
            type: "horse",
            herdId: "",
            description: "",
            imageId: null,
        })
        setCreatedHerds([])
        setDonationFormId(undefined)
        setError(null)
    }

    const handleCreateAnimal = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            const animalId = await createAnimal({
                name: formData.name,
                type: formData.type,
                description: formData.description,
                herdId: formData.herdId || undefined,
                imageId: formData.imageId!,
                donationFormId: donationFormId ?? undefined,
            })

            setIsOpen(false)
            resetForm()

            router.push(`/admin/animals/edit/${animalId}`)
        } catch (err: any) {
            console.error("Error creating animal:", err)
            if (err?.message?.includes("permission") || err?.message?.includes("not authenticated")) {
                handleConvexError(err, "create animal", router)
            } else {
                setError(err?.message || "Failed to create animal")
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
                        Add Animal
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Animal</DialogTitle>
                    <DialogDescription>
                        Add a new animal to your collection. You can edit more details after creation.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="animal-name">Name</Label>
                        <Input
                            id="animal-name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Animal name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="animal-type">Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value: "horse" | "burro") => setFormData((prev) => ({ ...prev, type: value }))}
                            disabled={editingDisabled}
                        >
                            <SelectTrigger id="animal-type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="horse">Horse</SelectItem>
                                <SelectItem value="burro">Burro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="animal-herd">Herd</Label>
                        <div className="space-y-2">
                            <Select
                                value={formData.herdId}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, herdId: value as Id<"herds"> }))}
                                disabled={editingDisabled}
                            >
                                <SelectTrigger id="animal-herd">
                                    <SelectValue placeholder="Select a herd" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...createdHerds, ...props.herds]
                                        .filter((herd, index, arr) => arr.findIndex((h) => h._id === herd._id) === index)
                                        .map((herd) => (
                                            <SelectItem key={herd._id} value={herd._id}>
                                                {herd.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <HerdCreateDialog
                                navigateToEdit={false}
                                onCreated={({ herdId, name }) => {
                                    setFormData((prev) => ({ ...prev, herdId }))
                                    setCreatedHerds((prev) => [{ _id: herdId, name }, ...prev])
                                }}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    disabled={editingDisabled}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Herd
                                </Button>
                            </HerdCreateDialog>
                        </div>
                    </div>

                    <DonationFormSection
                        donationFormId={donationFormId}
                        setDonationFormId={setDonationFormId}
                        disabled={editingDisabled}
                    />

                    <div>
                        <Label htmlFor="animal-description">Description</Label>
                        <Textarea
                            id="animal-description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the animal"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData((prev) => ({ ...prev, imageId }))}
                            disabled={editingDisabled}
                        />
                        {!formData.imageId && (
                            <div className="text-sm text-gray-500">
                                Please select an image to create the animal.
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
                        <Button onClick={handleCreateAnimal} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Animal"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AnimalCreateDialog


