"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkIcon, Loader2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import ImagePickerDialog from "@/components/images/ImagePickerDialog";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const ExternalArticleCreateDialog = ({ children }: { children?: React.ReactNode }) => {

    const createExternalArticle = useMutation(api.externalArticles.createExternalArticle);

    const [externalFormData, setExternalFormData] = useState({
        url: "",
        title: "",
        organization: "",
        blurb: "",
        imageId: null as Id<"images"> | null,
    });

    const resetExternalForm = () => {
        setExternalFormData({
            url: "",
            title: "",
            organization: "",
            blurb: "",
            imageId: null,
        });
    }

    const [open, setOpen] = useState(false);
    const [hasFinishedFetching, setHasFinishedFetching] = useState(false);
    const [fetchingUrl, setFetchingUrl] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setHasFinishedFetching(true);
        } catch (error) {
            console.error("Error fetching URL metadata:", error);
            setHasFinishedFetching(true);
        } finally {
            setFetchingUrl(false);
        }
    };

    const canCreate = (
        externalFormData.url.trim() !== "" &&
        externalFormData.title.trim() !== "" &&
        externalFormData.organization.trim() !== "" &&
        externalFormData.blurb.trim() !== "" &&
        externalFormData.imageId !== null
    )

    const handleCreateExternalArticle = async () => {
        if (canCreate && !saving) {
            setSaving(true);
            setError(null);
            try {
                const externalArticleId = await createExternalArticle({
                    title: externalFormData.title,
                    link: externalFormData.url,
                    date: new Date().getTime(),
                    imageId: externalFormData.imageId!,
                    organization: externalFormData.organization,
                    blurb: externalFormData.blurb,
                });
            } catch (error) {
                console.error("Error creating external article:", error);
                setError("Failed to create external article");
            } finally {
                setSaving(false);
                resetExternalForm();
                setOpen(false);
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            setOpen(open);
            resetExternalForm();
        }}>
            <DialogTrigger asChild>
                {children
                    ? children
                    : (
                        <Button variant="outline">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Add External Article
                        </Button>
                    )
                }
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
                                disabled={hasFinishedFetching}
                            />
                            {!hasFinishedFetching && (
                                <Button
                                    type="button"
                                    onClick={() => fetchUrlMetadata(externalFormData.url)}
                                    disabled={!externalFormData.url || fetchingUrl}
                                >
                                    {fetchingUrl ? "Fetching..." : "Fetch"}
                                </Button>
                            )}
                        </div>
                    </div>

                    {hasFinishedFetching && (
                        <>
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

                            <div>
                                <Label>Image (Optional)</Label>
                                <ImagePickerDialog
                                    imageId={externalFormData.imageId || null}
                                    onImageSelect={(imageId) => (
                                        setExternalFormData({ ...externalFormData, imageId: imageId || null })
                                    )}
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={resetExternalForm}>
                                    Reset
                                </Button>
                                <Button
                                    onClick={handleCreateExternalArticle}
                                    disabled={!canCreate}
                                >
                                    {saving
                                        ? (<>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Adding...
                                        </>)
                                        : "Add External Article"
                                    }
                                </Button>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ExternalArticleCreateDialog;