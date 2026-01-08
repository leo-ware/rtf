"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Search } from "lucide-react"
import AdvisoryBoardCreateDialog from "./AdvisoryBoardCreateDialog"
import ReorderableList from "@/components/ReorderableList"
import { Id } from "@/convex/_generated/dataModel"
import Link from "next/link"
import AdvisoryBoardEditDialog from "./AdvisoryBoardEditDialog"
import AdvisoryBoardDeleteDialog from "./AdvisoryBoardDeleteDialog"

const AdvisoryBoardsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const advisoryBoards = useQuery(api.advisoryBoards.listAdvisoryBoards, { limit: 100 })
    const reorderBoards = useMutation(api.advisoryBoards.reorderAdvisoryBoards)

    const handleReorder = async (newOrder: string[]) => {
        const boards = newOrder.map((id, index) => ({
            id: id as Id<"advisoryBoards">,
            order: index,
        }))
        await reorderBoards({ boards })
    }

    const filtering = !!searchTerm
    const filteredBoards = (advisoryBoards || [])
        .sort((a, b) => a.order - b.order)
        .filter(board => {
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return board.name.toLowerCase().includes(searchLower)
        })

    if (advisoryBoards === undefined) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search advisory boards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <AdvisoryBoardCreateDialog />
                </div>
            </div>

            <div className="text-lg font-medium mb-4">
                {filtering
                    ? `Search Results for "${searchTerm}"`
                    : "All Advisory Boards"}
            </div>

            {filtering && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4 text-sm">
                    Reordering is disabled during search. Clear the search to reorder boards.
                </div>
            )}

            <ReorderableList
                onReorder={handleReorder}
                disabled={filtering}
                items={filteredBoards.map((board) => ({
                    id: board._id,
                    widget: (
                        <div className="w-full pr-4 my-2 flex items-center justify-between gap-x-4">
                            <div>
                                <Link
                                    key={board._id}
                                    href={`/admin/people/advisory-boards/${board._id}`}
                                    className="hover:text-gray-500 font-medium"
                                >
                                    {board.name}
                                </Link>
                            </div>

                            <div className="flex items-center gap-2">
                                <AdvisoryBoardEditDialog advisoryBoardId={board._id} />
                                <AdvisoryBoardDeleteDialog advisoryBoardId={board._id} />
                            </div>
                        </div>
                    )
                }))}
            />

            {filteredBoards.length === 0 && (
                <div className="text-center py-12 w-full">
                    <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No advisory boards found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No advisory boards match "${searchTerm}"`
                            : "Get started by creating your first advisory board."
                        }
                    </p>
                </div>
            )}
        </>
    )
}

export default AdvisoryBoardsTab
