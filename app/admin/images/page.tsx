"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Search,
    Download,
    Copy,
    Image as ImageIcon,
    Filter,
    Grid3X3,
    List
} from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import Image from "next/image";
import ConvexImage from "@/components/ConvexImage";

const AdminImagesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<Id<"images"> | null>(null);
    const [selectedImages, setSelectedImages] = useState<Id<"images">[]>([]);

    const images = useQuery(api.images.listImages, {
        limit: 100,
        publicOnly: false
    });

    const searchResults = useQuery(
        api.images.searchImages,
        searchTerm
            ? {
                searchTerm,
                limit: 50,
                publicOnly: false,
            }
            : "skip"
    );

    const updateImage = useMutation(api.images.updateImage);
    const deleteImage = useMutation(api.images.deleteImage);

    const [editFormData, setEditFormData] = useState({
        altText: "",
        description: "",
        tags: "",
        isPublic: true,
    });

    const displayImages = searchTerm && searchResults ? searchResults : images || [];

    const handleEditImage = (image: any) => {
        setEditingImage(image._id);
        setEditFormData({
            altText: image.altText || "",
            description: image.description || "",
            tags: (image.tags || []).join(", "),
            isPublic: image.isPublic,
        });
    };

    const handleUpdateImage = async () => {
        if (!editingImage) return;

        try {
            await updateImage({
                id: editingImage,
                altText: editFormData.altText,
                description: editFormData.description,
                tags: editFormData.tags
                    ? editFormData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
                    : [],
                isPublic: editFormData.isPublic,
            });

            setEditingImage(null);
            resetEditForm();
        } catch (error) {
            console.error("Error updating image:", error);
            alert("Failed to update image");
        }
    };

    const handleDeleteImage = async (imageId: Id<"images">) => {
        if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
            try {
                await deleteImage({ id: imageId });
            } catch (error) {
                console.error("Error deleting image:", error);
                alert("Failed to delete image");
            }
        }
    };

    const resetEditForm = () => {
        setEditFormData({
            altText: "",
            description: "",
            tags: "",
            isPublic: true,
        });
    };

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

    if (images === undefined) {
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

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Images
                            </CardTitle>
                            <ImageIcon className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{displayImages.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Public Images
                            </CardTitle>
                            <Eye className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {displayImages.filter(img => img.isPublic).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Private Images
                            </CardTitle>
                            <EyeOff className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {displayImages.filter(img => !img.isPublic).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Size
                            </CardTitle>
                            <Filter className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatFileSize(displayImages.reduce((acc, img) => acc + img.size, 0))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Images Grid/List */}
                {viewMode === "grid" ? (
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
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleEditImage(image)}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            {image.url && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => copyImageUrl(image.url!)}
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleDeleteImage(image._id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Privacy Badge */}
                                    <div className="absolute top-2 left-2">
                                        <Badge variant={image.isPublic ? "default" : "secondary"}>
                                            {image.isPublic ? (
                                                <>
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Public
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3 w-3 mr-1" />
                                                    Private
                                                </>
                                            )}
                                        </Badge>
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
                                        <p>{formatDate(image.uploadedAt)}</p>
                                        {image.uploader && (
                                            <p>by {image.uploader.name}</p>
                                        )}
                                    </div>
                                    {image.tags && image.tags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {image.tags.slice(0, 2).map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {image.tags.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{image.tags.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
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
                                                Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Size
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
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
                                                    <div>
                                                        {image.width && image.height && (
                                                            <p>{image.width} × {image.height}</p>
                                                        )}
                                                        <p>{formatDate(image.uploadedAt)}</p>
                                                        {image.uploader && <p>by {image.uploader.name}</p>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatFileSize(image.size)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge variant={image.isPublic ? "default" : "secondary"}>
                                                        {image.isPublic ? (
                                                            <>
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                Public
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="h-3 w-3 mr-1" />
                                                                Private
                                                            </>
                                                        )}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditImage(image)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        {image.url && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => copyImageUrl(image.url!)}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteImage(image._id)}
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
                        </CardContent>
                    </Card>
                )}

                {displayImages.length === 0 && (
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
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Image</DialogTitle>
                        <DialogDescription>
                            Update image metadata and settings
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="altText">Alt Text</Label>
                            <Input
                                id="altText"
                                value={editFormData.altText}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, altText: e.target.value }))}
                                placeholder="Describe the image for accessibility"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Optional description"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={editFormData.tags}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, tags: e.target.value }))}
                                placeholder="horse, wildlife, nature (comma-separated)"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={editFormData.isPublic}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                                className="rounded"
                            />
                            <Label htmlFor="isPublic" className="flex items-center space-x-1">
                                {editFormData.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                <span>Public image</span>
                            </Label>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setEditingImage(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateImage}>
                                Update Image
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminImagesPage;