"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { Id } from "@/convex/_generated/dataModel"
import ImageMetadataEditDialog from "@/components/images/ImageMetadataEditDialog"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useRef, useCallback, useEffect, useState } from "react"

const RESIZE_DIRECTIONS = ["top", "bottom", "left", "right"] as const
type ResizeDirection = (typeof RESIZE_DIRECTIONS)[number]

const MIN_SIZE = 50

const CustomImageView = ({ node, updateAttributes, selected }: NodeViewProps) => {
    const { src, alt, title, width, height } = node.attrs
    const imageId = node.attrs["data-image-id"] as Id<"images"> | null
    const imgRef = useRef<HTMLImageElement>(null)
    const [isResizing, setIsResizing] = useState(false)

    // Toggle is-resizing class on document.body during drag
    useEffect(() => {
        if (isResizing) {
            document.body.classList.add("is-resizing")
        } else {
            document.body.classList.remove("is-resizing")
        }
        return () => {
            document.body.classList.remove("is-resizing")
        }
    }, [isResizing])

    const handleResizeMouseDown = useCallback(
        (e: React.MouseEvent, direction: ResizeDirection) => {
            e.preventDefault()
            e.stopPropagation()

            const img = imgRef.current
            if (!img) return

            const startX = e.clientX
            const startY = e.clientY
            const startWidth = img.offsetWidth
            const startHeight = img.offsetHeight
            const aspectRatio = startWidth / startHeight

            setIsResizing(true)

            const onMouseMove = (moveEvent: MouseEvent) => {
                let newWidth = startWidth
                let newHeight = startHeight

                if (direction === "right" || direction === "left") {
                    const dx = moveEvent.clientX - startX
                    newWidth = direction === "right"
                        ? startWidth + dx
                        : startWidth - dx
                    newWidth = Math.max(MIN_SIZE, newWidth)
                    newHeight = newWidth / aspectRatio
                } else {
                    const dy = moveEvent.clientY - startY
                    newHeight = direction === "bottom"
                        ? startHeight + dy
                        : startHeight - dy
                    newHeight = Math.max(MIN_SIZE, newHeight)
                    newWidth = newHeight * aspectRatio
                }

                newWidth = Math.max(MIN_SIZE, Math.round(newWidth))
                newHeight = Math.max(MIN_SIZE, Math.round(newHeight))

                // Directly mutate style for smooth performance
                img.style.width = `${newWidth}px`
                img.style.height = `${newHeight}px`
            }

            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove)
                document.removeEventListener("mouseup", onMouseUp)
                setIsResizing(false)

                if (img) {
                    const finalWidth = Math.round(parseFloat(img.style.width))
                    const finalHeight = Math.round(parseFloat(img.style.height))
                    updateAttributes({ width: finalWidth, height: finalHeight })
                }
            }

            document.addEventListener("mousemove", onMouseMove)
            document.addEventListener("mouseup", onMouseUp)
        },
        [updateAttributes]
    )

    return (
        <NodeViewWrapper className="relative group inline-block" data-drag-handle>
            <img
                ref={imgRef}
                src={src}
                alt={alt || ""}
                title={title || undefined}
                style={{
                    width: width ? `${width}px` : undefined,
                    height: height ? `${height}px` : undefined,
                }}
                className={selected ? "ring-2 ring-blue-500" : ""}
                draggable={false}
            />
            {imageId && (
                <div
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <ImageMetadataEditDialog imageId={imageId}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/90 hover:bg-white shadow-sm"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </ImageMetadataEditDialog>
                </div>
            )}
            {selected && RESIZE_DIRECTIONS.map((dir) => (
                <div
                    key={dir}
                    data-resize-handle=""
                    data-direction={dir}
                    onMouseDown={(e) => handleResizeMouseDown(e, dir)}
                />
            ))}
        </NodeViewWrapper>
    )
}

export default CustomImageView
