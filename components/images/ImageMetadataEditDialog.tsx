"use client"

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import InfoWidget from "@/components/InfoWidget";
import { Edit2 } from "lucide-react";

type Metadata = {
    title: string;
    altText: string;
}

const MetadataEditorDialog = ({ imageId, children }: { imageId: Id<"images">, children?: React.ReactNode }) => {
    const image = useQuery(api.images.getImage, { id: imageId });
    const updateImage = useMutation(api.images.updateImage);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formState, setFormState] = useState<Metadata>({
        title: image?.title || "",
        altText: image?.altText || "",
    });

    useEffect(() => {
        if (image) {
            setFormState({
                title: image.title,
                altText: image.altText || "",
            });
        }
    }, [image]);

    const saveMetadata = () => {
        if (!canSave) return;

        setIsSaving(true);
        setError(null);
        try {
            updateImage({
                id: imageId,
                altText: formState.altText,
                title: formState.title,
            });
        } catch (error) {
            console.error("Error saving metadata:", error);
            setError("Failed to save metadata");
        } finally {
            setIsSaving(false);
        }
    }

    const hasChanges = formState.altText !== image?.altText || formState.title !== image?.title;
    const canEdit = !isSaving
    const canSave = !isSaving && hasChanges;

    return (
        <Dialog>
            <DialogTrigger>
                {children
                    ? children
                    : <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    Edit Image Metadata
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <div className="flex gap-2">
                            <Label htmlFor="title">Title</Label>
                            <InfoWidget>
                                The title of the image. This is used to search images.
                            </InfoWidget>
                        </div>
                        <Input
                            id="title"
                            value={formState.title}
                            disabled={!canEdit}
                            onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter a title for the image"
                        />
                    </div>

                    <div>
                        <div className="flex gap-2">
                            <Label htmlFor="altText">Alt Text</Label>
                            <InfoWidget>
                                This is the text that will be used to describe the image for accessibility.
                            </InfoWidget>
                        </div>
                        <Input
                            id="altText"
                            value={formState.altText}
                            disabled={!canEdit}
                            onChange={(e) => setFormState(prev => ({ ...prev, altText: e.target.value }))}
                            placeholder="Describe the image for accessibility"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <DialogClose asChild>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={saveMetadata} disabled={!canSave}>
                            Save Metadata
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MetadataEditorDialog;