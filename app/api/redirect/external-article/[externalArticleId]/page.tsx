"use server"

import { PageProps } from "@/lib/types";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

const ExternalArticleRedirectPage = async (props: PageProps<{ externalArticleId: string }>) => {
    const { externalArticleId } = await props.params
    const externalLink = await fetchQuery(api.externalArticles.getExternalArticleLink, {
        id: externalArticleId as Id<"externalArticles">,
    });

    if (typeof externalLink === "string") {
        return redirect(externalLink);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">External Article Not Found</h1>
            <p className="text-lg">
                Redirection failed. Reload to retry. If the problem persists, the
                external link may not exist.
            </p>
        </div>
    )
}

export default ExternalArticleRedirectPage;