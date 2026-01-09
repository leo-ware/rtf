"use client"

import { use, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { PageProps } from "@/lib/types"
import { removeUndefined, deepEqual } from "@/lib/utils"
import { TiptapEditor } from "@/components/TiptapEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { handleConvexError } from "@/lib/errorHandler"
import { ArrowLeft, Eye, EyeOff, Loader2, Save } from "lucide-react"

const EducationArticleEditPage = ({ params }: PageProps<{ educationArticleId: string }>) => {
    const router = useRouter()
    const resolvedParams = use(params)

    const educationArticleId = resolvedParams.educationArticleId as Id<"educationArticles">
    const educationArticle = useQuery(api.educationArticles.getById, { id: educationArticleId })
    const updateEducationArticleMetadata = useMutation(api.educationArticles.updateMetadata)
    const updateEducationArticleContent = useMutation(api.educationArticles.updateContent)

    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const localInitialized = useRef(false)

    const [formData, setFormData] = useState({
        title: undefined as string | undefined,
        slug: undefined as string | undefined,
        description: undefined as string | undefined,
        content: undefined as string | undefined,
        isPublic: undefined as boolean | undefined,
    })

    const articleToFormData = (a: typeof educationArticle): typeof formData => ({
        title: a?.title,
        slug: a?.slug,
        description: a?.description,
        content: a?.content,
        isPublic: a?.isPublic,
    })

    useEffect(() => {
        if (educationArticle && !localInitialized.current) {
            localInitialized.current = true
            setFormData(articleToFormData(educationArticle))
        }
    }, [educationArticle])

    const hasUnsavedChanges = useMemo(() => {
        return !deepEqual(formData, articleToFormData(educationArticle))
    }, [formData, educationArticle])

    const handleSave = async () => {
        if (!educationArticle) return
        if (isSaving) return

        setIsSaving(true)
        setError(null)
        try {
            await Promise.all([
                updateEducationArticleMetadata(removeUndefined({
                    id: educationArticle._id,
                    title: formData.title,
                    slug: formData.slug,
                    description: formData.description,
                    isPublic: formData.isPublic,
                })),
                typeof formData.content === "string"
                    ? updateEducationArticleContent({
                        id: educationArticle._id,
                        content: formData.content,
                    })
                    : Promise.resolve(),
            ])
        } catch (err) {
            console.error("Error saving education article:", err)
            setError("Failed to save education article. Please try again.")
            handleConvexError(err, "update education article", router)
        } finally {
            setIsSaving(false)
        }
    }

    if (educationArticle === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="h-96 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (educationArticle === null) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto space-y-4">
                    <div className="text-lg font-medium">Article not found</div>
                    <Link href="/admin/education-articles">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/education-articles">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Edit Education Article</h1>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    {hasUnsavedChanges && (
                                        <Badge variant="secondary">Unsaved changes</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (!formData.isPublic && !formData.slug?.trim()) {
                                        setError("Please set a slug before publishing.")
                                        return
                                    }
                                    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }))
                                }}
                                disabled={isSaving || typeof formData.isPublic !== "boolean"}
                            >
                                {formData.isPublic ? (
                                    <>
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Unpublish
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Publish
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !hasUnsavedChanges}
                                size="sm"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Content</CardTitle>
                                <CardDescription>
                                    Edit the education HTML content using the rich text editor.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {typeof formData.content === "string" && (
                                    <TiptapEditor
                                        content={formData.content}
                                        onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                                        placeholder="Start writing..."
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title || ""}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug || ""}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                        placeholder="e.g. wild-horse-history"
                                    />
                                    <div className="text-xs text-gray-500">
                                        Public URL: `/resources/learn/&lt;slug&gt;`
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Short description"
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center gap-2">
                                        {formData.isPublic ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                <Eye className="h-3 w-3 mr-1" />
                                                Published
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <EyeOff className="h-3 w-3 mr-1" />
                                                Draft
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm">{error}</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EducationArticleEditPage


