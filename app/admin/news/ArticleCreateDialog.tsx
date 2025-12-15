"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { generateSlug } from "@/lib/utils";
import InfoWidget from "@/components/InfoWidget";
import { useRouter } from "next/navigation";
import ImagePickerDialog from "@/components/images/ImagePickerDialog";

const ArticleCreateDialog = () => {

    const createArticle = useMutation(api.articles.createArticle);
    const router = useRouter();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        slug: "",
        imageId: null as Id<"images"> | null,
        authorCredit: "",
    });
    const [slugSetManually, setSlugSetManually] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.title ||
        !formData.excerpt ||
        !formData.imageId ||
        !formData.slug
    )

    const handleCreateArticle = async () => {
        if (saveDisabled) {
            return;
        }
        setIsLoading(true);
        try {
            if (!formData.imageId) {
                throw new Error("Image is required");
            }
            const articleId = await createArticle({
                title: formData.title,
                excerpt: formData.excerpt,
                slug: formData.slug,
                imageId: formData.imageId,
                authorCredit: formData.authorCredit,
                date: new Date().getTime(),
            })
            router.push(`/admin/news/article/${articleId}/edit`);
        } catch (error) {
            // console.error("Error creating article:", error);
            setError(`Failed to create article. ${error}`)
        } finally {
            setIsLoading(false);
        }
        
    }

    const resetForm = () => {
        if (editingDisabled) {
            return
        }
        setFormData({
            title: "",
            slug: "",
            excerpt: "",
            imageId: null as Id<"images"> | null,
            authorCredit: "",
        });
    }

    return (
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
                        Create a new news article. You'll be able to edit the content after creation.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Article Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            disabled={editingDisabled}
                            onChange={(e) => {
                                setFormData(prev => {
                                    const val = {...prev, title: e.target.value}
                                    if (!slugSetManually) {
                                        val.slug = generateSlug(e.target.value)
                                    }
                                    return val
                                })
                            }}
                            placeholder="Enter article title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            disabled={editingDisabled}
                            onChange={(e) => {
                                setFormData({ ...formData, slug: e.target.value })
                                setSlugSetManually(true);
                            }}
                            placeholder="article-url-slug"
                        />
                    </div>

                    <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Brief description of the article"
                            rows={3}
                        />
                    </div>

                    <div>
                        <div className="flex gap-2">
                            <Label htmlFor="authorCredit">Author Credit</Label>
                            <InfoWidget>
                                The name that will be displayed as the author. If left empty, no author will
                                be displayed.
                            </InfoWidget>
                        </div>
                        <Input
                            id="authorCredit"
                            value={formData.authorCredit}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, authorCredit: e.target.value })}
                            placeholder="Author name for display (optional)"
                        />
                    </div>

                    <div>
                        <Label htmlFor="excerpt">Featured Image</Label>
                        <ImagePickerDialog
                            imageId={formData.imageId || null}
                            onImageSelect={(imageId) => setFormData({ ...formData, imageId: imageId || null })}
                            disabled={editingDisabled}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={resetForm} disabled={editingDisabled}>
                            Reset
                        </Button>
                        <Button onClick={handleCreateArticle} disabled={saveDisabled}>
                            Create Article
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ArticleCreateDialog;