import { NextRequest, NextResponse } from "next/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ imageId: string }> }
) {
    const { imageId } = await params

    try {
        const image = await fetchQuery(api.images.getImage, {
            id: imageId as Id<"images">,
        })

        if (!image?.url) {
            return new NextResponse("Image not found", { status: 404 })
        }

        const response = await fetch(image.url)
        if (!response.ok) {
            return new NextResponse("Failed to fetch image", { status: 502 })
        }

        const buffer = await response.arrayBuffer()
        const contentType = image.mimeType || response.headers.get("content-type") || "image/jpeg"

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "CDN-Cache-Control": "public, max-age=31536000",
            },
        })
    } catch {
        return new NextResponse("Internal server error", { status: 500 })
    }
}
