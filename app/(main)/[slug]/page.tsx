import { permanentRedirect, notFound } from "next/navigation"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { PageProps } from "@/lib/types"

/**
 * Catch-all route to handle legacy WordPress blog post URLs.
 * Old WordPress posts were at root level (e.g., /court-grants-wild-horse-advocates/)
 * and need to redirect to /resources/news/article/<slug>
 */
const LegacyBlogRedirectPage = async ({ params }: PageProps<{ slug: string }>) => {
    const { slug } = await params

    // Check if this slug matches an existing article
    const articleExists = await fetchQuery(api.articles.checkSlugExists, { slug })

    if (articleExists) {
        // Redirect to the new article location with 308 permanent redirect
        permanentRedirect(`/resources/news/article/${slug}`)
    }

    // If no article found, show 404
    notFound()
}

export default LegacyBlogRedirectPage
