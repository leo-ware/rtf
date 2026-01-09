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
import { Edit, Loader2, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ReorderableList from "@/components/ReorderableList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type EducationArticleGroup = {
    _id: Id<"educationArticleGroups">
    title: string
    articleIds: Array<Id<"educationArticles">>
}

type GroupEditDialogProps = {
    group: EducationArticleGroup
    children?: React.ReactNode
}

const GroupEditDialog = ({ group, children }: GroupEditDialogProps) => {
    const updateGroup = useMutation(api.educationArticleGroups.update)

    const allArticles = useQuery(api.educationArticles.listAll)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: group.title,
        articleIds: group.articleIds as Array<Id<"educationArticles">>,
    })

    useEffect(() => {
        setFormData({
            title: group.title,
            articleIds: group.articleIds as Array<Id<"educationArticles">>,
        })
    }, [group])

    const availableArticles = useMemo(() => {
        const selected = new Set(formData.articleIds)
        return (allArticles || []).filter((a) => !selected.has(a._id))
    }, [allArticles, formData.articleIds])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.title
    )

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            title: group.title,
            articleIds: group.articleIds as Array<Id<"educationArticles">>,
        })
        setError(null)
    }

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateGroup({
                id: group._id,
                title: formData.title,
                articleIds: formData.articleIds,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating group:", err)
            setError(`Failed to update group. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const removeArticle = (articleId: Id<"educationArticles">) => {
        setFormData((prev) => ({
            ...prev,
            articleIds: prev.articleIds.filter((id) => id !== articleId),
        }))
    }

    const addArticle = (articleId: Id<"educationArticles">) => {
        setFormData((prev) => ({
            ...prev,
            articleIds: [...prev.articleIds, articleId],
        }))
    }

    const articleNameById = useMemo(() => {
        const map: Record<string, string> = {}
        ;(allArticles || []).forEach((a) => {
            map[a._id] = a.title
        })
        return map
    }, [allArticles])

    return (
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
                    <DialogTitle>Edit Group</DialogTitle>
                    <DialogDescription>
                        Update the group and its ordered articles.
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
                            placeholder="Enter group title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Articles</Label>

                        <div className="flex items-center gap-2">
                            <Select
                                disabled={editingDisabled || availableArticles.length === 0}
                                onValueChange={(value) => addArticle(value as Id<"educationArticles">)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Add an article..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableArticles.map((a) => (
                                        <SelectItem key={a._id} value={a._id}>
                                            {a.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <ReorderableList
                            disabled={editingDisabled}
                            onReorder={(newOrder) => setFormData((prev) => ({
                                ...prev,
                                articleIds: newOrder as Array<Id<"educationArticles">>,
                            }))}
                            items={formData.articleIds.map((articleId) => ({
                                id: articleId,
                                widget: (
                                    <div className="w-full flex items-center justify-between gap-3">
                                        <div className="text-sm">
                                            {articleNameById[articleId] ?? articleId}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={editingDisabled}
                                            onClick={() => removeArticle(articleId)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ),
                            }))}
                        />
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

export default GroupEditDialog


