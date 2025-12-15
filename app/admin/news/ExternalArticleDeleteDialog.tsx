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
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Trash2, Loader2 } from "lucide-react"

const ExternalArticleDeleteDialog = ({ externalArticleId, children }: { externalArticleId: Id<"externalArticles">, children?: React.ReactNode }) => {

    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const deleteExternalArticle = useMutation(api.externalArticles.deleteExternalArticle);

    const handleDeleteExternalArticle = async () => {
        if (deleting) {
            return;
        }
        setDeleting(true);
        setError(null);
        try {
            await deleteExternalArticle({ id: externalArticleId });
        } catch (error) {
            console.error("Error deleting external article:", error);
            setError("Failed to delete external article");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
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
                    <DialogTitle>Delete External Article</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this external article reference? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        disabled={deleting}
                        onClick={handleDeleteExternalArticle}
                    >
                        {deleting
                            ? (<>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>)
                            : "Delete External Article"
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

export default ExternalArticleDeleteDialog;