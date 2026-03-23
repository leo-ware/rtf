"use client"

import { useState, useMemo, useRef, useEffect, useCallback, KeyboardEvent } from "react"
import { useQuery, useMutation, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Trash2, ChevronsUpDown, Search } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
                    <label className="text-sm font-medium">Associate Herds</label>
                    <ServerSearchMultiSelect
                        selectedIds={herdIds as string[]}
                        onChange={(ids) => setHerdIds(ids as Id<"herds">[])}
                        searchEndpoint="searchHerds"
                        placeholder="Search herds..."
                        label="herds"
                    />
                </div>
            )}

            {/* Animals */}
            {animalIds && setAnimalIds && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Associate Horses</label>
                    <ServerSearchMultiSelect
                        selectedIds={animalIds as string[]}
                        onChange={(ids) => setAnimalIds(ids as Id<"animals">[])}
                        searchEndpoint="searchAnimals"
                        placeholder="Search animals..."
                        label="animals"
                    />
                </div>
            )}

            {/* Topics */}
            {topics && setTopics && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Promote on these Pages</label>
                    <ClientSearchMultiSelect
                        selectedIds={topics}
                        onChange={setTopics}
                        options={availableTopics}
                        placeholder="Search topics..."
                        label="topics"
                    />
                </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Select Tags</label>
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
                <ClientSearchMultiSelect
                    selectedIds={tags}
                    onChange={setTags}
                    options={sortedTags}
                    placeholder="Search tags..."
                    label="tags"
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

/**
 * Server-side search multi-select for herds/animals.
 * Sends search query to Convex and displays results.
 */
function ServerSearchMultiSelect({ selectedIds, onChange, searchEndpoint, placeholder, label }: {
    selectedIds: string[]
    onChange: (ids: string[]) => void
    searchEndpoint: "searchHerds" | "searchAnimals"
    placeholder: string
    label: string
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const searchQuery = search.trim() || undefined
    const { results, status, loadMore } = usePaginatedQuery(
        api.articleMetadata[searchEndpoint],
        { query: searchQuery },
        { initialNumItems: 20 }
    )

    // Resolve names for already-selected items (they may not be in current search results)
    const { results: allResults } = usePaginatedQuery(
        api.articleMetadata[searchEndpoint],
        { query: undefined },
        { initialNumItems: 20 }
    )

    const selectedNames = useMemo(() => {
        const map = new Map<string, string>()
        for (const item of allResults ?? []) {
            if (selectedIds.includes(item._id)) {
                map.set(item._id, item.name)
            }
        }
        for (const item of results ?? []) {
            if (selectedIds.includes(item._id)) {
                map.set(item._id, item.name)
            }
        }
        return map
    }, [allResults, results, selectedIds])

    // Infinite scroll: load more when sentinel is visible
    const handleLoadMore = useCallback(() => {
        if (status === "CanLoadMore") {
            loadMore(20)
        }
    }, [status, loadMore])

    useEffect(() => {
        const sentinel = sentinelRef.current
        const scrollContainer = scrollRef.current
        if (!sentinel || !scrollContainer) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    handleLoadMore()
                }
            },
            { root: scrollContainer, threshold: 0.1 }
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [handleLoadMore])

    const toggle = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(sid => sid !== id))
        } else {
            onChange([...selectedIds, id])
        }
    }

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch("") }}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        type="button"
                        className="w-full justify-between font-normal"
                    >
                        <span className="text-muted-foreground">
                            {selectedIds.length === 0
                                ? `Select ${label}...`
                                : `${selectedIds.length} ${label} selected`
                            }
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 opacity-50" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={placeholder}
                            className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            autoFocus
                        />
                    </div>
                    <div ref={scrollRef} className="max-h-[200px] overflow-y-auto p-1">
                        {status === "LoadingFirstPage" && (
                            <p className="py-4 text-center text-sm text-muted-foreground">Loading...</p>
                        )}
                        {status !== "LoadingFirstPage" && results.length === 0 && (
                            <p className="py-4 text-center text-sm text-muted-foreground">No results found.</p>
                        )}
                        {results.map(opt => {
                            const isSelected = selectedIds.includes(opt._id)
                            return (
                                <div
                                    key={opt._id}
                                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                                    onClick={() => toggle(opt._id)}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggle(opt._id)}
                                        className="pointer-events-none"
                                    />
                                    <span className="flex-1">{opt.name}</span>
                                </div>
                            )
                        })}
                        {status !== "Exhausted" && status !== "LoadingFirstPage" && (
                            <div ref={sentinelRef} className="py-2 text-center text-xs text-muted-foreground">
                                {status === "LoadingMore" ? "Loading..." : ""}
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Selected items as badges */}
            {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedIds.map(id => (
                        <Badge
                            key={id}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => toggle(id)}
                        >
                            {selectedNames.get(id) ?? id}
                            <X className="ml-1 h-3 w-3" />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

/**
 * Client-side search multi-select for topics/tags (small, static lists).
 */
function ClientSearchMultiSelect<T extends string>({ selectedIds, onChange, options, placeholder, label, onDelete }: {
    selectedIds: T[]
    onChange: (ids: T[]) => void
    options: { _id: T, name: string }[] | undefined
    placeholder: string
    label: string
    onDelete?: (id: T) => void
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    if (options === undefined) {
        return <span className="text-sm text-muted-foreground">Loading...</span>
    }

    const filtered = search.trim()
        ? options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase().trim()))
        : options

    const selectedOptions = options.filter(opt => selectedIds.includes(opt._id))

    const toggle = (id: T) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(sid => sid !== id))
        } else {
            onChange([...selectedIds, id])
        }
    }

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch("") }}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        type="button"
                        className="w-full justify-between font-normal"
                    >
                        <span className="text-muted-foreground">
                            {selectedIds.length === 0
                                ? `Select ${label}...`
                                : `${selectedIds.length} ${label} selected`
                            }
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 opacity-50" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={placeholder}
                            className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filtered.length === 0 && (
                            <p className="py-4 text-center text-sm text-muted-foreground">No results found.</p>
                        )}
                        {filtered.map(opt => {
                            const isSelected = selectedIds.includes(opt._id)
                            return (
                                <div
                                    key={opt._id}
                                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent group"
                                    onClick={() => toggle(opt._id)}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggle(opt._id)}
                                        className="pointer-events-none"
                                    />
                                    <span className="flex-1">{opt.name}</span>
                                    {onDelete && (
                                        <div
                                            className="opacity-0 group-hover:opacity-100 hover:text-red-500 p-0.5 rounded-full hover:bg-red-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDelete(opt._id)
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Selected items as badges */}
            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.map(opt => (
                        <Badge
                            key={opt._id}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => toggle(opt._id)}
                        >
                            {opt.name}
                            <X className="ml-1 h-3 w-3" />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
