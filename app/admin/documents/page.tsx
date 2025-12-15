"use client"

import { useState } from "react"
import { useMutation, usePaginatedQuery } from "convex/react"
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
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Grid3X3,
    List,
    FileText,
    ExternalLink,
    Eye,
    EyeOff,
    Calendar,
    Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { handleConvexError } from "@/lib/errorHandler"
import DocumentCreateDialog from "./DocumentCreateDialog"
import DocumentEditDialog from "./DocumentEditDialog"
import { documentTypeLabels, DocumentType } from "@/convex/documents"

const AdminDocumentsPage = () => {
    const router = useRouter()
    const [deletingDocument, setDeletingDocument] = useState<Id<"documents"> | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"documents"> | null>(null)
    const [togglingPublic, setTogglingPublic] = useState<Id<"documents"> | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState<DocumentType | "all">("all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("list")

    const { results: documents, loadMore: loadMoreDocuments, status: documentsStatus } = usePaginatedQuery(
        api.documents.searchDocuments,
        {
            query: searchTerm,
            type: filterType === "all" ? undefined : filterType as DocumentType,
        },
        { initialNumItems: 100 }
    );
    const deleteDocument = useMutation(api.documents.deleteDocument)
    const togglePublic = useMutation(api.documents.toggleDocumentPublic)

    const handleDeleteDocument = async (documentId: Id<"documents">) => {
        setDeletingDocument(documentId)
        try {
            await deleteDocument({ id: documentId })
            setConfirmDeleteId(null)
        } catch (error: any) {
            console.error("Error deleting document:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "delete document", router)
            } else {
                alert(`Failed to delete document: ${error?.message || "Unknown error"}`)
            }
        } finally {
            setDeletingDocument(null)
        }
    }

    const handleTogglePublic = async (documentId: Id<"documents">) => {
        setTogglingPublic(documentId)
        try {
            await togglePublic({ id: documentId })
        } catch (error: any) {
            console.error("Error toggling document visibility:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "update document", router)
            } else {
                alert(`Failed to update document: ${error?.message || "Unknown error"}`)
            }
        } finally {
            setTogglingPublic(null)
        }
    }

    if (documents === undefined) {
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
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={filterType} onValueChange={(value: DocumentType | "all") => setFilterType(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {Object.entries(documentTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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

                    <DocumentCreateDialog>
                        <Button >
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Document
                        </Button>
                    </DocumentCreateDialog>
                </div>
            </div>

            {/* Documents Content */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {documents.map((doc) => (
                        <Card key={doc._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                                <FileText className="h-16 w-16 text-gray-400" />
                                {!doc.isPublic && (
                                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                        <EyeOff className="h-3 w-3" />
                                        Private
                                    </div>
                                )}
                            </div>

                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg mb-1 truncate">{doc.name}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                {documentTypeLabels[doc.type]}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {doc.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Public</span>
                                        {togglingPublic === doc._id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Switch
                                                checked={doc.isPublic}
                                                onCheckedChange={() => handleTogglePublic(doc._id)}
                                                disabled={togglingPublic !== null}
                                            />
                                        )}
                                    </div>
                                    <div className="flex space-x-1">
                                        {doc.fileUrl && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <DocumentEditDialog documentId={doc._id}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </DocumentEditDialog>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setConfirmDeleteId(doc._id)}
                                            disabled={deletingDocument === doc._id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {viewMode === "list" && (
                (
                    <div className="bg-white rounded-lg border">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-gray-50">
                                    <tr className="text-sm">
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Document</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Year</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Public</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {documents.map((doc) => (
                                        <tr key={doc._id} className="hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FileText className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium text-gray-900 truncate max-w-xs">
                                                            {doc.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                    {documentTypeLabels[doc.type as DocumentType]}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-gray-700">{doc.year}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    {togglingPublic === doc._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Switch
                                                            checked={doc.isPublic}
                                                            onCheckedChange={() => handleTogglePublic(doc._id)}
                                                            disabled={togglingPublic !== null}
                                                        />
                                                    )}
                                                    {doc.isPublic ? (
                                                        <Eye className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-end space-x-2">
                                                    {doc.fileUrl && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                                View
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <DocumentEditDialog documentId={doc._id}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </Button>
                                                    </DocumentEditDialog>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setConfirmDeleteId(doc._id)}
                                                        disabled={deletingDocument === doc._id}
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
                )
            )}

            {(documents || []).length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm || filterType !== "all"
                            ? "No documents match your search criteria"
                            : "Get started by uploading your first document."
                        }
                    </p>
                    {!searchTerm && filterType === "all" && (
                        <DocumentCreateDialog>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Upload Document
                            </Button>
                        </DocumentCreateDialog>
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the document and its associated file.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteId && handleDeleteDocument(confirmDeleteId)}
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

export default AdminDocumentsPage

