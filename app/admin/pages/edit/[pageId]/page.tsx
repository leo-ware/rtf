"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { TiptapEditor } from "@/components/TiptapEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePicker } from "@/components/ImagePicker";
import {
    Save,
    Eye,
    EyeOff,
    ArrowLeft,
    Calendar,
    User,
    Settings,
    Folder,
    Globe,
    ExternalLink,
    Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

type PageEditPageProps = {
    params: Promise<{
        pageId: string;
    }>;
}

type PageType = {
    lastEditor: {
        id: Id<"users">;
        email: string | undefined;
        name: string | undefined;
    } | null;
    _id: Id<"pages">;
    _creationTime: number;
    content: string;
    title: string;
    slug: string;
    excerpt?: string;
    category: "about" | "what-we-do" | "learn" | "take-action";
    imageId?: Id<"images">;
    image?: {
        _id: Id<"images">;
        fileName: string;
        originalName: string;
        mimeType: string;
        size: number;
        storageId: Id<"_storage">;
        altText?: string;
        description?: string;
        isPublic: boolean;
        width?: number;
        height?: number;
        url: string;
    };
    isPublished: boolean;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: number;
    updatedAt: number;
}

const PageEditPage = ({ params }: PageEditPageProps) => {
    const resolvedParams = React.use(params);
    const page: PageType | null | undefined = useQuery(api.pages.getPage, {
        id: resolvedParams.pageId as any,
    });

    return (
        page ? (
            <PageEditPageInner page={page} />
        ) : (
            <div>Loading...</div>
        )
    )
}

const PageEditPageInner = ({ page }: { page: PageType }) => {
    const updatePage = useMutation(api.pages.updatePage);

    const [formData, setFormData] = useState({
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt || "",
        category: page.category,
        imageId: page.imageId || ("" as Id<"images"> | ""),
        isPublished: page.isPublished,
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
    });
    const [content, setContent] = useState(page.content);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(page.image?.url);

    // Track changes
    useEffect(() => {
        if (page) {
            const hasChanges =
                formData.title !== page.title ||
                formData.slug !== page.slug ||
                formData.excerpt !== (page.excerpt || "") ||
                formData.category !== page.category ||
                formData.imageId !== (page.imageId || "") ||
                formData.isPublished !== page.isPublished ||
                formData.metaTitle !== (page.metaTitle || "") ||
                formData.metaDescription !== (page.metaDescription || "") ||
                content !== page.content;
            setHasUnsavedChanges(hasChanges);
        }
    }, [formData, content, page]);

    const handleSave = async (publishNow = false) => {
        if (!page) return;

        setIsSaving(true);
        try {
            await updatePage({
                id: page._id,
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt || undefined,
                category: formData.category,
                imageId: formData.imageId ? (formData.imageId as Id<"images">) : undefined,
                content,
                isPublished: publishNow ? true : formData.isPublished,
                metaTitle: formData.metaTitle || undefined,
                metaDescription: formData.metaDescription || undefined,
            });

            if (publishNow) {
                setFormData(prev => ({ ...prev, isPublished: true }));
            }

            setLastSaved(new Date());
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error saving page:", error);
            alert("Failed to save page. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishToggle = async () => {
        const newPublishedState = !formData.isPublished;
        setFormData(prev => ({ ...prev, isPublished: newPublishedState }));
        await updatePage({
            id: page._id,
            isPublished: newPublishedState,
        })
    };

    const handleImageSelect = (imageData: { imageId: string; imageUrl: string }) => {
        setFormData({ ...formData, imageId: imageData.imageId as Id<"images"> });
        setSelectedImageUrl(imageData.imageUrl);
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, imageId: "" as Id<"images"> | "" });
        setSelectedImageUrl(undefined);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const getCategoryLabel = (category: string) => {
        const labels = {
            "about": "About",
            "what-we-do": "What We Do",
            "learn": "Learn",
            "take-action": "Take Action"
        };
        return labels[category as keyof typeof labels] || category;
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            "about": "bg-blue-100 text-blue-800",
            "what-we-do": "bg-green-100 text-green-800",
            "learn": "bg-purple-100 text-purple-800",
            "take-action": "bg-red-100 text-red-800"
        };
        return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    if (page === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="h-96 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (page === null) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/pages">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Pages
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Edit Page</h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge className={getCategoryColor(page.category)}>
                                        <Folder className="h-3 w-3 mr-1" />
                                        {getCategoryLabel(page.category)}
                                    </Badge>
                                    {page.isPublished ? (
                                        <Badge className="bg-green-100 text-green-800">
                                            <Globe className="h-3 w-3 mr-1" />
                                            Published
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                            <EyeOff className="h-3 w-3 mr-1" />
                                            Draft
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {lastSaved && (
                                <span className="text-sm text-gray-500">
                                    Last saved: {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                            <Button
                                onClick={() => handleSave()}
                                disabled={isSaving || !hasUnsavedChanges}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                            {hasUnsavedChanges && (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    Unsaved changes
                                </Badge>
                            )}
                            {!page.isPublished
                                ? (
                                    <Button onClick={() => handleSave(true)} disabled={isSaving} variant="outline">
                                        <Globe className="h-4 w-4 mr-2" />
                                        Publish
                                    </Button>
                                ) : (
                                    <Link href={`/${page.category}/${page.slug}`} target="_blank">
                                        <Button variant="outline">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Live
                                        </Button>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title and Slug */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Content</CardTitle>
                                <CardDescription>
                                    Edit the main content of your page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => {
                                            const newTitle = e.target.value;
                                            setFormData({
                                                ...formData,
                                                title: newTitle,
                                                slug: generateSlug(newTitle)
                                            });
                                        }}
                                        placeholder="Page title"
                                        className="text-lg"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="page-url-slug"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        The URL path for this page
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="Brief description of the page"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rich Text Editor */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Content</CardTitle>
                                <CardDescription>
                                    Use the rich text editor to create your page content
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TiptapEditor
                                    content={content}
                                    onChange={setContent}
                                    placeholder="Start writing your page content..."
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Page Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Page Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="about">About</SelectItem>
                                            <SelectItem value="what-we-do">What We Do</SelectItem>
                                            <SelectItem value="learn">Learn</SelectItem>
                                            <SelectItem value="take-action">Take Action</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Featured Image</Label>
                                    <div className="space-y-2">
                                        {selectedImageUrl ? (
                                            <div className="relative">
                                                <img
                                                    src={selectedImageUrl}
                                                    alt="Selected image"
                                                    className="w-full h-32 object-cover rounded-md"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsImagePickerOpen(true)}
                                                className="w-full h-32 border-dashed"
                                            >
                                                <ImageIcon className="h-8 w-8 mr-2" />
                                                Select Image
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Publishing Status</Label>
                                        <p className="text-sm text-gray-500">
                                            {page.isPublished ? "This page is live" : "This page is not published"}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handlePublishToggle}
                                        variant={page.isPublished ? "outline" : "default"}
                                        size="sm"
                                    >
                                        {page.isPublished ? (
                                            <>
                                                <EyeOff className="h-4 w-4 mr-2" />
                                                Unpublish
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Publish
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                                <CardDescription>
                                    Optimize for search engines
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="metaTitle">Meta Title</Label>
                                    <Input
                                        id="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        placeholder="SEO title (optional)"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.metaTitle.length}/60 characters
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        placeholder="SEO description (optional)"
                                        rows={3}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.metaDescription.length}/160 characters
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Page Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">Last edited by:</span>
                                    <span className="font-medium">
                                        {page.lastEditor?.name || page.lastEditor?.email || "Unknown"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">Updated:</span>
                                    <span className="font-medium">{formatDate(page.updatedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">Created:</span>
                                    <span className="font-medium">{formatDate(page.createdAt)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Image Picker */}
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={handleImageSelect}
                title="Select Featured Image"
                description="Choose an image from your library or upload a new one"
            />
        </div>
    );
};

export default PageEditPage;