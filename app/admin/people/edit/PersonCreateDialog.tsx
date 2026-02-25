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
import { Plus, Loader2, Image as ImageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ImagePicker } from "@/components/images/ImagePicker"

const PersonCreateDialog = () => {
    const createPerson = useMutation(api.people.createPerson)
    const advisoryBoards = useQuery(api.advisoryBoards.listAdvisoryBoards, { limit: 100 })

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
        imageId: null as Id<"images"> | null,
        imageUrl: "",
        isDirector: false,
        isStaff: false,
        isEquine: false,
        isStoryTeller: false,
        isAmbassador: false,
        inMemoriam: false,
        advisoryBoardIds: [] as Id<"advisoryBoards">[],
    })

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name
    )

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await createPerson({
                name: formData.name,
                title: formData.title || undefined,
                bio: formData.bio || undefined,
                imageId: formData.imageId || undefined,
                isDirector: formData.isDirector || undefined,
                isStaff: formData.isStaff || undefined,
                isEquine: formData.isEquine || undefined,
                isStoryTeller: formData.isStoryTeller || undefined,
                isAmbassador: formData.isAmbassador || undefined,
                inMemoriam: formData.inMemoriam || undefined,
                advisoryBoardIds: formData.advisoryBoardIds.length > 0 ? formData.advisoryBoardIds : undefined,
            })
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error creating person:", err)
            setError(`Failed to create person. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: "",
            title: "",
            bio: "",
            imageId: null,
            imageUrl: "",
            isDirector: false,
            isStaff: false,
            isEquine: false,
            isStoryTeller: false,
            isAmbassador: false,
            inMemoriam: false,
            advisoryBoardIds: [],
        })
        setError(null)
    }

    const handleImageSelect = (imageData: { imageId: Id<"images">; url: string }) => {
        setFormData(prev => ({
            ...prev,
            imageId: imageData.imageId,
            imageUrl: imageData.url,
        }))
        setIsImagePickerOpen(false)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Person
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Person</DialogTitle>
                        <DialogDescription>
                            Add a new person to your organization directory.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter person's name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter person's title"
                            />
                        </div>

                        <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Enter person's biography"
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label>Profile Image</Label>
                            <div className="flex items-center gap-4">
                                {formData.imageUrl ? (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Selected"
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={editingDisabled}
                                    onClick={() => setIsImagePickerOpen(true)}
                                >
                                    {formData.imageUrl ? "Change Image" : "Select Image"}
                                </Button>
                                {formData.imageUrl && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={editingDisabled}
                                        onClick={() => setFormData({ ...formData, imageId: null, imageUrl: "" })}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Advisory Boards</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                                {advisoryBoards?.map((board) => (
                                    <div key={board._id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`board-${board._id}`}
                                            disabled={editingDisabled}
                                            checked={formData.advisoryBoardIds.includes(board._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setFormData({
                                                        ...formData,
                                                        advisoryBoardIds: [...formData.advisoryBoardIds, board._id]
                                                    })
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        advisoryBoardIds: formData.advisoryBoardIds.filter(id => id !== board._id)
                                                    })
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`board-${board._id}`}>{board.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Roles</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-director"
                                        disabled={editingDisabled}
                                        checked={formData.isDirector}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isDirector: !!checked })}
                                    />
                                    <Label htmlFor="is-director">Board Director</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-staff"
                                        disabled={editingDisabled}
                                        checked={formData.isStaff}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isStaff: !!checked })}
                                    />
                                    <Label htmlFor="is-staff">Staff</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-equine"
                                        disabled={editingDisabled}
                                        checked={formData.isEquine}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isEquine: !!checked })}
                                    />
                                    <Label htmlFor="is-equine">Equine</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-storyteller"
                                        disabled={editingDisabled}
                                        checked={formData.isStoryTeller}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isStoryTeller: !!checked })}
                                    />
                                    <Label htmlFor="is-storyteller">Storyteller</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-ambassador"
                                        disabled={editingDisabled}
                                        checked={formData.isAmbassador}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isAmbassador: !!checked })}
                                    />
                                    <Label htmlFor="is-ambassador">Ambassador</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="in-memoriam"
                                        disabled={editingDisabled}
                                        checked={formData.inMemoriam}
                                        onCheckedChange={(checked) => setFormData({ ...formData, inMemoriam: !!checked })}
                                    />
                                    <Label htmlFor="in-memoriam">In Memoriam</Label>
                                </div>
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
                                    "Add Person"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={handleImageSelect}
            />
        </>
    )
}

export default PersonCreateDialog
