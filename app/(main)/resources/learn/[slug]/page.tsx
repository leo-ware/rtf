"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PageProps } from "@/lib/types"
import Button from "@/components/public-ui/Button"
import HeroImg from "../learn-hero.jpg"
import Hero from "@/components/public-ui/Hero"

const LearnArticlePage = ({ params }: PageProps<{ slug: string }>) => {
    const resolvedParams = use(params)
    const slug = resolvedParams.slug

    const article = useQuery(api.educationArticles.getPublicBySlug, { slug })

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

                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>
        </div>
    )
}

export default LearnArticlePage


