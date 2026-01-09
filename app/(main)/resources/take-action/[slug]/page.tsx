"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { notFound } from "next/navigation"
import { PageProps } from "@/lib/types"
import ConvexImageFromId from "@/components/images/ConvexImageFromId"
import Image from "next/image"
import FallbackImage from "@/components/images/take-action-1.jpg"

const TakeActionArticlePage = ({ params }: PageProps<{ slug: string }>) => {
    const resolvedParams = use(params)
    const article = useQuery(api.takeActionArticle.getTakeActionArticleBySlug, {
        slug: resolvedParams.slug,
    })

    if (article === undefined) {
        return (
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (article === null) {
        notFound()
    }

    return (
        <div className="py-16">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-8">
                    <h1 className="text-4xl font-serif mb-4">
                        {article.title}
                    </h1>
                    <div className="text-gray-700 text-lg">
                        {article.description}
                    </div>
                </header>

                <div className="mb-8">
                    <div className="max-w-full max-h-[400px] aspect-video mx-auto rounded-lg overflow-hidden bg-gray-100">
                        {article.imageId ? (
                            <ConvexImageFromId
                                imageId={article.imageId}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Image
                                src={FallbackImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>
        </div>
    )
}

export default TakeActionArticlePage


