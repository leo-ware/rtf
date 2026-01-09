"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Search } from "lucide-react"
import ReorderableList from "@/components/ReorderableList"
import { Id } from "@/convex/_generated/dataModel"
import SuperGroupCreateDialog from "./SuperGroupCreateDialog"
import SuperGroupEditDialog from "./SuperGroupEditDialog"
import SuperGroupDeleteDialog from "./SuperGroupDeleteDialog"

const SuperGroupsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const superGroups = useQuery(api.educationArticleSuperGroups.listAll)
    const groups = useQuery(api.educationArticleGroups.listAll)
    const reorderGroups = useMutation(api.educationArticleSuperGroups.reorderGroups)
    const reorderSuperGroups = useMutation(api.educationArticleSuperGroups.reorderSuperGroups)

    const handleSuperGroupReorder = async (newOrder: Array<string>) => {
        await reorderSuperGroups({
            ids: newOrder as Array<Id<"educationArticleSuperGroups">>,
        })
    }

    const handleReorder = async (superGroupId: Id<"educationArticleSuperGroups">, newOrder: Array<string>) => {
        await reorderGroups({
            id: superGroupId,
            groupIds: newOrder as Array<Id<"educationArticleGroups">>,
        })
    }

    const filtering = !!searchTerm
    const filteredSuperGroups = (superGroups || [])
        .filter((sg) => {
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return sg.title.toLowerCase().includes(searchLower)
        })

    if (superGroups === undefined) {
        return <div className="p-8">Loading...</div>
    }

    const groupNameById: Record<string, string> = {}
    ;(groups || []).forEach((g) => {
        groupNameById[g._id] = g.title
    })

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SuperGroupCreateDialog />
                </div>
            </div>

            <div className="text-lg font-medium mb-4">
                {filtering
                    ? `Search Results for "${searchTerm}"`
                    : "All Super Groups"}
            </div>

            <Accordion type="single" collapsible className="w-full">
                <ReorderableList
                    disabled={filtering}
                    onReorder={handleSuperGroupReorder}
                    items={filteredSuperGroups.map((superGroup) => ({
                        id: superGroup._id,
                        widget: (
                            <AccordionItem key={superGroup._id} value={superGroup._id} className="w-full mr-4">
                                <div className="w-full grid grid-cols-[1fr_auto] gap-x-4 my-2">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">{superGroup.title}</span>
                                        <span className="text-xs text-gray-500">
                                            {superGroup.groupIds.length} group{superGroup.groupIds.length === 1 ? "" : "s"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0 justify-end">
                                        <SuperGroupEditDialog superGroup={superGroup} />
                                        <SuperGroupDeleteDialog superGroupId={superGroup._id} />
                                        <AccordionTrigger className="hover:no-underline p-0 [&>svg]:h-4 [&>svg]:w-4" />
                                    </div>

                                    <div className="col-span-2">
                                        <AccordionContent>
                                            <div className="mt-4 space-y-3">
                                                {superGroup.groupIds.length === 0 ? (
                                                    <div className="text-sm text-gray-600">
                                                        No groups assigned yet. Assign groups from the Groups tab, or use the edit dialog to build the list.
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="text-sm text-gray-600">
                                                            Group order (drag to reorder):
                                                        </div>
                                                        <ReorderableList
                                                            disabled={filtering}
                                                            onReorder={(newOrder) => handleReorder(superGroup._id, newOrder)}
                                                            items={superGroup.groupIds.map((groupId) => ({
                                                                id: groupId,
                                                                widget: (
                                                                    <div className="w-full flex items-center justify-between">
                                                                        <div className="text-sm text-gray-700">
                                                                            {groupNameById[groupId] ?? groupId}
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            }))}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </div>
                                </div>
                            </AccordionItem>
                        ),
                    }))}
                />
            </Accordion>

            {filteredSuperGroups.length === 0 && (
                <div className="text-center py-12 w-full">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No super groups found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No super groups match "${searchTerm}"`
                            : "Get started by creating your first super group."
                        }
                    </p>
                </div>
            )}
        </>
    )
}

export default SuperGroupsTab


