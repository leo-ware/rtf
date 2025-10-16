"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { CalendarIcon, UserIcon } from "lucide-react";

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
    const resolvedParams = React.use(params)
    const article = useQuery(api.articles.getArticleBySlug, {
        slug: resolvedParams.slug,
    });

    if (article === undefined) {
        return (
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="h-64 bg-gray-200 rounded mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (article === null || !article.published) {
        notFound();
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="py-16">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center space-x-6 text-gray-600 mb-6">
                        {article.author && (
                            <div className="flex items-center space-x-2">
                                <UserIcon className="w-4 h-4" />
                                <span>{article.authorCredit}</span>
                            </div>
                        )}
                        {article.publishedAt && (
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                        )}
                    </div>
                </header>

                {article.image && (
                    <div className="mb-8">
                        <img
                            src={article.image.url || ""}
                            alt={article.image.altText || article.title}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg prose-headings:auto max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }} />

            </div>
        </div>
    );
}