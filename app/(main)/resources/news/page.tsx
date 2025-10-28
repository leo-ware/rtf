"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import Image from "next/image"
import React, { useState, useMemo } from "react"
import { format } from "date-fns"

import { IoIosSearch } from "react-icons/io"
import { FaRegFileImage } from "react-icons/fa"
import NewsHeroImage from "./news-hero-image.jpg"
import { FaCaretDown } from "react-icons/fa6"
import { cn } from "@/lib/utils"


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
    const articles = useQuery(api.articles.listArticles, {
        limit: 50,
        publishedOnly: true
    })

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
                    <NewsOptionBox className="w-56">
                        Search
                        <IoIosSearch className="text-[#618596]" size={16} />
                    </NewsOptionBox>
                    <div className="flex gap-4">
                        <NewsOptionBox className="w-40">
                            News Type
                            <FaCaretDown className="text-[#618596]" size={16} />
                        </NewsOptionBox>
                        <NewsOptionBox className="w-40">
                            Source
                            <FaCaretDown className="text-[#618596]" size={16} />
                        </NewsOptionBox>
                        <NewsOptionBox className="w-40">
                            Issue
                            <FaCaretDown className="text-[#618596]" size={16} />
                        </NewsOptionBox>
                    </div>
                    <div />
                    <div className="flex gap-8">
                        <NewsOptionBox className="w-fit">Sort By</NewsOptionBox>
                        <NewsOptionBox className="w-fit border-none">Reset</NewsOptionBox>
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
                            <div className="flex flex-col gap-4">
                                {filteredArticles.map((article) => (
                                    <div
                                        key={article._id}
                                        className="w-full h-fit bg-seashell flex items-start gap-6"
                                    >
                                        <div className="relative h-48 aspect-[4/3] grow-0 shrink-0
                                            overflow-hidden flex items-center justify-center">
                                            {article.image ? (
                                                <Image
                                                    src={article.image.url || ""}
                                                    alt={article.image.altText || article.title}
                                                    fill
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-md flex items-center justify-center">
                                                    <FaRegFileImage className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grow basis-0 h-fit py-4 flex flex-col gap-[6px]">
                                            <Link
                                                className="text-2xl font-serif hover:underline line-clamp-1"
                                                href={`/news/article/${article.slug}`}
                                            >
                                                {article.title}
                                            </Link>

                                            <div className="flex items-center gap-1 text-xs uppercase font-semibold">
                                                <div>
                                                    {(article.authorCredit) || "RTF Staff"}
                                                </div>
                                                <>
                                                    <div className="w-1 h-2 border-l border-gray-500" />
                                                    <div>RTF News</div>
                                                </>
                                                {article.publishedAt && (
                                                    <>
                                                        <div className="w-1 h-3 border-l border-gray-500" />
                                                        <div>
                                                            {format(new Date(article.publishedAt), "MMM dd, yyyy")}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <p className="text-md line-clamp-4 pr-2">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
