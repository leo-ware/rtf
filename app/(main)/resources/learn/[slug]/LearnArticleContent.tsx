"use client"

import { useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Hero from "@/components/public-ui/Hero"
import HeroImg from "../learn-hero.jpg"
import { ArticleRenderer } from "@/components/ArticleRenderer"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

type LearnArticleContentProps = {
    slug: string
}

const LearnArticleContent = ({ slug }: LearnArticleContentProps) => {
    const article = useQuery(api.educationArticles.getPublicBySlug, { slug })
    const tracked = useRef(false)

    useEffect(() => {
        if (article && !tracked.current) {
            tracked.current = true
            trackEvent(AnalyticsEvents.ARTICLE_VIEWED, {
                type: "learn",
                title: article.title,
                slug,
            })
        }
    }, [article, slug])

    // Redirect to document page if this is a PDF resource
    useEffect(() => {
        if (article?.documentId) {
            window.location.href = `/resources/documents/${article.documentId}`
        }
    }, [article])

    if (article === undefined) {
        return (
            <div className="w-full h-fit">
                <Hero title="Learn" image={HeroImg} />
                <div className="h-fit w-10/12 mx-auto flex flex-col gap-8 py-12">
                    <div className="font-serif text-2xl text-center py-16">
                        Loading...
                    </div>
                </div>
            </div>
        )
    }

    if (article === null) {
        return (
            <div className="w-full h-fit">
                <Hero title="Learn" image={HeroImg} />
                <div className="h-fit w-10/12 mx-auto flex flex-col gap-8 py-12">
                    <div className="font-serif text-2xl text-center py-16">
                        Article not found
                    </div>
                </div>
            </div>
        )
    }

    // If this is a document resource, show loading while redirect happens
    if (article.documentId) {
        return (
            <div className="w-full h-fit">
                <Hero title="Learn" image={HeroImg} />
                <div className="h-fit w-10/12 mx-auto flex flex-col gap-8 py-12">
                    <div className="font-serif text-2xl text-center py-16">
                        Redirecting to document...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-fit">
            <Hero title="Learn" image={HeroImg} />

            <div className="h-fit w-10/12 mx-auto flex flex-col gap-6 py-12">
                <div className="flex flex-col gap-3">
                    <div className="text-[48px] font-serif text-cinnamon leading-tight">
                        {article.title}
                    </div>
                    <div className="text-[20px] text-pewter">
                        {article.description}
                    </div>
                </div>

                <ArticleRenderer
                    content={article.content}
                    className="prose prose-lg max-w-none"
                />
            </div>
        </div>
    )
}

export default LearnArticleContent
