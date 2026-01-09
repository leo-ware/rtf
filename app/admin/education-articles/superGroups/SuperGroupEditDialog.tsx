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

export type EducationArticleSuperGroup = {
    _id: Id<"educationArticleSuperGroups">
    title: string
    groupIds: Array<Id<"educationArticleGroups">>
}

type SuperGroupEditDialogProps = {
    superGroup: EducationArticleSuperGroup
    children?: React.ReactNode
}

const SuperGroupEditDialog = ({ superGroup, children }: SuperGroupEditDialogProps) => {
    const updateSuperGroup = useMutation(api.educationArticleSuperGroups.update)

    const allGroups = useQuery(api.educationArticleGroups.listAll)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: superGroup.title,
        groupIds: superGroup.groupIds as Array<Id<"educationArticleGroups">>,
    })

    useEffect(() => {
        setFormData({
            title: superGroup.title,
            groupIds: superGroup.groupIds as Array<Id<"educationArticleGroups">>,
        })
    }, [superGroup])

    const availableGroups = useMemo(() => {
        const selected = new Set(formData.groupIds)
        return (allGroups || []).filter((g) => !selected.has(g._id))
    }, [allGroups, formData.groupIds])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.title
    )

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            title: superGroup.title,
            groupIds: superGroup.groupIds as Array<Id<"educationArticleGroups">>,
        })
        setError(null)
    }

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateSuperGroup({
                id: superGroup._id,
                title: formData.title,
                groupIds: formData.groupIds,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating super group:", err)
            setError(`Failed to update super group. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const removeGroup = (groupId: Id<"educationArticleGroups">) => {
        setFormData((prev) => ({
            ...prev,
            groupIds: prev.groupIds.filter((id) => id !== groupId),
        }))
    }

    const addGroup = (groupId: Id<"educationArticleGroups">) => {
        setFormData((prev) => ({
            ...prev,
            groupIds: [...prev.groupIds, groupId],
        }))
    }

    const groupNameById = useMemo(() => {
        const map: Record<string, string> = {}
        ;(allGroups || []).forEach((g) => {
            map[g._id] = g.title
        })
        return map
    }, [allGroups])

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
                    <DialogTitle>Edit Super Group</DialogTitle>
                    <DialogDescription>
                        Update the super group and its ordered groups.
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
                            placeholder="Enter super group title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Groups</Label>

                        <div className="flex items-center gap-2">
                            <Select
                                disabled={editingDisabled || availableGroups.length === 0}
                                onValueChange={(value) => addGroup(value as Id<"educationArticleGroups">)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Add a group..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableGroups.map((g) => (
                                        <SelectItem key={g._id} value={g._id}>
                                            {g.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <ReorderableList
                            disabled={editingDisabled}
                            onReorder={(newOrder) => setFormData((prev) => ({
                                ...prev,
                                groupIds: newOrder as Array<Id<"educationArticleGroups">>,
                            }))}
                            items={formData.groupIds.map((groupId) => ({
                                id: groupId,
                                widget: (
                                    <div className="w-full flex items-center justify-between gap-3">
                                        <div className="text-sm">
                                            {groupNameById[groupId] ?? groupId}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={editingDisabled}
                                            onClick={() => removeGroup(groupId)}
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

export default SuperGroupEditDialog


