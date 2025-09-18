"use client";

import React, { useState, useRef, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUploaded?: (imageData: {
    imageId: string;
    url: string;
    fileName: string;
    originalName: string;
  }) => void;
  multiple?: boolean;
  accept?: string;
  maxSizeInMB?: number;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
  imageId?: string;
  url?: string;
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
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const [currentFile, setCurrentFile] = useState<UploadingFile | null>(null);
  const [metadata, setMetadata] = useState({
    altText: "",
    description: "",
    tags: "",
    isPublic: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const createImage = useMutation(api.images.createImage);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "File must be an image";
    }

    // Check file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeInMB) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    return null;
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const error = validateFile(file);
      if (error) {
        console.error(`Invalid file ${file.name}: ${error}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // If not multiple, only take the first file
    const filesToUpload = multiple ? validFiles : [validFiles[0]];

    const newUploadingFiles: UploadingFile[] = filesToUpload.map(file => ({
      file,
      progress: 0,
      status: "uploading" as const
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Start uploading each file
    filesToUpload.forEach((file, index) => {
      uploadFile(file, newUploadingFiles.length - filesToUpload.length + index);
    });
  };

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
            const imageId = await createImage({
              storageId,
              fileName: generateFileName(file.name),
              originalName: file.name,
              mimeType: file.type,
              size: file.size,
              width: dimensions.width,
              height: dimensions.height,
              altText: "",
              description: "",
              tags: [],
              isPublic: true,
            });

            // Mark as completed
            setUploadingFiles(prev =>
              prev.map((f, i) =>
                i === fileIndex
                  ? {
                      ...f,
                      status: "completed",
                      imageId,
                      progress: 100
                    }
                  : f
              )
            );

            // For now, we'll use a placeholder URL and let the parent component
            // handle getting the actual URL when needed
            const placeholderUrl = URL.createObjectURL(file);

            // Notify parent component
            if (onImageUploaded && imageId) {
              onImageUploaded({
                imageId: imageId,
                url: placeholderUrl,
                fileName: generateFileName(file.name),
                originalName: file.name,
              });
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
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
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
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(f => f.status !== "completed"));
  };

  const openMetadataDialog = (file: UploadingFile) => {
    setCurrentFile(file);
    setShowMetadataDialog(true);
  };

  const saveMetadata = () => {
    // This would update the image record with metadata
    // Implementation depends on your specific needs
    setShowMetadataDialog(false);
    setCurrentFile(null);
    setMetadata({
      altText: "",
      description: "",
      tags: "",
      isPublic: true
    });
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

          {uploadingFiles.map((file, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
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
                    onClick={() => removeFile(index)}
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

              {file.status === "completed" && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMetadataDialog(file)}
                  >
                    Add Metadata
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Metadata Dialog */}
      <Dialog open={showMetadataDialog} onOpenChange={setShowMetadataDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image Metadata</DialogTitle>
            <DialogDescription>
              Add additional information for better organization and accessibility
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                value={metadata.altText}
                onChange={(e) => setMetadata(prev => ({ ...prev, altText: e.target.value }))}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={metadata.tags}
                onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="horse, wildlife, nature (comma-separated)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={metadata.isPublic}
                onChange={(e) => setMetadata(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isPublic" className="flex items-center space-x-1">
                {metadata.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>Public image</span>
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowMetadataDialog(false)}>
                Skip
              </Button>
              <Button onClick={saveMetadata}>
                Save Metadata
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};