"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const ArticleDeleteDialog = ({ articleId, children }: { articleId: Id<"articles">, children?: React.ReactNode }) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const deleteArticle = useMutation(api.articles.deleteArticle);

    const handleDeleteArticle = async () => {
        if (saving) {
            return;
        }
        setSaving(true);
        try {
            await deleteArticle({ id: articleId });
        } catch (error) {
            console.error("Error deleting article:", error);
            setError("Failed to delete article");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                {children
                    ? children
                    : (
                        <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Article</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this article? This action cannot be undone and will permanently remove the article from your site.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleDeleteArticle}
                        disabled={saving}
                        variant={"destructive"}
                    >
                        {saving
                            ? <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                            : "Delete Article"
                        }
                    </Button>
                </DialogFooter>
                {error && (
                    <DialogFooter>
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ArticleDeleteDialog;