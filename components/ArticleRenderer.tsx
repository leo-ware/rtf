"use client"

import parse, { HTMLReactParserOptions, Element } from "html-react-parser"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type ArticleRendererProps = {
    content: string
    className?: string
}

// Internal component for rendering images with data-image-id
const ArticleImage = ({
    imageId,
    width,
    imgClassName,
}: {
    imageId: Id<"images">
    width?: string
    imgClassName?: string
}) => {
    const image = useQuery(api.images.getImage, { id: imageId })

    if (!image?.url) {
        return null
    }

    return (
        <figure className="relative group mx-auto" style={{ width: width ? `${width}px` : undefined, maxWidth: "100%" }}>
            <img
                src={image.url}
                alt={image.altText || image.title || ""}
                className={cn(imgClassName, "rounded-lg w-full")}
            />
            {(image.authorNames && image.authorNames.length > 0 ? image.authorNames.join(", ") : image.authorCredit) && (
                <span className="absolute bottom-0 right-0 px-2 py-1 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {image.authorNames && image.authorNames.length > 0 ? image.authorNames.join(", ") : image.authorCredit}
                </span>
            )}
        </figure>
    )
}

export const ArticleRenderer = ({ content, className }: ArticleRendererProps) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === "img") {
                const imageId = domNode.attribs["data-image-id"]
                const src = domNode.attribs.src
                const alt = domNode.attribs.alt
                const imgClassName = domNode.attribs.class

                // Extract width from attributes (TipTap resize)
                const width = domNode.attribs.width

                // If no imageId, render a regular img (legacy content)
                if (!imageId) {
                    return (
                        <figure className="mx-auto" style={{ width: width ? `${width}px` : undefined, maxWidth: "100%" }}>
                            <img
                                src={src}
                                alt={alt || ""}
                                className={cn(imgClassName, "rounded-lg w-full")}
                            />
                        </figure>
                    )
                }

                // Render ArticleImage for images with data-image-id
                return (
                    <ArticleImage
                        imageId={imageId as Id<"images">}
                        width={width}
                        imgClassName={imgClassName}
                    />
                )
            }
        }
    }

    return (
        <div className={className}>
            {parse(content, options)}
        </div>
    )
}
