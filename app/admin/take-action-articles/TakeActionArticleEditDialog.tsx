"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { generateSlug } from "@/lib/utils"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"

type TakeActionArticleEditDialogProps = {
    takeActionArticleId: Id<"takeActionArticle">
    children?: React.ReactNode
    onError?: (error: unknown) => void
}

const TakeActionArticleEditDialog = ({
    takeActionArticleId,
    children,
    onError,
}: TakeActionArticleEditDialogProps) => {
    const takeActionArticle = useQuery(api.takeActionArticle.getTakeActionArticle, { id: takeActionArticleId })
    const updateTakeActionArticle = useMutation(api.takeActionArticle.updateTakeActionArticle)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: undefined as string | undefined,
        slug: undefined as string | undefined,
        imageId: undefined as Id<"images"> | undefined,
        description: undefined as string | undefined,
        isPublic: undefined as boolean | undefined,
    })
    const [slugSetManually, setSlugSetManually] = useState(false)

    useEffect(() => {
        if (takeActionArticle) {
            setFormData({
                title: takeActionArticle.title,
                slug: takeActionArticle.slug,
                imageId: takeActionArticle.imageId,
                description: takeActionArticle.description,
                isPublic: takeActionArticle.isPublic,
            })
            setSlugSetManually(true)
        }
    }, [takeActionArticle])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.title?.trim() ||
        !formData.slug?.trim() ||
        !formData.description?.trim() ||
        typeof formData.isPublic !== "boolean"
    )

    const handleSave = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateTakeActionArticle({
                id: takeActionArticleId,
                title: formData.title?.trim(),
                slug: formData.slug?.trim(),
                imageId: formData.imageId,
                description: formData.description?.trim(),
                isPublic: formData.isPublic,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating take action article:", err)
            setError("Failed to update take action article")
            onError?.(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        Edit
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Take Action Article</DialogTitle>
                    <DialogDescription>
                        Edit the title/description and publish status. Use the editor page to change the HTML content.
                    </DialogDescription>
                </DialogHeader>

                {!takeActionArticle && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                    </div>
                )}

                {!!takeActionArticle && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title || ""}
                                disabled={editingDisabled}
                                onChange={(e) => {
                                    const nextTitle = e.target.value
                                    setFormData((prev) => {
                                        const next = { ...prev, title: nextTitle }
                                        if (!slugSetManually) {
                                            next.slug = generateSlug(nextTitle)
                                        }
                                        return next
                                    })
                                }}
                                placeholder="Enter title"
                            />
                        </div>

                        <div>
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                value={formData.slug || ""}
                                disabled={editingDisabled}
                                onChange={(e) => {
                                    setFormData({ ...formData, slug: e.target.value })
                                    setSlugSetManually(true)
                                }}
                                placeholder="take-action-article-slug"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ""}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Short description shown in the Take Action section"
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label>Image</Label>
                            <ImagePickerDialog
                                imageId={formData.imageId || null}
                                onImageSelect={(imageId) => setFormData({ ...formData, imageId: imageId || undefined })}
                                disabled={editingDisabled}
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <Label>Public</Label>
                                <div className="text-xs text-gray-600">
                                    Public articles are visible to anyone. Private articles require authorized access.
                                </div>
                            </div>
                            <Switch
                                checked={formData.isPublic === true}
                                disabled={editingDisabled}
                                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                    </div>
                )}

                <DialogFooter className="mt-4">
                    <Button onClick={handleSave} disabled={saveDisabled}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TakeActionArticleEditDialog


