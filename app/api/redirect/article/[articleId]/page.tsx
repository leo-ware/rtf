import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PageProps } from "@/lib/types";
import { fetchQuery } from "convex/nextjs";
import { notFound, redirect } from "next/navigation";

const ArticleRedirectPage = async (props: PageProps<{ articleId: string }>) => {
    const { articleId } = await props.params;
    const article = await fetchQuery(
        api.articles.getArticle,
        { id: articleId as Id<"articles"> }
    )
    if (article === null) {
        return notFound();
    }
    return redirect(`/resources/news/article/${article.slug}`);
}

export default ArticleRedirectPage;