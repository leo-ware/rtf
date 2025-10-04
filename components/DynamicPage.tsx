"use client"

import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { notFound } from "next/navigation"
import ConvexImage from "./ConvexImage"

interface DynamicPageProps {
    slug: string
    category: "about" | "what-we-do" | "learn" | "take-action"
    backLink?: {
        href: string
        text: string
    }
}

export default function DynamicPage({ slug, category, backLink }: DynamicPageProps) {
    const page = useQuery(api.pages.getPageBySlug, { slug })

    // Loading state
    if (page === undefined) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Page not found or not in correct category
    if (!page || page.category !== category || !page.isPublished) {
        notFound()
    }

    const defaultBackLinks = {
        about: { href: "/about", text: "← Back to About" },
        "what-we-do": { href: "/what-we-do", text: "← Back to What We Do" },
        learn: { href: "/learn", text: "← Back to Learn" },
        "take-action": { href: "/take-action", text: "← Back to Take Action" }
    }

    const currentBackLink = backLink || defaultBackLinks[category]

    const categoryTitles = {
        about: "About",
        "what-we-do": "What We Do",
        learn: "Learn",
        "take-action": "Take Action"
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    {page.image && (
                        <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
                            <ConvexImage
                                src={page.image.url}
                                alt={page.image.altText || page.title}
                                width={page.image.width}
                                height={page.image.height}
                            />
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {page.title}
                    </h1>
                </header>

                {/* Content */}
                <main className="prose prose-lg max-w-none">
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </main>
            </div>
        </div>
    )
}
