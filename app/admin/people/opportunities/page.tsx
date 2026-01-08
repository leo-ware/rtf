"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Search } from "lucide-react"
import JobListingCreateDialog from "./JobListingCreateDialog"
import JobListingEditDialog from "./JobListingEditDialog"
import JobListingDeleteDialog from "./JobListingDeleteDialog"
import ReorderableList from "@/components/ReorderableList"
import { Doc, Id } from "@/convex/_generated/dataModel"

const formatDateTime = (ms: number) => {
    return new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(ms))
}

const JobListingsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const reorderDisabled = searchTerm.trim() !== ""

    const currentUser = useQuery(api.users.current)
    const hasAdminAccess = currentUser?.atLeastAdmin ?? false

    const jobListings = useQuery(api.jobListing.listJobListings, { limit: 200, includeExpired: true })
    const reorderJobListings = useMutation(api.jobListing.reorderJobListings)

    const handleReorder = async (newOrder: Id<"jobListings">[]) => {
        await reorderJobListings({ jobListings: newOrder })
    }

    const filteredJobListings = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase()
        return (jobListings || [])
            .filter((listing) => {
                if (!normalizedSearchTerm) return true
                return (
                    listing.name.toLowerCase().includes(normalizedSearchTerm) ||
                    listing.description.toLowerCase().includes(normalizedSearchTerm)
                )
            })
    }, [jobListings, searchTerm])

    if (jobListings === undefined) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!hasAdminAccess && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4 text-sm">
                    You are signed in, but you do not have admin permissions to create, edit, or delete job listings.
                </div>
            )}

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
                    {hasAdminAccess && <JobListingCreateDialog />}
                </div>
            </div>

            <div className="text-lg font-medium mb-4">
                {!!searchTerm.trim()
                    ? `Search Results for "${searchTerm}"`
                    : "All Job Listings"}
            </div>

            <Accordion type="single" collapsible className="w-full">
                <ReorderableList
                    onReorder={handleReorder}
                    disabled={reorderDisabled}
                    items={(filteredJobListings as Array<Doc<"jobListings">>)
                        .sort((a, b) => a.order - b.order)
                        .map((listing) => ({
                            id: listing._id,
                            widget: (
                                <AccordionItem key={listing._id} value={listing._id} className="w-full">
                                    <div className="w-full grid grid-cols-[1fr_auto] gap-x-4 my-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-medium">{listing.name}</span>
                                            <Badge variant="secondary">
                                                Apply by {formatDateTime(listing.applicationDeadline)}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {hasAdminAccess && (
                                                <>
                                                    <JobListingEditDialog jobListing={listing} />
                                                    <JobListingDeleteDialog jobListingId={listing._id} />
                                                </>
                                            )}
                                            <AccordionTrigger className="hover:no-underline p-0 [&>svg]:h-4 [&>svg]:w-4" />
                                        </div>
                                    </div>

                                    <AccordionContent>
                                        <div className="mt-4 space-y-3">
                                            <div className="text-sm text-gray-600 whitespace-pre-wrap">
                                                {listing.description}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Application form:{" "}
                                                <a
                                                    className="underline"
                                                    href={listing.applicationFormLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {listing.applicationFormLink}
                                                </a>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        }))}
                />
            </Accordion>

            {filteredJobListings.length === 0 && (
                <div className="text-center py-12 w-full">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No job listings found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No job listings match "${searchTerm}"`
                            : "Get started by creating your first job listing."}
                    </p>
                </div>
            )}
        </div>
    )
}

export default JobListingsTab


