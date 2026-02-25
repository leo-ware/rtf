import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { PageProps } from "@/lib/types"
import ArticleContent from "./ArticleContent"

type Props = PageProps<{ slug: string }>

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { slug } = await params
    const article = await fetchQuery(api.articles.getArticleBySlug, { slug })

    if (!article) {
        return {
            title: "Article Not Found | Return to Freedom",
        }
    }

    const title = article.articleMetadata.title
    const description = article.articleMetadata.excerpt || title

    return {
        title: `${title} | Return to Freedom`,
        description,
        openGraph: {
            title: `${title} | Return to Freedom`,
            description,
            type: "article",
            publishedTime: article.articleMetadata.date
                ? new Date(article.articleMetadata.date).toISOString()
                : undefined,
            authors: article.authorNames && article.authorNames.length > 0 ? article.authorNames : (article.authorCredit ? [article.authorCredit] : undefined),
            images: article.image?.url ? [{ url: article.image.url }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Return to Freedom`,
            description,
            images: article.image?.url ? [article.image.url] : [],
        },
    }
}

const ArticlePage = async ({ params }: Props) => {
    const { slug } = await params
    return <ArticleContent slug={slug} />
}

export default ArticlePage
