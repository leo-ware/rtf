"use client"

import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, FileText, Gift, Heart, Users, Search } from "lucide-react"
import { ImSpinner8 } from "react-icons/im"
import { useState, useEffect, useCallback } from "react"
import DonationFormCreateDialog from "./DonationFormCreateDialog"
import DonationFormEditDialog from "./DonationFormEditDialog"
import DonationFormDeleteDialog from "./DonationFormDeleteDialog"
import DonationFormHelpDialog from "./DonationFormHelpDialog"

// Simple debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

const AdminDonationFormsPage = () => {
    useEffect(() => {
        document.title = "Donation Forms - RTF Admin"
    }, [])

    const [searchText, setSearchText] = useState("")
    const debouncedSearch = useDebounce(searchText, 300)

    const { results: forms, loadMore, status } = usePaginatedQuery(
        api.donationForms.paginatedDonationFormsWithUsage,
        { searchText: debouncedSearch || undefined },
        { initialNumItems: 25 }
    )

    if (forms === undefined) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center p-8 min-h-[200px]">
                        <div className="flex flex-col items-center gap-2">
                            <ImSpinner8 className="animate-spin h-6 w-6 text-gray-400" />
                            <span className="text-gray-500 text-sm mt-1">Loading donation forms...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search donation forms..."
                            className="max-w-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DonationFormHelpDialog />
                        <DonationFormCreateDialog />
                    </div>
                </div>

                {/* Forms List */}
                {forms.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchText ? "No matching forms found" : "No donation forms yet"}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchText
                                ? "Try adjusting your search terms."
                                : "Get started by creating your first donation form configuration."
                            }
                        </p>
                        {!searchText && <DonationFormCreateDialog />}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border divide-y">
                        {forms.map((form) => {
                            const totalUsage = form.usage.pathways.length + form.usage.animals.length + form.usage.herds.length

                            return (
                                <div key={form._id} className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {/* Icon */}
                                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText className="h-6 w-6 text-gray-400" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">{form.name}</span>
                                                {totalUsage > 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {totalUsage} use{totalUsage !== 1 ? "s" : ""}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                                                    {form.formId}
                                                </span>
                                                {form.notes && (
                                                    <span className="ml-2 text-gray-400">
                                                        {form.notes}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Usage badges */}
                                            {totalUsage > 0 && (
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {form.usage.pathways.length > 0 && (
                                                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                                                            <Gift className="h-3 w-3" />
                                                            {form.usage.pathways.length} pathway{form.usage.pathways.length !== 1 ? "s" : ""}
                                                        </Badge>
                                                    )}
                                                    {form.usage.animals.length > 0 && (
                                                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                                                            <Heart className="h-3 w-3" />
                                                            {form.usage.animals.length} animal{form.usage.animals.length !== 1 ? "s" : ""}
                                                        </Badge>
                                                    )}
                                                    {form.usage.herds.length > 0 && (
                                                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {form.usage.herds.length} herd{form.usage.herds.length !== 1 ? "s" : ""}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        <DonationFormEditDialog form={form}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </DonationFormEditDialog>
                                        <DonationFormDeleteDialog
                                            formId={form._id}
                                            formName={form.name}
                                            usage={form.usage}
                                        >
                                            <Button variant="outline" size="icon">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </DonationFormDeleteDialog>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Load More Button */}
                {status === "CanLoadMore" && (
                    <div className="flex justify-center mt-4">
                        <Button variant="outline" onClick={() => loadMore(25)}>
                            Load More
                        </Button>
                    </div>
                )}

                {/* Loading more indicator */}
                {status === "LoadingMore" && (
                    <div className="flex justify-center mt-4">
                        <ImSpinner8 className="animate-spin h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDonationFormsPage
