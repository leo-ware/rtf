"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Grid3X3,
    List,
    Image as ImageIcon,
    Building2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { handleConvexError } from "@/lib/errorHandler"
import ConvexImage from "@/components/images/ConvexImage"
import SponsorCreateDialog from "./SponsorCreateDialog"
import SponsorEditDialog from "./SponsorEditDialog"

const AdminSponsorsPage = () => {
    useEffect(() => {
        document.title = "Sponsors - RTF Admin"
    }, [])

    const router = useRouter()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingSponsorId, setEditingSponsorId] = useState<Id<"sponsors"> | null>(null)
    const [deletingSponsor, setDeletingSponsor] = useState<Id<"sponsors"> | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"sponsors"> | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("list")

    const sponsors = useQuery(api.sponsors.getSponsors)
    const deleteSponsor = useMutation(api.sponsors.deleteSponsor)

    const filteredSponsors = sponsors?.filter(sponsor =>
        searchTerm === "" ||
        sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    const handleDeleteSponsor = async (sponsorId: Id<"sponsors">) => {
        setDeletingSponsor(sponsorId)
        try {
            await deleteSponsor({ id: sponsorId })
            setConfirmDeleteId(null)
        } catch (error: any) {
            console.error("Error deleting sponsor:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "delete sponsor", router)
            } else {
                alert(`Failed to delete sponsor: ${error?.message || "Unknown error"}`)
            }
        } finally {
            setDeletingSponsor(null)
        }
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (sponsors === undefined) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search sponsors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sponsor
                    </Button>
                </div>
            </div>

            {/* Sponsors Content */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSponsors.map((sponsor) => (
                        <Card key={sponsor._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative bg-gray-100">
                                {sponsor.image?.url ? (
                                    <ConvexImage
                                        src={sponsor.image.url}
                                        alt={sponsor.name}
                                        width={sponsor.image.width || 400}
                                        height={sponsor.image.height || 300}
                                        className="object-contain w-full h-full p-4"
                                        objectFit="contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Building2 className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-1">{sponsor.name}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        {formatDate(sponsor._creationTime)}
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingSponsorId(sponsor._id)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setConfirmDeleteId(sponsor._id)}
                                            disabled={deletingSponsor === sponsor._id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Sponsor</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSponsors.map((sponsor) => (
                                    <tr key={sponsor._id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                                                    {sponsor.image?.url ? (
                                                        <ConvexImage
                                                            src={sponsor.image.url}
                                                            alt={sponsor.name}
                                                            width={64}
                                                            height={64}
                                                            className="object-contain w-full h-full p-1"
                                                            objectFit="contain"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                            <Building2 className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-gray-900">
                                                        {sponsor.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(sponsor._creationTime)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditingSponsorId(sponsor._id)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setConfirmDeleteId(sponsor._id)}
                                                    disabled={deletingSponsor === sponsor._id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredSponsors.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sponsors found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No sponsors match "${searchTerm}"`
                            : "Get started by adding your first sponsor."
                        }
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sponsor
                        </Button>
                    )}
                </div>
            )}

            {/* Create Dialog */}
            <SponsorCreateDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            />

            {/* Edit Dialog */}
            <SponsorEditDialog
                sponsorId={editingSponsorId}
                isOpen={!!editingSponsorId}
                onClose={() => setEditingSponsorId(null)}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the sponsor.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteId && handleDeleteSponsor(confirmDeleteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AdminSponsorsPage

