"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Search } from "lucide-react"
import ConvexImageFromId from "@/components/images/ConvexImageFromId"
import ProgramGroupCreateDialog from "./ProgramGroupCreateDialog"
import ProgramGroupEditDialog from "./ProgramGroupEditDialog"
import ProgramGroupDeleteDialog from "./ProgramGroupDeleteDialog"
import ReorderableList from "@/components/ReorderableList"
import { Id } from "@/convex/_generated/dataModel"

const ProgramGroupsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const programGroups = useQuery(api.programGroups.getAllProgramGroups)
    const reorderProgramGroups = useMutation(api.programGroups.reorderProgramGroups)

    const handleReorder = async (newOrder: string[]) => {
        await reorderProgramGroups({ ids: newOrder as Id<"programGroups">[] })
    }

    const filtering = !!searchTerm
    const filteredProgramGroups = (programGroups || [])
        .sort((a, b) => a.order - b.order)
        .filter(group => {
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return (
                group.name.toLowerCase().includes(searchLower) ||
                group.description.toLowerCase().includes(searchLower)
            )
        })

    if (programGroups === undefined) {
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
                    <ProgramGroupCreateDialog />
                </div>
            </div>

            <div className="text-lg font-medium mb-4">
                {filtering
                    ? `Search Results for "${searchTerm}"`
                    : "All Program Groups"}
            </div>

            <Accordion type="single" collapsible className="w-full">
                <ReorderableList
                    onReorder={handleReorder}
                    disabled={filtering}
                    items={filteredProgramGroups.map((group) => ({
                        id: group._id,
                        widget: (
                            <AccordionItem key={group._id} value={group._id} className="w-full mr-4">
                                <div className="w-full grid grid-cols-[auto_1fr_auto] gap-x-4 my-2">
                                    <div className="col-span-3 grid grid-cols-subgrid">
                                        <div className="col-span-1 flex items-center gap-2">
                                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                {group.imageId ? (
                                                    <ConvexImageFromId
                                                        imageId={group.imageId}
                                                        className="w-16 h-16"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex items-center gap-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium">{group.name}</span>
                                                <Badge variant={group.isPublic ? "default" : "secondary"}>
                                                    {group.isPublic ? "Public" : "Private"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex items-center gap-2 flex-shrink-0">
                                            <ProgramGroupEditDialog programGroup={group} />
                                            <ProgramGroupDeleteDialog programGroupId={group._id} />
                                            <AccordionTrigger className="hover:no-underline p-0 [&>svg]:h-4 [&>svg]:w-4" />
                                        </div>
                                    </div>

                                    <div className="col-start-2 col-span-1">
                                        <AccordionContent>
                                            <div className="mt-4">
                                                <div className="text-sm text-gray-600">{group.description}</div>
                                            </div>
                                        </AccordionContent>
                                    </div>
                                </div>
                            </AccordionItem>
                        )
                    }))}
                />
            </Accordion>

            {filteredProgramGroups.length === 0 && (
                <div className="text-center py-12 w-full">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No program groups found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No program groups match "${searchTerm}"`
                            : "Get started by creating your first program group."
                        }
                    </p>
                </div>
            )}
        </>
    )
}

export default ProgramGroupsTab
