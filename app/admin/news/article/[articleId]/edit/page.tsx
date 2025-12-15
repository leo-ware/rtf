"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"
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
    Settings,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { TagSelector } from "@/components/TagSelector";
import { TopicSelector } from "@/components/TopicSelector";
import { PageProps } from "@/lib/types";
import { deepEqual, generateSlug, removeUndefined, formatDate } from "@/lib/utils";
import ImagePickerDialog from "@/components/images/ImagePickerDialog";
import InfoWidget from "@/components/InfoWidget";


const ArticleEditPage = ({ params }: PageProps<{ articleId: string }>) => {
    const resolvedParams = React.use(params);
    const article = useQuery(api.articles.getArticleWithRelations, {
        id: resolvedParams.articleId as Id<"articles">,
    });
    const articleStatus = !!article
        ? "loaded"
        : article === null
            ? "not_found"
            : "loading";

    const updateArticle = useMutation(api.articles.updateArticle);
    const updateArticleMetadata = useMutation(api.articleMetadata.updateArticleMetadata)

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // const herds = useQuery(api.articles.searchHerds, { limit: 100 });
    // const animals = useQuery(api.articles.searchAnimals, { limit: 100 });

    const [articleFormData, setArticleFormData] = useState({
        slug: undefined as string | undefined,
        imageId: undefined as Id<"images"> | undefined,
        authorCredit: undefined as string | undefined,
        content: undefined as string | undefined,
    });
    const [articleMetadataFormData, setArticleMetadataFormData] = useState({
        date: undefined as number | undefined,
        public: undefined as boolean | undefined,
        title: undefined as string | undefined,
        excerpt: undefined as string | undefined,
        herdIds: undefined as Id<"herds">[] | undefined,
        animalIds: undefined as Id<"animals">[] | undefined,
        topic_homepage: undefined as boolean | undefined,
        topic_conservation: undefined as boolean | undefined,
        topic_sanctuary: undefined as boolean | undefined,
        topic_advocacy: undefined as boolean | undefined,
        topic_education: undefined as boolean | undefined,
        topic_herd_management: undefined as boolean | undefined,
        topic_population_management: undefined as boolean | undefined,
        topic_roundups: undefined as boolean | undefined,
        topic_horse_slaughter: undefined as boolean | undefined,
        topic_spirit: undefined as boolean | undefined,
    })
    const localInitialized = useRef(false);


    const articleToArticleFormData = (a: typeof article): typeof articleFormData => ({
        slug: a?.slug,
        imageId: a?.imageId,
        authorCredit: a?.authorCredit,
        content: a?.content,
    })
    const articleToArticleMetadataFormData = (a: typeof article): typeof articleMetadataFormData => ({
        date: a?.articleMetadata?.date,
        public: a?.articleMetadata?.public,
        title: a?.articleMetadata?.title,
        excerpt: a?.articleMetadata?.excerpt,
        herdIds: a?.articleMetadata?.herdIds,
        animalIds: a?.articleMetadata?.animalIds,
        topic_homepage: a?.articleMetadata?.topic_homepage,
        topic_conservation: a?.articleMetadata?.topic_conservation,
        topic_sanctuary: a?.articleMetadata?.topic_sanctuary,
        topic_advocacy: a?.articleMetadata?.topic_advocacy,
        topic_education: a?.articleMetadata?.topic_education,
        topic_herd_management: a?.articleMetadata?.topic_herd_management,
        topic_population_management: a?.articleMetadata?.topic_population_management,
        topic_roundups: a?.articleMetadata?.topic_roundups,
        topic_horse_slaughter: a?.articleMetadata?.topic_horse_slaughter,
        topic_spirit: a?.articleMetadata?.topic_spirit,
    })

    // Initialize the form data from the article and article metadata
    useEffect(() => {
        if (article && !localInitialized.current) {
            localInitialized.current = true;
            setArticleFormData(prev => ({
                ...prev,
                ...articleToArticleFormData(article),
            }));
            setArticleMetadataFormData(prev => ({
                ...prev,
                ...articleToArticleMetadataFormData(article),
            }));
            setIsLoading(false);
        }
    })

    console.log("articleFormData", articleFormData)
    console.log("articleInferred", articleToArticleFormData(article))
    console.log("articleMetadataFormData", articleMetadataFormData)
    console.log("articleMetadataInferred", articleToArticleMetadataFormData(article))

    const hasUnsavedChanges = useMemo(() => {
        return !(
            deepEqual(articleFormData, articleToArticleFormData(article)) &&
            deepEqual(articleMetadataFormData, articleToArticleMetadataFormData(article))
        )
    }, [articleFormData, articleMetadataFormData, article])

    const handleError = (error?: string) => {
        setError(error || "Failed to save article. Please try again.");
    }

    const handleSave = async () => {
        if (!article) return;
        if (isSaving) {
            handleError("Already saving article. Please wait for the current save to complete.");
            return
        }

        setIsSaving(true);
        try {
            setError(null);

            await Promise.all([
                updateArticle(removeUndefined({
                    id: article._id,
                    slug: articleFormData.slug,
                    content: articleFormData.content,
                    imageId: articleFormData.imageId,
                    authorCredit: articleFormData.authorCredit,
                })),
                // articleMetadataFormData
                updateArticleMetadata(removeUndefined({
                    id: article.articleMetadata._id,
                    title: articleMetadataFormData.title,
                    imageId: articleFormData.imageId,
                    excerpt: articleMetadataFormData.excerpt,
                    date: articleMetadataFormData.date,
                    public: articleMetadataFormData.public,
                    herdIds: articleMetadataFormData.herdIds,
                    animalIds: articleMetadataFormData.animalIds,
                    topics: ([
                        articleMetadataFormData.topic_homepage ? ("homepage" as const) : undefined,
                        articleMetadataFormData.topic_conservation ? ("conservation" as const) : undefined,
                        articleMetadataFormData.topic_sanctuary ? ("sanctuary" as const) : undefined,
                        articleMetadataFormData.topic_advocacy ? ("advocacy" as const) : undefined,
                        articleMetadataFormData.topic_education ? ("education" as const) : undefined,
                        articleMetadataFormData.topic_herd_management ? ("herd_management" as const) : undefined,
                        articleMetadataFormData.topic_population_management ? ("population_management" as const) : undefined,
                        articleMetadataFormData.topic_roundups ? ("roundups" as const) : undefined,
                        articleMetadataFormData.topic_horse_slaughter ? ("horse_slaughter" as const) : undefined,
                        articleMetadataFormData.topic_spirit ? ("spirit" as const) : undefined,
                    ]).filter(topic => topic !== undefined),
                })),
            ])
        } catch (error) {
            console.error("Error saving article:", error);
            setError("Failed to save article. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (articleStatus === "loading" || !article || !articleFormData || !articleMetadataFormData) {
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

    if (articleStatus === "not_found") {
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
                                    {/* {lastSaved && (
                                        <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                                    )} */}
                                    {hasUnsavedChanges && (
                                        <Badge variant="secondary">Unsaved changes</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {article.articleMetadata.public && (
                                <Link href={`/resources/news/article/${article?.slug}`} target="_blank">
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Live
                                    </Button>
                                </Link>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setArticleMetadataFormData(prev => ({
                                        ...prev,
                                        public: !prev.public,
                                    }));
                                }}
                                disabled={isSaving}
                            >
                                {articleMetadataFormData.public ? (
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
                                {isSaving
                                    ? (<>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>)
                                    : (<>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </>)}
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
                                {articleFormData.content && (
                                    <TiptapEditor
                                        content={articleFormData.content!}
                                        onChange={(content) => setArticleFormData(prev => ({ ...prev, content: content }))}
                                        placeholder="Start writing your article..."
                                    />
                                )}
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
                                        value={articleMetadataFormData.title}
                                        onChange={(e) => {
                                            setArticleMetadataFormData(prev => ({
                                                ...prev,
                                                title: e.target.value,
                                            }));
                                            // setArticleFormData(prev => ({
                                            //     ...prev,
                                            //     slug: generateSlug(e.target.value),
                                            // }));
                                        }}
                                        placeholder="Article title"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">
                                        Slug
                                        <InfoWidget>
                                            The slug is used in the article URL (/news/article/{articleFormData.slug})
                                        </InfoWidget>
                                    </Label>
                                    <Input
                                        id="slug"
                                        value={articleFormData.slug}
                                        onChange={(e) => setArticleFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="article-url-slug"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">
                                        Excerpt
                                        <InfoWidget>
                                            Appears in search results and article listings.
                                        </InfoWidget>
                                    </Label>
                                    <Textarea
                                        id="excerpt"
                                        value={articleMetadataFormData.excerpt}
                                        onChange={(e) => setArticleMetadataFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        placeholder="Brief description of the article"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="authorCredit">
                                        Author Credit
                                        <InfoWidget>
                                            The name that will be displayed as the
                                            author. Leave blank to show nothing.
                                        </InfoWidget>
                                    </Label>
                                    <Input
                                        id="authorCredit"
                                        value={articleFormData.authorCredit}
                                        onChange={(e) => setArticleFormData(prev => ({ ...prev, authorCredit: e.target.value }))}
                                        placeholder="Author name for display"
                                    />
                                </div>

                                <div>
                                    <Label>Featured Image</Label>
                                    <ImagePickerDialog
                                        imageId={articleFormData.imageId || null}
                                        onImageSelect={(imageId) => (
                                            setArticleFormData(prev => ({ ...prev, imageId: imageId || undefined }))
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center space-x-2">
                                        {articleMetadataFormData.public ? (
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
                            </CardContent>
                        </Card>

                        {/* Tags Section */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Tags & Categories</CardTitle>
                                <CardDescription>
                                    Associate this article with herds, animals, and topics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <TagSelector
                                    label="Herds"
                                    description="Select one or more herds related to this article"
                                    selectedIds={formData.herdIds}
                                    availableItems={herds?.map(h => ({ _id: h._id, name: h.name })) || []}
                                    onSelectionChange={(ids) => setFormData(prev => ({
                                        ...prev,
                                        herdIds: ids as Array<Id<"herds">>
                                    }))}
                                    placeholder="Select herds..."
                                    searchPlaceholder="Search herds..."
                                />

                                <TagSelector
                                    label="Animals"
                                    description="Select one or more animals related to this article"
                                    selectedIds={formData.animalIds}
                                    availableItems={animals?.map(a => ({ _id: a._id, name: a.name })) || []}
                                    onSelectionChange={(ids) => setFormData(prev => ({
                                        ...prev,
                                        animalIds: ids as Array<Id<"animals">>
                                    }))}
                                    placeholder="Select animals..."
                                    searchPlaceholder="Search animals..."
                                />

                                <TopicSelector
                                    label="Topics"
                                    description="Select one or more topics for this article"
                                    selectedTopics={formData.topics}
                                    onSelectionChange={(topics) => setFormData(prev => ({
                                        ...prev,
                                        topics
                                    }))}
                                    placeholder="Select topics..."
                                    searchPlaceholder="Search topics..."
                                />
                            </CardContent>
                        </Card> */}

                        {/* Article Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {articleFormData.authorCredit && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span>Author Credit: {articleFormData.authorCredit}</span>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Created: {formatDate(new Date(article._creationTime))}</span>
                                </div>

                                <Separator />

                                <div className="text-sm text-gray-600">
                                    <p>
                                        Words: {(
                                            (articleFormData.content || "")
                                                .replace(/<[^>]*>/g, '')
                                                .split(/\s+/)
                                                .filter(word => word.length > 0).length
                                        )}
                                    </p>
                                    <p>Characters: {(articleFormData.content || "").replace(/<[^>]*>/g, '').length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleEditPage;