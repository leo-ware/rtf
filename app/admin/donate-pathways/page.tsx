"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Link, FileText, Gift } from "lucide-react"
import { ImSpinner8 } from "react-icons/im"
import ReorderableList from "@/components/ReorderableList"
import DonatePathwayCreateDialog from "./DonatePathwayCreateDialog"
import DonatePathwayEditDialog from "./DonatePathwayEditDialog"
import DonatePathwayDeleteDialog from "./DonatePathwayDeleteDialog"
import { Id } from "@/convex/_generated/dataModel"
import Image from "next/image"

const AdminDonatePathwaysPage = () => {
    const pathways = useQuery(api.donatePathways.listDonatePathways)
    const reorderPathways = useMutation(api.donatePathways.reorderDonatePathways)

    const handleReorder = (newOrder: string[]) => {
        reorderPathways({ orderedIds: newOrder as Id<"donatePathways">[] })
    }

    if (pathways === undefined) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center p-8 min-h-[200px]">
                        <div className="flex flex-col items-center gap-2">
                            <ImSpinner8 className="animate-spin h-6 w-6 text-gray-400" />
                            <span className="text-gray-500 text-sm mt-1">Loading donate pathways...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const reorderableItems = pathways.map((pathway) => ({
        id: pathway._id,
        widget: (
            <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-4">
                    {/* Image thumbnail */}
                    <div className="relative h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {pathway.image?.url ? (
                            <Image
                                src={pathway.image.url}
                                alt={pathway.image.altText || pathway.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Gift className="h-6 w-6 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Name and type badge */}
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">{pathway.name}</span>
                        <div className="flex items-center gap-2">
                            {pathway.link ? (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Link className="h-3 w-3" />
                                    {pathway.link.startsWith("http") ? "External Link" : "Internal Link"}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    Donation Form
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    <DonatePathwayEditDialog pathway={pathway}>
                        <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </DonatePathwayEditDialog>
                    <DonatePathwayDeleteDialog
                        pathwayId={pathway._id}
                        pathwayName={pathway.name}
                    >
                        <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </DonatePathwayDeleteDialog>
                </div>
            </div>
        ),
    }))

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                    <div className="text-sm text-gray-600">
                        Drag and drop to reorder. Changes are saved automatically.
                    </div>
                    <DonatePathwayCreateDialog />
                </div>

                {/* Pathways List */}
                {pathways.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                        <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No donate pathways yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Get started by creating your first donate pathway.
                        </p>
                        <DonatePathwayCreateDialog />
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <ReorderableList
                            items={reorderableItems}
                            onReorder={handleReorder}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDonatePathwaysPage
