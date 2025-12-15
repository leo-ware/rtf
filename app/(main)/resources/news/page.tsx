"use client"

import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import Input from "@/components/public-ui/form/Input"
import Select, { SelectOption } from "@/components/public-ui/form/Select"
import NewsHeroImage from "./news-hero-image.jpg"
import { cn } from "@/lib/utils"
import { FaSearch } from "react-icons/fa"


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

    const { results: articles, loadMore: loadMoreArticles } = usePaginatedQuery(api.articleMetadata.search, {
        publicOnly: true,
        query: !!searchTerm ? searchTerm : undefined,
        external: external?.value ?? undefined,
    }, { initialNumItems: 50 })

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
                            <div className="text-center py-12">
                                No articles
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b bg-gray-50">
                                            <tr>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">Author</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                                                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredArticles.map((article) => (
                                                <tr key={article._id} className="hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900 line-clamp-1">
                                                                {article.title}
                                                            </div>
                                                            {article.excerpt && (
                                                                <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                                                                    {article.excerpt}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    {/* <td className="py-3 px-4 text-sm text-gray-600">
                                                        {(article.authorCredit) || "RTF Staff"}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {article.publishedAt
                                                            ? format(new Date(article.publishedAt), "MMM dd, yyyy")
                                                            : "—"
                                                        }
                                                    </td> */}
                                                    <td className="py-3 px-4 text-right">
                                                        <Link
                                                            href={article.link}
                                                            className="text-burnt-orange hover:text-burnt-orange/80 font-medium text-sm"
                                                        >
                                                            Read Article →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="text-pewter underline cursor-pointer text-sm mt-4"
                                    onClick={() => loadMoreArticles(50)}
                                >
                                    Load More
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
