import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { PageProps } from "@/lib/types"
import LearnArticleContent from "./LearnArticleContent"

type Props = PageProps<{ slug: string }>

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { slug } = await params
    const article = await fetchQuery(api.educationArticles.getPublicBySlug, { slug })

    if (!article) {
        return {
            title: "Article Not Found | Return to Freedom",
        }
    }

    return {
        title: `${article.title} | Learn | Return to Freedom`,
        description: article.description,
        openGraph: {
            title: `${article.title} | Learn | Return to Freedom`,
            description: article.description,
            type: "article",
        },
        twitter: {
            card: "summary",
            title: `${article.title} | Learn | Return to Freedom`,
            description: article.description,
        },
    }
}

const LearnArticlePage = async ({ params }: Props) => {
    const { slug } = await params
    return <LearnArticleContent slug={slug} />
}

export default LearnArticlePage
