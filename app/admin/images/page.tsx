"use client";

import { useState, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/images/ImageUpload";
import {
    Plus,
    Search,
    Copy,
    Image as ImageIcon,
    Grid3X3,
    List,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import ConvexImage from "@/components/images/ConvexImage";
import ImageDeleteDialog from "@/components/images/ImageDeleteDialog";
import ImageMetadataEditDialog from "@/components/images/ImageMetadataEditDialog";

const AdminImagesPage = () => {
    useEffect(() => {
        document.title = "Media Library - RTF Admin"
    }, [])

    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const { results: images, loadMore: loadMoreImages, status: imagesStatus } = usePaginatedQuery(
        api.images.listImages,
        {},
        { initialNumItems: 50 }
    );

    const { results: searchResults, loadMore: loadMoreSearchResults, status: searchResultsStatus } = usePaginatedQuery(
        api.images.searchImagesByTitle,
        { query: searchTerm },
        { initialNumItems: 50 }
    );

    const displaySearchResults = searchTerm !== ""
    const displayImages = ((displaySearchResults
        ? searchResults
        : images
    ) || []).filter((image) => !!image && image !== null)
    const loadMore = displaySearchResults ? loadMoreSearchResults : loadMoreImages;
    const status = displaySearchResults ? searchResultsStatus : imagesStatus;


    const copyImageUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        // You might want to show a toast notification here
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (imagesStatus === "LoadingFirstPage") {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search images..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Upload Images
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Upload Images</DialogTitle>
                                        <DialogDescription>
                                            Upload new images to your media library
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ImageUpload
                                        onImageUploaded={() => {
                                            // Optionally close dialog after upload
                                            // setIsUploadDialogOpen(false);
                                        }}
                                        multiple={true}
                                        maxSizeInMB={10}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Images Grid/List */}
                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayImages.map((image) => (
                            <Card key={image._id} className="group hover:shadow-lg transition-shadow">
                                <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">

                                    {image.url ? (
                                        <ConvexImage
                                            src={image.url}
                                            width={image.width || 100}
                                            height={image.height || 100}
                                            alt={image.altText || image.originalName}
                                            objectFit="cover"
                                            className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex space-x-1">
                                            <ImageMetadataEditDialog imageId={image._id} />
                                            {image.url && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => copyImageUrl(image.url!)}
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            )}
                                            <ImageDeleteDialog imageId={image._id} />
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <h3 className="font-medium text-sm truncate mb-1">
                                        {image.originalName}
                                    </h3>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p>{formatFileSize(image.size)}</p>
                                        {image.width && image.height && (
                                            <p>{image.width} × {image.height}</p>
                                        )}
                                        <p>{formatDate(image._creationTime)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {viewMode === "list" && (
                    (
                        <Card>
                            <CardHeader>
                                <CardTitle>Images List</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Image
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Size
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {displayImages.map((image) => (
                                                <tr key={image._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                                {image.url ? (
                                                                    <img
                                                                        src={image.url}
                                                                        alt={image.altText || image.originalName}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center">
                                                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                                    {image.originalName}
                                                                </p>
                                                                <p className="text-sm text-gray-500">{image.fileName}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {image.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {image.altText}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {image.width && image.height && (
                                                            <p>{image.width} × {image.height}</p>
                                                        )}
                                                        {formatFileSize(image.size)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>
                                                            <p>{formatDate(image._creationTime)}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <ImageMetadataEditDialog imageId={image._id} />
                                                            <ImageDeleteDialog imageId={image._id} />
                                                            {image.url && (
                                                                <Link href={image.url} target="_blank">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                    >
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )
                )}

                {(displayImages.length === 0 && status === "Exhausted") && (
                    <div className="text-center py-12">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm
                                ? "No images match your search criteria"
                                : "Get started by uploading your first image"}
                        </p>
                        {!searchTerm && (
                            <Button onClick={() => setIsUploadDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Upload Images
                            </Button>
                        )}
                    </div>
                )}

                {status === "CanLoadMore" && (
                    <Button onClick={() => loadMore(20)}>
                        Load More
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AdminImagesPage;