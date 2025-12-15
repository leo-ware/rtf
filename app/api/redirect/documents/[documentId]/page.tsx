"use server"

import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { PageProps } from "@/lib/types"
import { Id } from "@/convex/_generated/dataModel"
import { notFound, redirect } from "next/navigation"

const DocumentRedirect = async ({ params }: PageProps<{documentId: string}>) => {
    const { documentId } = await params
    const document = await fetchQuery(api.documents.getDocument, { id: documentId as Id<"documents"> })

    if (document) {
        if (!document.fileUrl) {
            return (
                <div>
                    Error: please try again
                </div>
            )
        }
        return redirect(document.fileUrl)
    } else {
        return notFound()
    }
}

export default DocumentRedirect