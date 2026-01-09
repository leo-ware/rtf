"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Search } from "lucide-react"
import GroupCreateDialog from "./GroupCreateDialog"
import GroupEditDialog from "./GroupEditDialog"
import GroupDeleteDialog from "./GroupDeleteDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Id } from "@/convex/_generated/dataModel"
import ReorderableList from "@/components/ReorderableList"
import { Card, CardContent } from "@/components/ui/card"

const GroupsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const groups = useQuery(api.educationArticleGroups.listAll)
    const superGroups = useQuery(api.educationArticleSuperGroups.listAll)
    const articles = useQuery(api.educationArticles.listAll)

    const assignGroupToSuperGroup = useMutation(api.educationArticleSuperGroups.assignGroupToSuperGroup)
    const reorderArticles = useMutation(api.educationArticleGroups.reorderArticles)

    const articleNameById: Record<string, string> = {}
    ;(articles || []).forEach((a) => {
        articleNameById[a._id] = a.title
    })

    const superGroupIdByGroupId: Record<string, Id<"educationArticleSuperGroups">> = {}
    ;(superGroups || []).forEach((sg) => {
        sg.groupIds.forEach((groupId) => {
            superGroupIdByGroupId[groupId] = sg._id
        })
    })

    const filtering = !!searchTerm
    const filteredGroups = (groups || [])
        .filter((g) => {
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return g.title.toLowerCase().includes(searchLower)
        })

    if (groups === undefined) {
        return <div className="p-8">Loading...</div>
    }

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
                    <GroupCreateDialog />
                </div>
            </div>

            <div className="text-lg font-medium mb-4">
                {filtering
                    ? `Search Results for "${searchTerm}"`
                    : "All Groups"}
            </div>

            <Accordion type="single" collapsible className="w-full">
                {filteredGroups.map((group) => (
                    <AccordionItem key={group._id} value={group._id} className="w-full border-0 my-2">
                        <Card className="py-3">
                            <CardContent className="py-0">
                                <div className="w-full flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="font-medium truncate">{group.title}</div>
                                        <div className="text-xs text-gray-500 shrink-0">
                                            {group.articleIds.length} article{group.articleIds.length === 1 ? "" : "s"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="w-60">
                                            <Select
                                                value={superGroupIdByGroupId[group._id] ?? "unassigned"}
                                                onValueChange={async (value) => {
                                                    await assignGroupToSuperGroup({
                                                        groupId: group._id,
                                                        superGroupId: value === "unassigned"
                                                            ? null
                                                            : (value as Id<"educationArticleSuperGroups">),
                                                    })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select super group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                                    {(superGroups || []).map((sg) => (
                                                        <SelectItem key={sg._id} value={sg._id}>
                                                            {sg.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <GroupEditDialog group={group} />
                                        <GroupDeleteDialog groupId={group._id} />
                                        <AccordionTrigger className="hover:no-underline p-0 [&>svg]:h-4 [&>svg]:w-4" />
                                    </div>
                                </div>

                                <AccordionContent>
                                    <div className="mt-4 space-y-3">
                                        {group.articleIds.length === 0 ? (
                                            <div className="text-sm text-gray-600">
                                                No articles assigned yet. Assign articles from the Articles tab, or use the edit dialog to build the list.
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-sm text-gray-600">
                                                    Article order (drag to reorder):
                                                </div>
                                                <ReorderableList
                                                    disabled={filtering}
                                                    onReorder={async (newOrder) => {
                                                        await reorderArticles({
                                                            id: group._id,
                                                            articleIds: newOrder as Array<Id<"educationArticles">>,
                                                        })
                                                    }}
                                                    items={group.articleIds.map((articleId) => ({
                                                        id: articleId,
                                                        widget: (
                                                            <div className="w-full flex items-center justify-between">
                                                                <div className="text-sm text-gray-700">
                                                                    {articleNameById[articleId] ?? articleId}
                                                                </div>
                                                            </div>
                                                        ),
                                                    }))}
                                                />
                                            </>
                                        )}
                                    </div>
                                </AccordionContent>
                            </CardContent>
                        </Card>
                    </AccordionItem>
                ))}
            </Accordion>

            {filteredGroups.length === 0 && (
                <div className="text-center py-12 w-full">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No groups match "${searchTerm}"`
                            : "Get started by creating your first group."
                        }
                    </p>
                </div>
            )}
        </>
    )
}

export default GroupsTab


