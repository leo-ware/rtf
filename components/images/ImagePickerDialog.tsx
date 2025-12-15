"use client"

import { useState, useEffect } from "react";
import { ImagePicker } from "./ImagePicker"
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import ConvexImageFromId from "./ConvexImageFromId";

const ImagePickerDialog = ({
    imageId,
    onImageSelect,
    disabled = false,
}: {
    imageId: Id<"images"> | null;
    onImageSelect: (imageId: Id<"images"> | null) => void;
    disabled?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openComputed = !disabled && isOpen;

    useEffect(() => {
        if (disabled) {
            setIsOpen(false);
        }
    }, [disabled]);

    const handleImageSelect = (args: {imageId: Id<"images">, url: string}) => {
        onImageSelect(args.imageId);
    }

    const handleRemoveImage = () => {
        onImageSelect(null);
    }

    return (
        <div>
            <ImagePicker
                isOpen={openComputed}
                onClose={() => setIsOpen(false)}
                onImageSelect={handleImageSelect}
            />
            
                <div className="flex flex-col gap-2">
                {imageId && (
                    <div className="relative h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                        <ConvexImageFromId
                            className="w-full h-full"
                            imageId={imageId} />
                    </div>
                )}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(true)}
                        >
                            Change Selected Image
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRemoveImage}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
        </div>
    )
}

export default ImagePickerDialog;