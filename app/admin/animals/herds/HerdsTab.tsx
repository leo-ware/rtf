"use client"

import { useState } from "react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, Edit } from "lucide-react"
import Link from "next/link"
import HerdCreateDialog from "./HerdCreateDialog"
import HerdDeleteDialog from "./HerdDeleteDialog"

const HerdsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const { results: herds } = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })

    const filteredHerds = herds?.filter((herd) => {
        if (!searchTerm) return true
        return herd.name.toLowerCase().includes(searchTerm.toLowerCase())
    }) || []

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (herds === undefined) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[200px]">
                <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span className="text-gray-500 text-sm mt-1">Fetching herds...</span>
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
                        placeholder="Search herds..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <HerdCreateDialog />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Herds</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredHerds.map((herd) => (
                                    <tr key={herd._id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-gray-900">{herd.name}</div>
                                            <div className="text-sm text-gray-500">{herd.slug}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(herd._creationTime)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/admin/animals/edit-herd/${herd._id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <HerdDeleteDialog herdId={herd._id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredHerds.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No herds found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? `No herds match "${searchTerm}"`
                                    : "Get started by creating your first herd."
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default HerdsTab


