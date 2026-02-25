"use client"

import { Id } from "@/convex/_generated/dataModel"
import ConvexImage from "@/components/images/ConvexImage"
import { Button } from "@/components/ui/button"
import { Trash2, Video, ImageIcon } from "lucide-react"
import { ImagePicker } from "@/components/images/ImagePicker"
import Image from "next/image"

export type GalleryItemType = {
    type: "image"
    galleryItemId: Id<"galleryItems">
    imageId: Id<"images">
    url: string
    altText?: string
} | {
    type: "video"
    galleryItemId: Id<"galleryItems">
    videoSource: "youtube" | "vimeo"
    videoId: string
    videoTitle?: string
    thumbnailUrl?: string
}

export type GalleryItemPickerProps = {
    item: GalleryItemType
    imagePickerOpen: boolean
    onOpenImagePicker: () => void
    onCloseImagePicker: () => void
    onDelete: () => void
    onImageChange: (imageData: { imageId: Id<"images">; url: string }) => void
}

const GalleryItemPicker = (props: GalleryItemPickerProps) => {
    const { item } = props

    if (item.type === "image") {
        return (
            <div className="flex items-center gap-3 flex-1">
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.url ? (
                        <ConvexImage
                            src={item.url}
                            alt={item.altText || "Gallery image"}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        Image
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {item.altText || "No description"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={props.onOpenImagePicker}
                    >
                        Change
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={props.onDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <ImagePicker
                    isOpen={props.imagePickerOpen}
                    onClose={props.onCloseImagePicker}
                    onImageSelect={props.onImageChange}
                />
            </div>
        )
    }

    // Video item
    return (
        <div className="flex items-center gap-3 flex-1">
            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0 relative">
                {item.thumbnailUrl ? (
                    <>
                        <Image
                            src={item.thumbnailUrl}
                            alt={item.videoTitle || "Video thumbnail"}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-1">
                                <Video className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <Video className="h-6 w-6 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video
                    <span className="text-xs text-gray-400 capitalize">({item.videoSource})</span>
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {item.videoTitle || `${item.videoSource} video`}
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={props.onDelete}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default GalleryItemPicker
