"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import ImagePickerDialog from "@/components/images/ImagePickerDialog"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type Props = {
    externalArticleId: Id<"externalArticles">
    children?: React.ReactNode
}

const ExternalArticleUpdateDialog = ({ externalArticleId, children }: Props) => {
    const updateExternalArticle = useMutation(api.externalArticles.updateExternalArticle)
    const existingData = useQuery(api.externalArticles.getExternalArticle, { id: externalArticleId })

    const [formData, setFormData] = useState({
        url: "",
        title: "",
        organization: "",
        blurb: "",
        imageId: null as Id<"images"> | null,
    })

    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (existingData) {
            setFormData({
                url: existingData.link ?? "",
                title: existingData.title ?? "",
                organization: existingData.organization ?? "",
                blurb: existingData.blurb ?? "",
                imageId: existingData.imageId ?? null,
            })
        }
    }, [existingData])

    const canSave = (
        formData.url.trim() !== "" &&
        formData.title.trim() !== "" &&
        formData.organization.trim() !== "" &&
        formData.blurb.trim() !== ""
    )

    const handleSave = async () => {
        if (!canSave || saving) return
        setSaving(true)
        setError(null)
        try {
            await updateExternalArticle({
                id: externalArticleId,
                link: formData.url,
                title: formData.title,
                organization: formData.organization,
                blurb: formData.blurb,
                imageId: formData.imageId ?? undefined,
            })
        } catch (err) {
            console.error("Error updating external article:", err)
            setError("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? <Button variant="outline">Edit</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit External Article</DialogTitle>
                    <DialogDescription>
                        Update the details of this external article reference.
                    </DialogDescription>
                </DialogHeader>

                {existingData === undefined ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-url">Article URL</Label>
                            <Input
                                id="edit-url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://example.com/article"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-title">Article Title</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter article title"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-organization">Organization</Label>
                            <Input
                                id="edit-organization"
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                placeholder="Name of the organization"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-blurb">Description</Label>
                            <Textarea
                                id="edit-blurb"
                                value={formData.blurb}
                                onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
                                placeholder="Brief description of the article"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label>Image (Optional)</Label>
                            <ImagePickerDialog
                                imageId={formData.imageId}
                                onImageSelect={(imageId) =>
                                    setFormData({ ...formData, imageId: imageId ?? null })
                                }
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSave} disabled={!canSave || saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ExternalArticleUpdateDialog
