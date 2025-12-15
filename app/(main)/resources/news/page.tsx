"use client"

import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import Input from "@/components/public-ui/form/Input"
import Select, { SelectOption } from "@/components/public-ui/form/Select"
import NewsHeroImage from "./news-hero-image.jpg"
import { cn, formatDate } from "@/lib/utils"
import { FaSearch } from "react-icons/fa"
import ConvexImage from "@/components/images/ConvexImage"
import Button from "@/components/public-ui/Button"
import { Loader2 } from "lucide-react"


const NewsOptionBox = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
    <div
        {...props}
        className={cn(
            `h-full w-fit min-w-fit flex items-center justify-between gap-2 py-1 px-2 rounded-sm
            border-2 border-[#618596] text-[#618596] uppercase font-semibold text-sm`,
            props.className
        )}
    />
)

export default function NewsPage() {

    const [searchTerm, setSearchTerm] = useState<string | null>(null)
    const [external, setExternal] = useState<SelectOption<boolean | undefined> | null>(null)

    const resetSearch = () => {
        setSearchTerm(null)
        setExternal(null)
    }

    const { results: articles, loadMore: loadMoreArticles, status: articleSearchStatus } = usePaginatedQuery(api.articleMetadata.search, {
        publicOnly: true,
        query: !!searchTerm ? searchTerm : undefined,
        external: external?.value ?? undefined,
    }, { initialNumItems: 20 })

    const filteredArticles = articles || []

    return (
        <div className="w-full h-fit">
            <div className="w-full h-[500px] relative flex items-center justify-center bg-sage-green">
                <Image
                    src={NewsHeroImage}
                    alt="News Hero"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
                    fill
                />
                <div className="z-10 p-4 text-white text-6xl font-serif">
                    News
                </div>
            </div>

            <div className="h-fit w-10/12 mx-auto flex flex-col gap-8 py-8">
                {/* Search */}
                <div className="w-full h-10 flex justify-between gap-8">
                    <div className="w-1/3">
                        <Input
                            value={searchTerm ?? ""}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            icon={
                                <FaSearch
                                    className="text-pewter shrink-0 w-full"
                                    size={16} />
                            }
                        />
                    </div>
                    <div className="flex gap-4">
                        <Select
                            placeholder="Source"
                            options={[
                                { label: "All", value: undefined },
                                { label: "RTF", value: false },
                                { label: "External", value: true },
                            ]}
                            selectedValue={external ?? null}
                            onSelect={setExternal}
                        />
                        <NewsOptionBox
                            className="w-fit h-10 border-none"
                            onClick={resetSearch}>
                            Reset
                        </NewsOptionBox>
                    </div>
                </div>

                {/* Articles */}
                <div className="w-full h-fit min-h-[400px]">
                    {filteredArticles.length === 0
                        ? (
                            <div className="font-serif text-2xl text-center py-16">
                                {articleSearchStatus === "LoadingFirstPage" ? "Loading..." : "No articles found"}
                            </div>
                        ) : (
                            <div className="w-full h-fit min-h-[400px] flex flex-col gap-4">
                                <div className="w-full flex flex-col gap-4">
                                    {filteredArticles.map((article) => (
                                        <div key={article._id} className="w-full h-[200px] bg-gray-50 flex flex-row justify-between items-center">
                                            <div className="w-1/4 h-full bg-gray-100">
                                                {article.image?.url && (
                                                    <ConvexImage
                                                        src={article.image?.url}
                                                        alt={article.title}
                                                        width={article.image?.width}
                                                        height={article.image?.height}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="w-3/4 px-10 flex flex-col gap-2 items-start justify-center">
                                                <Link href={`/api/redirect/article/${article.articleId}`} className="text-lg font-serif">
                                                    {article.title}
                                                </Link>
                                                <div className="text-sm uppercase font-semibold">
                                                    {article.date ? formatDate(new Date(article.date)) : formatDate(new Date(article._creationTime))}
                                                </div>
                                                <div className="text-sm">
                                                    {article.excerpt}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!["LoadingFirstPage", "Exhausted"].includes(articleSearchStatus) && (
                                    <Button
                                        onClick={() => loadMoreArticles(50)}
                                        color={articleSearchStatus === "Exhausted" ? "gray-100" : "cinnamon"}>
                                        {articleSearchStatus === "CanLoadMore" && "Load More"}
                                        {articleSearchStatus === "LoadingMore" && (<>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading...
                                        </>)}
                                    </Button>
                                )}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
