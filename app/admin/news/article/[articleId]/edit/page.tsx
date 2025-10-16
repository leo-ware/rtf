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
import {
    Save,
    Eye,
    EyeOff,
    ArrowLeft,
    ExternalLink,
    Calendar,
    User,
    Settings
} from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { ImagePicker } from "@/components/ImagePicker";

type ArticleEditPageProps = {
    params: Promise<{
        articleId: string;
    }>;
}

type ArticleType = {
    author: {
        id: Id<"users">;
        email: string | undefined;
        name: string | undefined;
    } | null;
    _id: Id<"articles">;
    _creationTime: number;
    content: string;
    title: string;
    slug: string;
    excerpt: string;
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
        url: string | null;
    } | null;
    authorCredit?: string;
    published: boolean;
    publishedAt?: number;
    createdAt: number;
    updatedAt: number;
}

const ArticleEditPage = ({ params }: ArticleEditPageProps) => {
    const resolvedParams = React.use(params);
    const article: ArticleType | null | undefined = useQuery(api.articles.getArticle, {
        id: resolvedParams.articleId as any,
    });
    return (
        article ? (
            <ArticleEditPageInner article={article} />
        ) : (
            <div>Loading...</div>
        )
    )
}

const ArticleEditPageInner = ({ article }: { article: ArticleType }) => {
    
    const updateArticle = useMutation(api.articles.updateArticle);

    const [formData, setFormData] = useState({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        imageId: article.imageId || ("" as Id<"images"> | ""),
        authorCredit: article.authorCredit || "",
        published: article.published,
        publishedAt: article.publishedAt || "",
    });
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [content, setContent] = useState(article.content);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // useEffect(() => {
    //     if (article) {
    //         setFormData({
    //             title: article.title,
    //             slug: article.slug,
    //             excerpt: article.excerpt,
    //             imageUrl: article.imageUrl || "",
    //             published: article.published,
    //         });
    //         setContent(article.content);
    //     }
    // }, [article]);

    // Track changes
    useEffect(() => {
        if (article) {
            const hasChanges =
                formData.title !== article.title ||
                formData.slug !== article.slug ||
                formData.excerpt !== article.excerpt ||
                formData.imageId !== (article.imageId || "") ||
                formData.authorCredit !== (article.authorCredit || "") ||
                formData.published !== article.published ||
                formData.publishedAt !== (article.publishedAt || "") ||
                content !== article.content;
            setHasUnsavedChanges(hasChanges);
        }
    }, [formData, content, article]);

    const handleSave = async (publishNow = false) => {
        if (!article) return;

        setIsSaving(true);
        try {
            const publishedAtValue = formData.publishedAt ? 
                (typeof formData.publishedAt === 'string' ? 
                    new Date(formData.publishedAt).getTime() : 
                    formData.publishedAt) : 
                undefined;

            await updateArticle({
                id: article._id,
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                imageId: formData.imageId || undefined,
                authorCredit: formData.authorCredit || undefined,
                content,
                published: publishNow ? true : formData.published,
                publishedAt: publishedAtValue,
            });

            if (publishNow) {
                setFormData(prev => ({ ...prev, published: true }));
            }

            setLastSaved(new Date());
            setHasUnsavedChanges(false);

            if (formData.slug !== article.slug) {
                // code here
            }
        } catch (error) {
            console.error("Error saving article:", error);
            alert("Failed to save article. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishToggle = async () => {
        const newPublishedState = !formData.published;
        setFormData(prev => ({ ...prev, published: newPublishedState }));
        await updateArticle({
            id: article._id,
            published: newPublishedState,
        })
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

    const handleImageSelect = (imageData: { imageId: string; imageUrl: string }) => {
        setFormData(prev => ({ ...prev, imageId: imageData.imageId as Id<"images"> }));
    };

    if (article === undefined) {
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

    if (article === null) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/news">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to News
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Edit Article</h1>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    {lastSaved && (
                                        <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                                    )}
                                    {hasUnsavedChanges && (
                                        <Badge variant="secondary">Unsaved changes</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {article.published && (
                                <Link href={`/news/article/${article.slug}`} target="_blank">
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Live
                                    </Button>
                                </Link>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePublishToggle}
                                disabled={isSaving}
                            >
                                {formData.published ? (
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

                            <Button
                                onClick={() => handleSave()}
                                disabled={isSaving || !hasUnsavedChanges}
                                size="sm"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Article Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Content</CardTitle>
                                <CardDescription>
                                    Write your article content using the rich text editor
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TiptapEditor
                                    content={content}
                                    onChange={setContent}
                                    placeholder="Start writing your article..."
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Article Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Article Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                title: e.target.value,
                                                slug: generateSlug(e.target.value)
                                            }));
                                        }}
                                        placeholder="Article title"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="article-url-slug"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Used in the article URL: /news/article/{formData.slug}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        placeholder="Brief description of the article"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="authorCredit">Author Credit</Label>
                                    <Input
                                        id="authorCredit"
                                        value={formData.authorCredit}
                                        onChange={(e) => setFormData(prev => ({ ...prev, authorCredit: e.target.value }))}
                                        placeholder="Author name for display"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        The name that will be displayed as the author. Defaults to the user who created the article.
                                    </p>
                                </div>

                                <div>
                                    <Label>Featured Image</Label>
                                    <div className="space-y-2">
                                        {article.image && (
                                            <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={article.image.url || ""}
                                                    alt={article.image.altText || article.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsImagePickerOpen(true)}
                                                className="flex-1"
                                            >
                                                {formData.imageId ? "Change Image" : "Select Image"}
                                            </Button>
                                            {formData.imageId && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setFormData(prev => ({ ...prev, imageId: "" }))}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center space-x-2">
                                        {formData.published ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                <Eye className="h-3 w-3 mr-1" />
                                                Published
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <EyeOff className="h-3 w-3 mr-1" />
                                                Draft
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {formData.published && (
                                    <div>
                                        <Label htmlFor="publishedAt">Published Date</Label>
                                        <Input
                                            id="publishedAt"
                                            type="datetime-local"
                                            value={formData.publishedAt ? 
                                                new Date(formData.publishedAt).toISOString().slice(0, 16) : 
                                                ""
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value ? new Date(e.target.value).getTime() : "";
                                                setFormData(prev => ({ ...prev, publishedAt: value }));
                                            }}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Set a custom publish date for backdating articles.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Article Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {article.author && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span>Created by: {article.author.name}</span>
                                    </div>
                                )}

                                {article.authorCredit && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span>Author Credit: {article.authorCredit}</span>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Created: {formatDate(article.createdAt)}</span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Last Updated: {formatDate(article.updatedAt)}</span>
                                </div>

                                {article.publishedAt && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>Published: {formatDate(article.publishedAt)}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className="text-sm text-gray-600">
                                    <p>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</p>
                                    <p>Characters: {content.replace(/<[^>]*>/g, '').length}</p>
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
                description="Choose an image for your article from your library or upload a new one"
            />
        </div>
    );
}

export default ArticleEditPage;