"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ArticleCreateDialog from "./ArticleCreateDialog"
import ArticleEditDialog from "./ArticleEditDialog"
import ArticleDeleteDialog from "./ArticleDeleteDialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent } from "@/components/ui/card"

const ArticlesTab = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const articles = useQuery(api.education.getInvertedEducationTree, { includePrivate: true })
    const groups = useQuery(api.educationArticleGroups.listAll)
    const assignArticleToGroup = useMutation(api.educationArticleGroups.assignArticleToGroup)

    const filtering = !!searchTerm
    const filteredArticles = (articles || [])
        .filter((a) => {
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return (
                a.title.toLowerCase().includes(searchLower) ||
                a.description.toLowerCase().includes(searchLower)
            )
        })

    if (articles === undefined) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ArticleCreateDialog />
                </div>
            </div>

            <div className="text-lg font-medium mb-4">
                {filtering
                    ? `Search Results for "${searchTerm}"`
                    : "All Articles"}
            </div>

            <Accordion type="single" collapsible className="w-full">
                {filteredArticles.map((article) => (
                    <AccordionItem key={article._id} value={article._id} className="w-full border-0 my-2">
                        <Card className="py-3">
                            <CardContent className="py-0">
                                <div className="w-full flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-medium truncate">{article.title}</span>
                                        <Badge variant={article.isPublic ? "default" : "secondary"} className="shrink-0">
                                            {article.isPublic ? "Public" : "Private"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="w-fit">
                                            <Select
                                                value={article.group?._id ?? "unassigned"}
                                                onValueChange={async (value) => {
                                                    await assignArticleToGroup({
                                                        articleId: article._id,
                                                        groupId: value === "unassigned"
                                                            ? null
                                                            : (value as Id<"educationArticleGroups">),
                                                    })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                                    {(groups || []).map((g) => (
                                                        <SelectItem key={g._id} value={g._id}>
                                                            {g.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Link href={`/admin/education-articles/${article._id}`}>
                                            <Button variant="outline" size="sm">
                                                Edit Content
                                            </Button>
                                        </Link>
                                        <ArticleEditDialog article={article} />
                                        <ArticleDeleteDialog articleId={article._id} />
                                        <AccordionTrigger className="hover:no-underline p-0 [&>svg]:h-4 [&>svg]:w-4" />
                                    </div>
                                </div>

                                <AccordionContent>
                                    <div className="mt-4 text-sm text-gray-600">
                                        {article.description}
                                    </div>
                                </AccordionContent>
                            </CardContent>
                        </Card>
                    </AccordionItem>
                ))}
            </Accordion>

            {filteredArticles.length === 0 && (
                <div className="text-center py-12 w-full">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No articles match "${searchTerm}"`
                            : "Get started by creating your first article."
                        }
                    </p>
                </div>
            )}
        </>
    )
}

export default ArticlesTab


