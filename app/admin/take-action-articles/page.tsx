"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { handleConvexError } from "@/lib/errorHandler"
import { Edit, Eye, EyeOff, Image as ImageIcon, Plus, Search, Settings, Trash2 } from "lucide-react"
import TakeActionArticleCreateDialog from "./TakeActionArticleCreateDialog"
import TakeActionArticleEditDialog from "./TakeActionArticleEditDialog"
import TakeActionArticleDeleteDialog from "./TakeActionArticleDeleteDialog"
import ConvexImageFromId from "@/components/images/ConvexImageFromId"

type TakeActionArticle = {
    _id: Id<"takeActionArticle">
    _creationTime: number
    title: string
    slug?: string
    imageId?: Id<"images">
    description: string
    content: string
    isPublic: boolean
}

const AdminTakeActionArticlesPage = () => {
    useEffect(() => {
        document.title = "Take Action Articles - RTF Admin"
    }, [])

    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")

    const articles = useQuery(api.takeActionArticle.listTakeActionArticles, { publicOnly: false })

    const filteredArticles = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase()
        return (articles || []).filter((article) => {
            if (!normalizedSearchTerm) return true
            return (
                article.title.toLowerCase().includes(normalizedSearchTerm) ||
                article.description.toLowerCase().includes(normalizedSearchTerm)
            )
        })
    }, [articles, searchTerm])

    if (articles === undefined) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative grow max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <TakeActionArticleCreateDialog
                    onError={(err) => handleConvexError(err, "create take action article", router)}
                >
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Take Action Article
                    </Button>
                </TakeActionArticleCreateDialog>
            </div>

            <div className="text-lg font-medium mb-4">
                {!!searchTerm.trim()
                    ? `Search Results for "${searchTerm}"`
                    : "All Take Action Articles"}
            </div>

            <div className="flex flex-col gap-4">
                {filteredArticles.map((article: TakeActionArticle) => (
                    <Card key={article._id} className="w-full px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="w-full sm:w-28 shrink-0">
                            <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                                {article.imageId ? (
                                    <ConvexImageFromId
                                        imageId={article.imageId}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                        </div>

                        <div className="sm:grow">
                            <div className="w-full flex flex-col items-start justify-start gap-2">
                                <div className="text-lg font-medium break-words sm:max-w-10/12">
                                    {article.title}
                                </div>
                                {article.isPublic ? (
                                    <Badge className="bg-green-100 text-green-800">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Public
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Private
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link href={`/admin/take-action-articles/${article._id}`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </Link>

                            <TakeActionArticleEditDialog
                                takeActionArticleId={article._id}
                                onError={(err) => handleConvexError(err, "update take action article", router)}
                            >
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </TakeActionArticleEditDialog>

                            <TakeActionArticleDeleteDialog
                                takeActionArticleId={article._id}
                                onError={(err) => handleConvexError(err, "delete take action article", router)}
                            >
                                <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TakeActionArticleDeleteDialog>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No take action articles</h3>
                    <p className="text-gray-600 mb-4">
                        Get started by creating your first take action article.
                    </p>
                    <TakeActionArticleCreateDialog
                        onError={(err) => handleConvexError(err, "create take action article", router)}
                    >
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Take Action Article
                        </Button>
                    </TakeActionArticleCreateDialog>
                </div>
            )}
        </div>
    )
}

export default AdminTakeActionArticlesPage


