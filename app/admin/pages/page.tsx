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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    Folder,
    Globe
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminPagesPage = () => {
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [deletingPage, setDeletingPage] = useState<Id<"pages"> | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"pages"> | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const pages = useQuery(api.pages.listPages, {
        publishedOnly: false,
        limit: 100
    });
    const pagesStats = useQuery(api.pages.getPagesStats);
    const deletePage = useMutation(api.pages.deletePage);
    const createPage = useMutation(api.pages.createPage);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "Start writing your page...",
        category: "about" as "about" | "what-we-do" | "learn" | "take-action",
        imageUrl: "",
        isPublished: false,
        metaTitle: "",
        metaDescription: "",
    });

    const handleCreatePage = async () => {
        try {
            const pageId = await createPage({
                title: formData.title,
                excerpt: formData.excerpt || undefined,
                content: formData.content,
                category: formData.category,
                imageUrl: formData.imageUrl || undefined,
                isPublished: formData.isPublished,
                metaTitle: formData.metaTitle || undefined,
                metaDescription: formData.metaDescription || undefined,
            });

            setIsCreateDialogOpen(false);
            resetForm();

            // Navigate to edit page for the new page
            router.push(`/admin/pages/edit/${pageId}`);
        } catch (error: any) {
            console.error("Error creating page:", error);
            alert("Failed to create page: " + (error?.message || "Unknown error"));
        }
    };

    const handleDeletePage = async (pageId: Id<"pages">) => {
        try {
            setDeletingPage(pageId);
            await deletePage({ id: pageId });
            setConfirmDeleteId(null);
        } catch (error: any) {
            console.error("Error deleting page:", error);
            alert("Failed to delete page: " + (error?.message || "Unknown error"));
        } finally {
            setDeletingPage(null);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            excerpt: "",
            content: "Start writing your page...",
            category: "about",
            imageUrl: "",
            isPublished: false,
            metaTitle: "",
            metaDescription: "",
        });
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
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

    const filteredPages = pages?.filter(page =>
        selectedCategory === "all" || page.category === selectedCategory
    );

    if (pages === undefined || pagesStats === undefined) {
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
            {/* Action Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <Label className="text-sm font-medium text-gray-700">Filter by category:</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="about">About</SelectItem>
                            <SelectItem value="what-we-do">What We Do</SelectItem>
                            <SelectItem value="learn">Learn</SelectItem>
                            <SelectItem value="take-action">Take Action</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Page
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Page</DialogTitle>
                            <DialogDescription>
                                Create a new content page. You'll be able to add rich content in the editor after creation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div>
                                <Label htmlFor="title">Page Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter page title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
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
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief description of the page"
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

                            <div>
                                <Label htmlFor="metaTitle">SEO Title</Label>
                                <Input
                                    id="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    placeholder="SEO title (optional)"
                                />
                            </div>

                            <div>
                                <Label htmlFor="metaDescription">SEO Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    placeholder="SEO description (optional)"
                                    rows={2}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="rounded"
                                />
                                <Label htmlFor="isPublished">Publish immediately</Label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={resetForm}>
                                Reset
                            </Button>
                            <Button onClick={handleCreatePage} disabled={!formData.title}>
                                Create Page
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Pages
                        </CardTitle>
                        <FileText className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagesStats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Published
                        </CardTitle>
                        <Globe className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagesStats.published}</div>
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
                        <div className="text-2xl font-bold">{pagesStats.draft}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Recently Updated
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagesStats.recentlyUpdated}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPages?.map((page) => (
                    <Card key={page._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg line-clamp-2">{page.title}</CardTitle>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Badge className={getCategoryColor(page.category)}>
                                            <Folder className="h-3 w-3 mr-1" />
                                            {getCategoryLabel(page.category)}
                                        </Badge>
                                        {page.isPublished ? (
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
                                    <Link href={`/admin/pages/edit/${page._id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setConfirmDeleteId(page._id)}
                                        disabled={deletingPage === page._id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {page.imageUrl && (
                                    <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                                        <img
                                            src={page.imageUrl}
                                            alt={page.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {page.excerpt && (
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {page.excerpt}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <User className="h-3 w-3 mr-1" />
                                        {page.lastEditor?.name || 'Unknown'}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(page.updatedAt)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPages?.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {selectedCategory === "all" ? "No pages yet" : `No pages in ${getCategoryLabel(selectedCategory)}`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Get started by creating your first content page
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Page
                    </Button>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Page</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this page? This action cannot be undone and will permanently remove the page from your site.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteId && handleDeletePage(confirmDeleteId)}
                            disabled={deletingPage !== null}
                        >
                            {deletingPage === confirmDeleteId ? "Deleting..." : "Delete Page"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminPagesPage;