"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

const ImageDeleteDialog = ({ imageId, children }: { imageId: Id<"images">, children?: React.ReactNode }) => {
    const deleteImage = useMutation(api.images.deleteImage);

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteImage = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        setError(null);
        try {
            await deleteImage({ id: imageId });
            setIsOpen(false);
        } catch (error) {
            console.error("Error deleting image:", error);
            setError("Failed to delete image");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                {children
                    ? children
                    : <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Image</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this image? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => handleDeleteImage()}>
                        {!isDeleting && (<>Delete</>)}
                        {isDeleting && (<>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                        </>)}
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

export default ImageDeleteDialog;