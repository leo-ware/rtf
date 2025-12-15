import { redirect } from "next/navigation"
import { PageProps } from "@/lib/types"

const DocumentsViewer = async ({ params }: PageProps<{documentId: string}>) => {
    const { documentId } = await params
    return redirect(`/api/redirect/documents/${documentId}`)
}

export default DocumentsViewer