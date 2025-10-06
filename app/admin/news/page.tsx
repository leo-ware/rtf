"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    User,
    FileText,
    ExternalLink,
    Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleConvexError, handleNotFoundError } from "@/lib/errorHandler";

const AdminNewsPage = () => {
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreateExternalDialogOpen, setIsCreateExternalDialogOpen] = useState(false);
    const [deletingArticle, setDeletingArticle] = useState<Id<"articles"> | null>(null);
    const [deletingExternalArticle, setDeletingExternalArticle] = useState<Id<"externalArticles"> | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"articles"> | null>(null);
    const [confirmDeleteExternalId, setConfirmDeleteExternalId] = useState<Id<"externalArticles"> | null>(null);
    const [fetchingUrl, setFetchingUrl] = useState(false);

    const articles = useQuery(api.articles.listArticles, {
        publishedOnly: false,
        limit: 100
    });
    const externalArticles = useQuery(api.externalArticles.listExternalArticles, { limit: 100 });
    const userArticles = useQuery(api.articles.listUserArticles, { limit: 100 });
    const deleteArticle = useMutation(api.articles.deleteArticle);
    const deleteExternalArticle = useMutation(api.externalArticles.deleteExternalArticle);
    const createArticle = useMutation(api.articles.createArticle);
    const createExternalArticle = useMutation(api.externalArticles.createExternalArticle);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "Start writing your article...",
        imageUrl: "",
        published: false,
    });

    const [externalFormData, setExternalFormData] = useState({
        url: "",
        title: "",
        blurb: "",
        organization: "",
    });

    const handleCreateArticle = async () => {
        try {
            const articleId = await createArticle({
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                imageUrl: formData.imageUrl || undefined,
                published: formData.published,
            });

            setIsCreateDialogOpen(false);
            resetForm();

            // Navigate to edit page for the new article
            router.push(`/admin/news/article/${articleId}/edit`);
        } catch (error: any) {
            console.error("Error creating article:", error);
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "create article", router);
            } else {
                alert("Failed to create article: " + (error?.message || "Unknown error"));
            }
        }
    };

    const handleDeleteArticle = async (articleId: Id<"articles">) => {
        try {
            setDeletingArticle(articleId);
            await deleteArticle({ id: articleId });
            setConfirmDeleteId(null);
        } catch (error: any) {
            console.error("Error deleting article:", error);
            if (error?.message?.includes('not found')) {
                handleNotFoundError("article", articleId, undefined, router);
            } else if (error?.message?.includes('permission')) {
                handleConvexError(error, "delete article", router);
            } else {
                alert("Failed to delete article: " + (error?.message || "Unknown error"));
            }
        } finally {
            setDeletingArticle(null);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            excerpt: "",
            content: "Start writing your article...",
            imageUrl: "",
            published: false,
        });
    };

    const resetExternalForm = () => {
        setExternalFormData({
            url: "",
            title: "",
            blurb: "",
            organization: "",
        });
    };

    const fetchUrlMetadata = async (url: string) => {
        setFetchingUrl(true);
        try {
            const response = await fetch(`/api/fetch-url-metadata?url=${encodeURIComponent(url)}`);
            if (response.ok) {
                const data = await response.json();
                setExternalFormData(prev => ({
                    ...prev,
                    title: data.title || prev.title,
                    blurb: data.description || prev.blurb,
                    organization: data.siteName || prev.organization,
                }));
            }
        } catch (error) {
            console.error("Error fetching URL metadata:", error);
        } finally {
            setFetchingUrl(false);
        }
    };

    const handleCreateExternalArticle = async () => {
        try {
            await createExternalArticle({
                link: externalFormData.url,
                title: externalFormData.title,
                blurb: externalFormData.blurb,
                organization: externalFormData.organization,
            });

            setIsCreateExternalDialogOpen(false);
            resetExternalForm();
        } catch (error: any) {
            console.error("Error creating external article:", error);
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "create external article", router);
            } else {
                alert("Failed to create external article: " + (error?.message || "Unknown error"));
            }
        }
    };

    const handleDeleteExternalArticle = async (externalArticleId: Id<"externalArticles">) => {
        try {
            setDeletingExternalArticle(externalArticleId);
            await deleteExternalArticle({ id: externalArticleId });
            setConfirmDeleteExternalId(null);
        } catch (error: any) {
            console.error("Error deleting external article:", error);
            if (error?.message?.includes('not found')) {
                handleNotFoundError("external article", externalArticleId, undefined, router);
            } else if (error?.message?.includes('permission')) {
                handleConvexError(error, "delete external article", router);
            } else {
                alert("Failed to delete external article: " + (error?.message || "Unknown error"));
            }
        } finally {
            setDeletingExternalArticle(null);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (articles === undefined || externalArticles === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="articles" className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <TabsList className="grid w-fit grid-cols-2">
                        <TabsTrigger value="articles">Articles</TabsTrigger>
                        <TabsTrigger value="external">External Articles</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Article
                                </Button>
                            </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Article</DialogTitle>
                            <DialogDescription>
                                Create a new news article. You'll be able to add rich content in the editor after creation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Article Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter article title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief description of the article"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="imageUrl">Featured Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg (optional)"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="rounded"
                                />
                                <Label htmlFor="published">Publish immediately</Label>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={resetForm}>
                                    Reset
                                </Button>
                                <Button onClick={handleCreateArticle} disabled={!formData.title || !formData.excerpt}>
                                    Create Article
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                        <Dialog open={isCreateExternalDialogOpen} onOpenChange={setIsCreateExternalDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" onClick={resetExternalForm}>
                                    <LinkIcon className="h-4 w-4 mr-2" />
                                    Add External Article
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add External Article</DialogTitle>
                                    <DialogDescription>
                                        Add a reference to an external article from another organization.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="url">Article URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="url"
                                                value={externalFormData.url}
                                                onChange={(e) => setExternalFormData({ ...externalFormData, url: e.target.value })}
                                                placeholder="https://example.com/article"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fetchUrlMetadata(externalFormData.url)}
                                                disabled={!externalFormData.url || fetchingUrl}
                                            >
                                                {fetchingUrl ? "Fetching..." : "Fetch"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="externalTitle">Article Title</Label>
                                        <Input
                                            id="externalTitle"
                                            value={externalFormData.title}
                                            onChange={(e) => setExternalFormData({ ...externalFormData, title: e.target.value })}
                                            placeholder="Enter article title"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="organization">Organization</Label>
                                        <Input
                                            id="organization"
                                            value={externalFormData.organization}
                                            onChange={(e) => setExternalFormData({ ...externalFormData, organization: e.target.value })}
                                            placeholder="Name of the organization"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="blurb">Description</Label>
                                        <Textarea
                                            id="blurb"
                                            value={externalFormData.blurb}
                                            onChange={(e) => setExternalFormData({ ...externalFormData, blurb: e.target.value })}
                                            placeholder="Brief description of the article"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={resetExternalForm}>
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={handleCreateExternalArticle}
                                            disabled={!externalFormData.url || !externalFormData.title || !externalFormData.organization || !externalFormData.blurb}
                                        >
                                            Add External Article
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <TabsContent value="articles" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Articles
                        </CardTitle>
                        <FileText className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{articles?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Published
                        </CardTitle>
                        <Eye className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {articles?.filter(a => a.published).length || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Drafts
                        </CardTitle>
                        <EyeOff className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {articles?.filter(a => !a.published).length || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            My Articles
                        </CardTitle>
                        <User className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userArticles?.length || 0}</div>
                    </CardContent>
                </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Card key={article._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                                    <div className="flex items-center space-x-2 mt-2">
                                        {article.published ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                <Eye className="h-3 w-3 mr-1" />
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
                                <div className="flex space-x-1">
                                    <Link href={`/admin/news/article/${article._id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    {article.published && (
                                        <Link href={`/news/article/${article.slug}`} target="_blank">
                                            <Button variant="outline" size="sm">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setConfirmDeleteId(article._id)}
                                        disabled={deletingArticle === article._id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {article.imageUrl && (
                                    <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <User className="h-3 w-3 mr-1" />
                                        {article.author?.name || 'Unknown'}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article._creationTime)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                    </div>

                    {articles.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                            <p className="text-gray-600 mb-4">Get started by creating your first news article</p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Article
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="external" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total External Articles
                                </CardTitle>
                                <LinkIcon className="h-4 w-4 text-gray-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{externalArticles?.length || 0}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {externalArticles.map((externalArticle) => (
                            <Card key={externalArticle._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-2">{externalArticle.title}</CardTitle>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-800">
                                                    <LinkIcon className="h-3 w-3 mr-1" />
                                                    {externalArticle.organization}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Link href={externalArticle.link} target="_blank">
                                                <Button variant="outline" size="sm">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setConfirmDeleteExternalId(externalArticle._id)}
                                                disabled={deletingExternalArticle === externalArticle._id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {externalArticle.blurb}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <User className="h-3 w-3 mr-1" />
                                                {externalArticle.creator?.name || 'Unknown'}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {formatDate(externalArticle.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {externalArticles.length === 0 && (
                        <div className="text-center py-12">
                            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No external articles yet</h3>
                            <p className="text-gray-600 mb-4">Get started by adding your first external article reference</p>
                            <Button onClick={() => setIsCreateExternalDialogOpen(true)}>
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Add External Article
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Article</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this article? This action cannot be undone and will permanently remove the article from your site.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => confirmDeleteId && handleDeleteArticle(confirmDeleteId)}
                            disabled={deletingArticle !== null}
                        >
                            {deletingArticle === confirmDeleteId ? "Deleting..." : "Delete Article"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete External Article Confirmation Dialog */}
            <AlertDialog open={confirmDeleteExternalId !== null} onOpenChange={(open) => !open && setConfirmDeleteExternalId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete External Article</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this external article reference? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDeleteExternalId(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteExternalId && handleDeleteExternalArticle(confirmDeleteExternalId)}
                            disabled={deletingExternalArticle !== null}
                        >
                            {deletingExternalArticle === confirmDeleteExternalId ? "Deleting..." : "Delete External Article"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

    );
};

export default AdminNewsPage;