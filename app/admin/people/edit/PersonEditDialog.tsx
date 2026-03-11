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
import { Edit, Loader2, Image as ImageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ImagePicker } from "@/components/images/ImagePicker"

type PersonEditDialogProps = {
    personId: Id<"people">
    children?: React.ReactNode
}

const PersonEditDialog = ({ personId, children }: PersonEditDialogProps) => {
    const updatePerson = useMutation(api.people.updatePerson)
    const person = useQuery(api.people.getPersonWithAdvisoryBoards, { id: personId })
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
        isPhotographer: false,
        inMemoriam: false,
        link: "",
        advisoryBoardIds: [] as Id<"advisoryBoards">[],
    })

    useEffect(() => {
        if (person && isOpen) {
            setFormData({
                name: person.name,
                title: person.title ?? "",
                bio: person.bio ?? "",
                imageId: person.imageId || null,
                imageUrl: person.image?.url || "",
                isDirector: person.isDirector ?? false,
                isStaff: person.isStaff ?? false,
                isEquine: person.isEquine ?? false,
                isStoryTeller: person.isStoryTeller ?? false,
                isAmbassador: person.isAmbassador ?? false,
                isPhotographer: person.isPhotographer ?? false,
                inMemoriam: person.inMemoriam ?? false,
                link: person.link ?? "",
                advisoryBoardIds: (person.advisoryBoards || [])
                    .map(ab => ab?.advisoryBoardId)
                    .filter(id => id !== undefined),
            })
        }
    }, [person, isOpen])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name
    )

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updatePerson({
                id: personId,
                name: formData.name,
                title: formData.title,
                bio: formData.bio,
                imageId: formData.imageId || undefined,
                isDirector: formData.isDirector,
                isStaff: formData.isStaff,
                isEquine: formData.isEquine,
                isStoryTeller: formData.isStoryTeller,
                isAmbassador: formData.isAmbassador,
                isPhotographer: formData.isPhotographer,
                inMemoriam: formData.inMemoriam,
                link: formData.link || undefined,
                advisoryBoardIds: formData.advisoryBoardIds.length > 0 ? formData.advisoryBoardIds : undefined,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating person:", err)
            setError(`Failed to update person. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageSelect = (imageData: { imageId: Id<"images">; url: string }) => {
        setFormData(prev => ({
            ...prev,
            imageId: imageData.imageId,
            imageUrl: imageData.url,
        }))
        setIsImagePickerOpen(false)
    }

    if (!person) return null

    return (
        <>
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
                        <DialogTitle>Edit Person</DialogTitle>
                        <DialogDescription>
                            Update the person's information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter person's name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter person's title"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-bio">Bio</Label>
                            <Textarea
                                id="edit-bio"
                                value={formData.bio}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Enter person's biography"
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-link">Link</Label>
                            <Input
                                id="edit-link"
                                value={formData.link}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="External URL (e.g. website or portfolio)"
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
                                            id={`edit-board-${board._id}`}
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
                                        <Label htmlFor={`edit-board-${board._id}`}>{board.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Roles</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-is-director"
                                        disabled={editingDisabled}
                                        checked={formData.isDirector}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isDirector: !!checked })}
                                    />
                                    <Label htmlFor="edit-is-director">Board Director</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-is-staff"
                                        disabled={editingDisabled}
                                        checked={formData.isStaff}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isStaff: !!checked })}
                                    />
                                    <Label htmlFor="edit-is-staff">Staff</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-is-equine"
                                        disabled={editingDisabled}
                                        checked={formData.isEquine}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isEquine: !!checked })}
                                    />
                                    <Label htmlFor="edit-is-equine">Equine</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-is-storyteller"
                                        disabled={editingDisabled}
                                        checked={formData.isStoryTeller}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isStoryTeller: !!checked })}
                                    />
                                    <Label htmlFor="edit-is-storyteller">Storyteller</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-is-ambassador"
                                        disabled={editingDisabled}
                                        checked={formData.isAmbassador}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isAmbassador: !!checked })}
                                    />
                                    <Label htmlFor="edit-is-ambassador">Ambassador</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-is-photographer"
                                        disabled={editingDisabled}
                                        checked={formData.isPhotographer}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isPhotographer: !!checked })}
                                    />
                                    <Label htmlFor="edit-is-photographer">Photographer</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-in-memoriam"
                                        disabled={editingDisabled}
                                        checked={formData.inMemoriam}
                                        onCheckedChange={(checked) => setFormData({ ...formData, inMemoriam: !!checked })}
                                    />
                                    <Label htmlFor="edit-in-memoriam">In Memoriam</Label>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={editingDisabled}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdate} disabled={saveDisabled}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Person"
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

export default PersonEditDialog
