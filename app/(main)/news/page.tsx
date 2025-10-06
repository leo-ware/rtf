"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"
import { format } from "date-fns"

import { IoIosSearch } from "react-icons/io"
import { FaRegFileImage } from "react-icons/fa"

export default function NewsPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const articles = useQuery(api.articles.listArticles, {
        limit: 50,
        publishedOnly: true
    })

    const filteredArticles = useMemo(() => {
        if (!articles) return []

        return articles.filter(article => {
            const matchesSearch = searchTerm === "" ||
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesSearch
        })
    }, [articles, searchTerm])

    return (
        <div className="w-full h-fit bg-seashell">
            {/* Hero Header */}
            <div className="w-full h-[400px] relative flex items-center justify-center bg-sage-green">
                <Image
                    src="/img/Owyhee-9925-scaled.jpg"
                    alt="News Hero"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
                    fill
                />
                <div className="z-10 p-4 border-b border-white text-white text-4xl font-bold">
                    News & Updates
                </div>
            </div>

            <div className="h-fit w-11/12 md:w-1/2 mx-auto flex flex-col gap-8 py-8">
                {/* Search */}
                <div className="w-full h-10 flex justify-between">
                    <div className="flex items-center p-1 gap-2 h-full w-fit border-2 border-[#618596] rounded-sm">
                        <div className="h-full w-fit">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-48 h-full focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="w-fit h-full flex items-center justify-center">
                            <IoIosSearch className="text-ink" size={16} />
                        </div>
                    </div>
                </div>

                {/* Articles */}
                <div className="w-full h-fit min-h-[400px]">
                    {filteredArticles.length === 0
                        ? (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? "No articles found" : "No articles yet"}
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm
                                        ? "Try adjusting your search terms."
                                        : "Check back soon for the latest news and updates."
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {filteredArticles.map((article) => (
                                    <article key={article._id} className="text-ink w-full h-fit py-2 flex gap-6">
                                        <div className="relative basis-28 h-28 grow-0 shrink-0
                                            overflow-hidden flex items-center justify-center">
                                            {article.imageUrl ? (
                                                <Image
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    fill
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-md bg-gray-100 flex items-center justify-center">
                                                    <FaRegFileImage className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grow basis-0 flex flex-col gap-2">
                                            <Link
                                                className="text-md font-bold hover:underline"
                                                href={`/news/article/${article.slug}`}
                                            >
                                                {article.title}
                                            </Link>

                                            <p className="text-sm text-gray-600 line-clamp-3 pr-2">
                                                {article.excerpt}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {article.publishedAt && (
                                                    <div className="flex items-center">
                                                        {format(new Date(article.publishedAt), "MMM dd, yyyy")}
                                                    </div>
                                                )}
                                                {article.author && (
                                                    <div className="flex items-center">
                                                        {article.author.name}
                                                    </div>
                                                )}
                                            </div>

                                            {/* <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    {article.publishedAt && (
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {format(new Date(article.publishedAt), "MMM dd, yyyy")}
                                                        </div>
                                                    )}
                                                    {article.author && (
                                                        <div className="flex items-center">
                                                            <User className="h-4 w-4 mr-1" />
                                                            {article.author.name}
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/news/article/${article.slug}`}
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                >
                                                    Read More
                                                    <ArrowRight className="h-4 w-4 ml-1" />
                                                </Link>
                                            </div> */}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
