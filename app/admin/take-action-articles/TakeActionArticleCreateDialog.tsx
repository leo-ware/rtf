"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { generateSlug } from "@/lib/utils"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import { Id } from "@/convex/_generated/dataModel"

type TakeActionArticleCreateDialogProps = {
    children?: React.ReactNode
    onError?: (error: unknown) => void
}

const TakeActionArticleCreateDialog = ({ children, onError }: TakeActionArticleCreateDialogProps) => {
    const router = useRouter()
    const createTakeActionArticle = useMutation(api.takeActionArticle.createTakeActionArticle)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        imageId: null as Id<"images"> | null,
        description: "",
    })
    const [slugSetManually, setSlugSetManually] = useState(false)

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.slug.trim()
    )

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            title: "",
            slug: "",
            imageId: null,
            description: "",
        })
        setError(null)
        setSlugSetManually(false)
    }

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            const id = await createTakeActionArticle({
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                imageId: formData.imageId || undefined,
                description: formData.description.trim(),
            })
            setIsOpen(false)
            resetForm()
            router.push(`/admin/take-action-articles/${id}`)
        } catch (err) {
            console.error("Error creating take action article:", err)
            setError(`Failed to create take action article. ${err}`)
            onError?.(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (open) {
                    resetForm()
                }
                setIsOpen(open)
            }}
        >
            <DialogTrigger asChild>
                {children ? children : <Button>Create Take Action Article</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Take Action Article</DialogTitle>
                    <DialogDescription>
                        Create a new take action article. You&apos;ll edit the HTML content on the next page.
                        New articles start as private.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
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
                            value={formData.slug}
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
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Short description shown in the Take Action section"
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label>Image</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId}
                            onImageSelect={(imageId) => setFormData({ ...formData, imageId })}
                            disabled={editingDisabled}
                        />
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
                                "Create"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TakeActionArticleCreateDialog


