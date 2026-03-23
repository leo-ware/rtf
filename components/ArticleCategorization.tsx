"use client"

import { useState, useMemo, KeyboardEvent } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Plus, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type ArticleCategorizationProps = {
    herdIds?: Id<"herds">[]
    setHerdIds?: (ids: Id<"herds">[]) => void
    animalIds?: Id<"animals">[]
    setAnimalIds?: (ids: Id<"animals">[]) => void
    topics?: string[]
    setTopics?: (topics: string[]) => void
    tags: Id<"tags">[]
    setTags: (tags: Id<"tags">[]) => void
}

export function ArticleCategorization({
    herdIds,
    setHerdIds,
    animalIds,
    setAnimalIds,
    topics,
    setTopics,
    tags,
    setTags
}: ArticleCategorizationProps) {
    const herds = useQuery(api.articleMetadata.listHerds)
    const animals = useQuery(api.articleMetadata.listAnimals)
    const availableTopics = useQuery(api.articleMetadata.listTopics)
    const availableTags = useQuery(api.tags.list)

    const createTag = useMutation(api.tags.create)
    const deleteTag = useMutation(api.tags.deleteTag)

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [newTagName, setNewTagName] = useState("")
    const [tagPendingDelete, setTagPendingDelete] = useState<Id<"tags"> | null>(null)

    const pendingDeleteTagName = availableTags?.find(t => t._id === tagPendingDelete)?.name ?? "this tag"

    const similarTags = useMemo(() => {
        if (!availableTags || !newTagName.trim()) return []
        const search = newTagName.toLowerCase().trim()
        return availableTags.filter(t => t.name.toLowerCase().includes(search))
    }, [availableTags, newTagName])

    const similarTopics = useMemo(() => {
        if (!availableTopics || !newTagName.trim()) return []
        const search = newTagName.toLowerCase().trim()
        return availableTopics.filter(t => t.name.toLowerCase().includes(search))
    }, [availableTopics, newTagName])

    const exactTagExists = useMemo(() => {
        return availableTags?.some(t => t.name.toLowerCase() === newTagName.toLowerCase().trim()) ?? false
    }, [availableTags, newTagName])

    const handleOpenCreateDialog = () => {
        setNewTagName("")
        setCreateDialogOpen(true)
    }

    const handleCreateTag = async () => {
        if (!newTagName.trim() || exactTagExists) return
        const newId = await createTag({ name: newTagName.trim() })
        setTags([...tags, newId])
        setNewTagName("")
        setCreateDialogOpen(false)
    }

    const handleSelectExistingTag = (id: Id<"tags">) => {
        if (!tags.includes(id)) {
            setTags([...tags, id])
        }
        setCreateDialogOpen(false)
    }

    const sortedTags = useMemo(() => {
        if (!availableTags) return undefined
        return [...availableTags].sort((a, b) => a.name.localeCompare(b.name))
    }, [availableTags])

    const hasSimilarMatches = newTagName.trim() && (similarTags.length > 0 || similarTopics.length > 0)

    return (
        <div className="space-y-4">

            {/* Herds */}
            {herdIds && setHerdIds && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select one or more herds related to this article</label>
                    <SimpleMultiSelect
                        selectedIds={herdIds}
                        onChange={setHerdIds}
                        options={herds}
                        placeholder="Select herds..."
                    />
                </div>
            )}

            {/* Animals */}
            {animalIds && setAnimalIds && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select one or more animals related to this article</label>
                    <SimpleMultiSelect
                        selectedIds={animalIds}
                        onChange={setAnimalIds}
                        options={animals}
                        placeholder="Select animals..."
                    />
                </div>
            )}

            {/* Topics */}
            {topics && setTopics && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Choose which site page(s) to display this article on</label>
                    <SimpleMultiSelect
                        selectedIds={topics}
                        onChange={setTopics}
                        options={availableTopics}
                        placeholder="Select topics..."
                    />
                </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Select one or more tags for this article</label>
                    <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={handleOpenCreateDialog}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        New Tag
                    </Button>
                </div>
                <SimpleMultiSelect
                    selectedIds={tags}
                    onChange={setTags}
                    options={sortedTags}
                    placeholder="Select tags..."
                    onDelete={(id) => setTagPendingDelete(id)}
                />

                {/* Create Tag Dialog */}
                <Dialog
                    open={createDialogOpen}
                    onOpenChange={(open) => { setCreateDialogOpen(open); if (!open) setNewTagName("") }}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Tag</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Tag name..."
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === "Enter") { e.preventDefault(); handleCreateTag() }
                                }}
                                autoFocus
                            />

                            {hasSimilarMatches && (
                                <div className="space-y-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                    <p className="text-sm font-semibold text-amber-800">
                                        Is your tag already created?
                                    </p>

                                    {similarTopics.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-amber-700">
                                                These are official site page categories (topics):
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {similarTopics.map(t => (
                                                    <Badge key={t._id} variant="outline" className="text-xs border-amber-300 text-amber-800">
                                                        {t.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {similarTags.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-amber-700">
                                                Existing tags — click one to select it instead:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {similarTags.map(t => (
                                                    <Badge
                                                        key={t._id}
                                                        variant="secondary"
                                                        className="cursor-pointer text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                                                        onClick={() => handleSelectExistingTag(t._id)}
                                                    >
                                                        {t.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {exactTagExists && (
                                <p className="text-sm text-destructive">
                                    A tag with this name already exists. Select it from the list above.
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateTag}
                                disabled={!newTagName.trim() || exactTagExists}
                            >
                                {newTagName.trim() ? `Create "${newTagName.trim()}"` : "Create Tag"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Tag AlertDialog */}
                <AlertDialog
                    open={tagPendingDelete !== null}
                    onOpenChange={(open) => { if (!open) setTagPendingDelete(null) }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tag: {pendingDeleteTagName}</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently remove &quot;{pendingDeleteTagName}&quot; from ALL articles that use it.
                                The tag can be recreated later with the same name if needed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
                            <AlertDialogCancel onClick={() => setTagPendingDelete(null)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                variant="outline"
                                onClick={() => {
                                    setTags(tags.filter(id => id !== tagPendingDelete))
                                    setTagPendingDelete(null)
                                }}
                            >
                                Remove from article only
                            </AlertDialogAction>
                            <AlertDialogAction
                                variant="destructive"
                                onClick={() => {
                                    if (tagPendingDelete) {
                                        deleteTag({ id: tagPendingDelete })
                                        setTags(tags.filter(id => id !== tagPendingDelete))
                                    }
                                    setTagPendingDelete(null)
                                }}
                            >
                                DELETE from database
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

function SimpleMultiSelect<T extends string>({ selectedIds, onChange, options, placeholder, onDelete }: {
    selectedIds: T[],
    onChange: (ids: T[]) => void,
    options: { _id: T, name: string }[] | undefined,
    placeholder: string,
    onDelete?: (id: T) => void
}) {
    if (options === undefined) {
        return <span className="text-sm text-muted-foreground">Loading...</span>
    }

    return (
        <div className="flex flex-wrap gap-2">
            {options.map(opt => {
                const isSelected = selectedIds.includes(opt._id);
                return (
                    <Badge
                        key={opt._id}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                            if (isSelected) {
                                onChange(selectedIds.filter(id => id !== opt._id));
                            } else {
                                onChange([...selectedIds, opt._id]);
                            }
                        }}
                    >
                        {opt.name}
                        {isSelected && <X className="ml-1 h-3 w-3" />}
                        {onDelete && (
                            <div
                                className="ml-1 hover:text-red-500 p-0.5 rounded-full hover:bg-red-100"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(opt._id)
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </div>
                        )}
                    </Badge>
                )
            })}
            {options.length === 0 && <span className="text-sm text-muted-foreground">No items found.</span>}
        </div>
    )
}
