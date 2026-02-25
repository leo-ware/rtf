"use client";

import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Upload,
    X,
    Image as ImageIcon,
    Check,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils"
import ConvexImage from "./ConvexImage";
import MetadataEditorDialog from "./ImageMetadataEditDialog";
import { ResolvedImageType } from "./types";

interface ImageUploadProps {
    onImageUploaded?: (imageData: ResolvedImageType) => void;
    multiple?: boolean;
    accept?: string;
    maxSizeInMB?: number;
    className?: string;
}

interface UploadingFile {
    file: File;
    progress: number;
    status: "uploading" | "processing" | "completed" | "error" | "hidden"
    error?: string;
    image?: ResolvedImageType;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageUploaded,
    multiple = true,
    accept = "image/*",
    maxSizeInMB = 10,
    className
}) => {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [dragOver, setDragOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const generateUploadUrl = useMutation(api.images.generateUploadUrl);
    const createImage = useMutation(api.images.createImage);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFiles(files);
    };

    // validate the files and queue the uploads with `uploadFile`
    const handleFiles = (files: File[]) => {
        if (files.length === 0) return;

        const uploadObjects = files.map(file => {
            let validationError: string | null = null
            const allowedTypes = accept.split(",").map(t => t.trim())
            if (!allowedTypes.includes(file.type)) {
                const friendlyTypes = allowedTypes
                    .map(t => t.replace("image/", "").toUpperCase())
                    .join(" or ")
                validationError = `Only ${friendlyTypes} files are allowed`
            }
            // Check file size
            const sizeInMB = file.size / (1024 * 1024);
            if (sizeInMB > maxSizeInMB) {
                validationError = `File size must be less than ${maxSizeInMB}MB`;
            }

            const upload: UploadingFile = {
                file,
                progress: 0,
                status: validationError ? "error" : "uploading",
                error: validationError || undefined
            }
            return upload;
        })

        const prevNumUploads = uploadingFiles.length;
        setUploadingFiles(prev => [...prev, ...uploadObjects]);

        // Start uploading each file
        uploadObjects.forEach((object, index) => {
            if (object.status === "uploading") {
                uploadFile(
                    object.file,
                    prevNumUploads + index
                )
            }
        });
    };

    // upload a single file, updating the ui with progress indicators
    const uploadFile = async (file: File, fileIndex: number) => {
        try {
            // Generate upload URL
            const uploadUrl = await generateUploadUrl();

            // Upload file with progress tracking
            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadingFiles(prev =>
                        prev.map((f, i) =>
                            i === fileIndex ? { ...f, progress } : f
                        )
                    );
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    setUploadingFiles(prev =>
                        prev.map((f, i) =>
                            i === fileIndex ? { ...f, status: "processing" } : f
                        )
                    );

                    try {
                        const result = await fetch(uploadUrl, {
                            method: "POST",
                            body: file,
                        });

                        if (!result.ok) {
                            throw new Error("Upload failed");
                        }

                        const { storageId } = await result.json();

                        // Get image dimensions
                        const dimensions = await getImageDimensions(file);

                        // Create image record
                        const imageData = await createImage({
                            storageId,
                            fileName: generateFileName(file.name),
                            originalName: file.name,
                            mimeType: file.type,
                            size: file.size,
                            width: dimensions.width,
                            height: dimensions.height,
                            altText: "",
                            title: generateFileName(file.name)
                        });

                        // Mark as completed
                        setUploadingFiles(prev =>
                            prev.map((f, i) =>
                                i === fileIndex
                                    ? {
                                        ...f,
                                        status: "completed",
                                        url: imageData.url,
                                        progress: 100,
                                        image: imageData
                                    }
                                    : f
                            )
                        );

                        // Notify parent component
                        if (onImageUploaded && imageData) {
                            onImageUploaded(imageData);
                        }

                    } catch (error) {
                        console.error("Error creating image record:", error);
                        setUploadingFiles(prev =>
                            prev.map((f, i) =>
                                i === fileIndex
                                    ? {
                                        ...f,
                                        status: "error",
                                        error: "Failed to save image record"
                                    }
                                    : f
                            )
                        );
                    }
                } else {
                    throw new Error(`Upload failed with status ${xhr.status}`);
                }
            };

            xhr.onerror = () => {
                setUploadingFiles(prev =>
                    prev.map((f, i) =>
                        i === fileIndex
                            ? {
                                ...f,
                                status: "error",
                                error: "Upload failed"
                            }
                            : f
                    )
                );
            };

            xhr.open("POST", uploadUrl);
            xhr.send(file);

        } catch (error) {
            console.error("Upload error:", error);
            setUploadingFiles(prev =>
                prev.map((f, i) =>
                    i === fileIndex
                        ? {
                            ...f,
                            status: "error",
                            error: "Failed to start upload"
                        }
                        : f
                )
            );
        }
    };

    const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve({ width: 0, height: 0 });
            };
            img.src = url;
        });
    };

    const generateFileName = (originalName: string): string => {
        const timestamp = Date.now();
        const extension = originalName.split(".").pop() || "";
        const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
        const cleanName = nameWithoutExtension.replace(/[^a-zA-Z0-9]/g, "_");
        return `${cleanName}_${timestamp}.${extension}`;
    };

    const removeFile = (index: number) => {
        setUploadingFiles(prev => prev.map((f, i) => {
            if (i === index) {
                return { ...f, status: "hidden" };
            }
            return f;
        }));
    };

    const clearCompleted = () => {
        setUploadingFiles(prev => prev.map((f) => {
            if (f.status === "completed") {
                return { ...f, status: "hidden" };
            }
            return f;
        }));
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Upload Area */}
            <div
                className={cn(
                    "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-gray-400",
                    dragOver && "border-blue-500 bg-blue-50"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop images here or click to upload
                </p>
                <p className="text-sm text-gray-600">
                    {accept} files up to {maxSizeInMB}MB
                    {multiple && " (multiple files supported)"}
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="hidden"
                />
            </div>

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">
                            Uploading {uploadingFiles.length} file{uploadingFiles.length !== 1 ? "s" : ""}
                        </h3>
                        {uploadingFiles.some(f => f.status === "completed") && (
                            <Button variant="outline" size="sm" onClick={clearCompleted}>
                                Clear Completed
                            </Button>
                        )}
                    </div>

                    {uploadingFiles.map((file, index) => file.status !== "hidden" && (
                        <UploadingFileWidget
                            key={index}
                            file={file}
                            remove={() => removeFile(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const UploadingFileWidget = ({ file, remove }: { file: UploadingFile, remove: () => void }) => {
    return (
        <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="h-full aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {file.image && file.image.url
                        ? (
                            <ConvexImage
                                className="object-cover w-full h-full"
                                src={file.image.url}
                                alt={file.image.altText || file.image.title || file.file.name}
                                width={file.image.width || 0}
                                height={file.image.height || 0}
                                {...file.image}/>
                        )
                        : (
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                        )
                    }
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        {file.status === "completed" ? (
                            <Check className="h-5 w-5 text-green-500" />
                        ) : file.status === "error" ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                            <Upload className="h-5 w-5 text-blue-500" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Badge
                        variant={
                            file.status === "completed"
                                ? "default"
                                : file.status === "error"
                                    ? "destructive"
                                    : "secondary"
                        }
                    >
                        {file.status}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={remove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {file.status === "uploading" && (
                <Progress value={file.progress} className="w-full" />
            )}

            {file.status === "error" && file.error && (
                <p className="text-sm text-red-600 mt-1">{file.error}</p>
            )}

            {(file.status === "completed" && file.image) && (
                <MetadataEditorDialog imageId={file.image._id}>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        Add Metadata
                    </Button>
                </MetadataEditorDialog>
            )}
        </div>
    )
}
