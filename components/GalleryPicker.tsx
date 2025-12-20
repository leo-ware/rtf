"use client"

import { Id } from "@/convex/_generated/dataModel"
import ConvexImage from "@/components/images/ConvexImage"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { ImagePicker } from "@/components/images/ImagePicker"
import { ImageIcon } from "lucide-react"


export type GalleryPickerProps = {
    open: boolean
    image?: { imageId: Id<"images">, url: string }
    onOpen: () => void
    onClose: () => void
    onDelete: () => void
    onImageSelect: (imageData: { imageId: Id<"images">, url: string }) => void
}

const GalleryPicker = (props: GalleryPickerProps) => {
    return (
        <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {props.image ? (
                    <ConvexImage
                        src={props.image.url}
                        alt={`Gallery image`}
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
                <p className="text-sm font-medium">
                    Gallery Image
                </p>
                <p className="text-xs text-gray-500">
                    {props.image ? "Image selected" : "No image selected"}
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={props.onOpen}
                >
                    {props.image ? "Change" : "Select"}
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
                isOpen={props.open}
                onClose={props.onClose}
                onImageSelect={props.onImageSelect}
            />
        </div>
    )
}

export default GalleryPicker