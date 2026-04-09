"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    User,
    FileText,
    ExternalLink,
    LinkIcon,
    Badge,
    Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ArticleCreateDialog from "./ArticleCreateDialog"
import ExternalArticleCreateDialog from "./ExternalArticleCreateDialog"
import ExternalArticleUpdateDialog from "./ExternalArticleUpdateDialog"
import ArticleDeleteDialog from "./ArticleDeleteDialog"
import ExternalArticleDeleteDialog from "./ExternalArticleDeleteDialog"
import { formatDate } from "@/lib/utils"

const AdminNewsPage = () => {
    useEffect(() => {
        document.title = "News & Articles - RTF Admin"
    }, [])

    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 250)
        return () => clearTimeout(handle)
    }, [searchTerm])

    const trimmedSearch = debouncedSearchTerm.trim()

    const {
        results: allArticles,
        loadMore: loadMoreArticles,
        status: articleSearchStatus,
    } = usePaginatedQuery(
        api.articleMetadata.search,
        {
            publicOnly: false,
            query: trimmedSearch || undefined,
            topics: undefined,
            external: undefined,
            dateMin: undefined,
            dateMax: undefined,
        },
        { initialNumItems: 100 },
    )

    const updateArticleMetadata = useMutation(
        api.articleMetadata.updateArticleMetadata,
    )

    const setArticlePublic = async (
        articleMetadataId: Id<"articleMetadata">,
        published: boolean,
    ) => {
        await updateArticleMetadata({
            id: articleMetadataId,
            public: published,
        })
    }

    if (allArticles === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-64 bg-gray-200 rounded-lg"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    const articles = allArticles.filter(
        (article) => article.isExternal === false,
    )
    const externalArticles = allArticles.filter(
        (article) => article.isExternal === true,
    )

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search articles…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>
            <Tabs defaultValue="articles" className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <TabsList className="grid w-fit grid-cols-2">
                        <TabsTrigger value="articles">Articles</TabsTrigger>
                        <TabsTrigger value="external">
                            External Articles
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <ArticleCreateDialog />
                        <ExternalArticleCreateDialog />
                    </div>
                </div>

                <TabsContent value="articles" className="space-y-6">
                    <div className="flex flex-col gap-6">
                        {articles.map((article) => (
                            <Card
                                key={article._id}
                                className="w-full px-8 py-4 flex flex-row gap-6 justify-between items-start"
                            >
                                <div>
                                    <div className="flex flex-col gap-2 py-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-muted-foreground" />
                                            <div className="text-lg">
                                                {article.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex space-x-1 pt-1">
                                        {article.public && (
                                            <Link
                                                href={article.link}
                                                target="_blank"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    View On Site
                                                </Button>
                                            </Link>
                                        )}

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setArticlePublic(
                                                            article._id,
                                                            !article.public,
                                                        )
                                                    }
                                                >
                                                    {article.public ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {article.public
                                                    ? "Unpublish"
                                                    : "Publish"}
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={`/admin/news/article/${article.articleId}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Edit Article
                                            </TooltipContent>
                                        </Tooltip>

                                        {article.articleId && (
                                            <ArticleDeleteDialog
                                                articleId={article.articleId!}
                                            />
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {articles.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            {trimmedSearch ? (
                                <>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No articles match &ldquo;{trimmedSearch}&rdquo;
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Try a different search term.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No articles yet
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Get started by creating your first news article
                                    </p>
                                    <ArticleCreateDialog />
                                </>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="external" className="space-y-6">
                    <div className="flex flex-col gap-6">
                        {externalArticles.map((externalArticle) => (
                            <Card
                                key={externalArticle._id}
                                className="w-full px-8 py-4 flex flex-row gap-6 justify-between items-start"
                            >
                                <div>
                                    <div className="flex flex-col gap-2 py-2">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="w-5 h-5 text-muted-foreground" />
                                            <div className="text-lg font-semibold">
                                                {externalArticle.title}
                                            </div>
                                        </div>
                                        {/* <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-800">
                                                {externalArticle.organization}
                                            </Badge>
                                            <span className="mx-2">•</span>
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(externalArticle.createdAt)}
                                            <span className="mx-2">•</span>
                                            <User className="w-4 h-4" />
                                            {externalArticle.creator?.name || 'Unknown'}
                                        </div> */}
                                        {externalArticle.excerpt && (
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {externalArticle.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex space-x-1 pt-1">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={externalArticle.link}
                                                    target="_blank"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                View External Article
                                            </TooltipContent>
                                        </Tooltip>

                                        {externalArticle.externalArticleId && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <ExternalArticleUpdateDialog
                                                        externalArticleId={externalArticle.externalArticleId}
                                                    >
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </ExternalArticleUpdateDialog>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit</TooltipContent>
                                            </Tooltip>
                                        )}

                                        {externalArticle.externalArticleId && (
                                            <ExternalArticleDeleteDialog
                                                externalArticleId={
                                                    externalArticle.externalArticleId
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {externalArticles.length === 0 && (
                        <div className="text-center py-12">
                            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            {trimmedSearch ? (
                                <>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No external articles match &ldquo;{trimmedSearch}&rdquo;
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Try a different search term.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No external articles yet
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Get started by adding your first external
                                        article reference
                                    </p>
                                    <ExternalArticleCreateDialog>
                                        <Button>
                                            <LinkIcon className="h-4 w-4 mr-2" />
                                            Add External Article
                                        </Button>
                                    </ExternalArticleCreateDialog>
                                </>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {articleSearchStatus === "CanLoadMore" && (
                <Button variant="outline" onClick={() => loadMoreArticles(20)}>
                    Load More
                </Button>
            )}
        </div>
    )
}

export default AdminNewsPage
