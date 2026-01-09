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
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export type EducationArticle = {
    _id: Id<"educationArticles">
    title: string
    slug?: string
    description: string
    content: string
    isPublic: boolean
}

type ArticleEditDialogProps = {
    article: EducationArticle
    children?: React.ReactNode
}

const ArticleEditDialog = ({ article, children }: ArticleEditDialogProps) => {
    const updateArticle = useMutation(api.educationArticles.updateMetadata)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: article.title,
        slug: article.slug || "",
        description: article.description,
        isPublic: article.isPublic,
    })

    useEffect(() => {
        setFormData({
            title: article.title,
            slug: article.slug || "",
            description: article.description,
            isPublic: article.isPublic,
        })
    }, [article])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.title ||
        !formData.slug ||
        !formData.description
    )

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateArticle({
                id: article._id,
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                isPublic: formData.isPublic,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating article:", err)
            setError(`Failed to update article. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            title: article.title,
            slug: article.slug || "",
            description: article.description,
            isPublic: article.isPublic,
        })
        setError(null)
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Article</DialogTitle>
                    <DialogDescription>
                        Update metadata and visibility. Content is edited on the dedicated editor page.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="e.g. wild-horse-history"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="rounded"
                        />
                        <Label htmlFor="isPublic">Public</Label>
                    </div>

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
                                "Update"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ArticleEditDialog


