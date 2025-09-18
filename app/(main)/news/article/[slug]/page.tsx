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
                                <span>{article.author.name}</span>
                            </div>
                        )}
                        {article.publishedAt && (
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* <p className="text-xl text-gray-600 leading-relaxed">
                        {article.excerpt}
                    </p> */}
                </header>

                {article.imageUrl && (
                    <div className="mb-8">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                )}

                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
                

                {/* <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {children}
                                </p>
                            ),
                            ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
                                    {children}
                                </ol>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">
                                    {children}
                                </blockquote>
                            ),
                            a: ({ href, children }) => (
                                <a
                                    href={href}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {children}
                                </a>
                            ),
                            img: ({ src, alt }) => (
                                <img
                                    src={src}
                                    alt={alt}
                                    className="w-full h-auto rounded-lg shadow-md my-6"
                                />
                            ),
                            table: ({ children }) => (
                                <div className="overflow-x-auto mb-4">
                                    <table className="min-w-full border border-gray-300">
                                        {children}
                                    </table>
                                </div>
                            ),
                            th: ({ children }) => (
                                <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className="border border-gray-300 px-4 py-2">
                                    {children}
                                </td>
                            ),
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </div> */}

                <footer className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            {article.author && (
                                <p className="text-gray-600">
                                    Written by <strong>{article.author.name}</strong>
                                </p>
                            )}
                        </div>
                        <div>
                            <a
                                href="/news"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ← Back to News
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}