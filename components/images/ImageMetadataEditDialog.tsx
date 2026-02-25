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
import { Edit2, Loader2 } from "lucide-react";
import PeopleMultiSelect from "@/components/PeopleMultiSelect";

type Metadata = {
    title: string;
    altText: string;
    authorCredit: string;
    authors: Id<"people">[];
}

const MetadataEditorDialog = ({ imageId, children }: { imageId: Id<"images">, children?: React.ReactNode }) => {
    const image = useQuery(api.images.getImage, { id: imageId });
    const updateImage = useMutation(api.images.updateImage);
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formState, setFormState] = useState<Metadata>({
        title: image?.title || "",
        altText: image?.altText || "",
        authorCredit: image?.authorCredit || "",
        authors: image?.authors || [],
    });

    useEffect(() => {
        if (image) {
            setFormState({
                title: image.title,
                altText: image.altText || "",
                authorCredit: image.authorCredit || "",
                authors: image.authors || [],
            });
        }
    }, [image]);

    const saveMetadata = async () => {
        if (!canSave) return;

        setIsSaving(true);
        setError(null);
        try {
            await updateImage({
                id: imageId,
                altText: formState.altText,
                title: formState.title,
                authorCredit: formState.authorCredit || undefined,
                authors: formState.authors.length > 0 ? formState.authors : undefined,
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving metadata:", error);
            setError("Failed to save metadata");
        } finally {
            setIsSaving(false);
        }
    }

    const hasChanges = formState.altText !== (image?.altText || "") ||
        formState.title !== image?.title ||
        formState.authorCredit !== (image?.authorCredit || "") ||
        JSON.stringify(formState.authors) !== JSON.stringify(image?.authors || []);
    const canEdit = !isSaving
    const canSave = !isSaving && hasChanges;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

                    <div>
                        <div className="flex gap-2">
                            <Label>Authors</Label>
                            <InfoWidget>
                                Credit for the photographer or image creator. Select one or more people.
                            </InfoWidget>
                        </div>
                        <PeopleMultiSelect
                            selectedPersonIds={formState.authors}
                            onSelect={(ids) => setFormState(prev => ({ ...prev, authors: ids }))}
                            disabled={!canEdit}
                        />
                    </div>

                    <div>
                        <div className="flex gap-2">
                            <Label htmlFor="authorCredit">Author Credit (legacy text)</Label>
                            <InfoWidget>
                                Fallback text credit if no authors are selected above. Displayed on hover.
                            </InfoWidget>
                        </div>
                        <Input
                            id="authorCredit"
                            value={formState.authorCredit}
                            disabled={!canEdit}
                            onChange={(e) => setFormState(prev => ({ ...prev, authorCredit: e.target.value }))}
                            placeholder="e.g. John Smith Photography"
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
                            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isSaving ? "Saving..." : "Save Metadata"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MetadataEditorDialog;
