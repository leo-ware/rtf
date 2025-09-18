"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  Eye,
  EyeOff
} from "lucide-react";

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: { imageId: string; imageUrl: string }) => void;
  title?: string;
  description?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  title = "Select Image",
  description = "Choose an image from your library or upload a new one"
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImageData, setSelectedImageData] = useState<{ imageId: string; imageUrl: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");

  const images = useQuery(api.images.listImages, {
    limit: 50,
    publicOnly: false
  });

  const searchResults = useQuery(
    api.images.searchImages,
    searchTerm
      ? {
          searchTerm,
          limit: 30,
          publicOnly: false,
        }
      : "skip"
  );

  const displayImages = searchTerm && searchResults ? searchResults : images || [];

  const handleImageSelect = (imageId: string, imageUrl: string) => {
    setSelectedImageData({ imageId, imageUrl });
  };

  const handleConfirmSelection = () => {
    if (selectedImageData) {
      onImageSelect(selectedImageData);
      onClose();
      setSelectedImageData(null);
      setSearchTerm("");
    }
  };

  const handleUploadComplete = (imageData: { url: string; imageId: string }) => {
    // Auto-select newly uploaded image
    setSelectedImageData({ imageId: imageData.imageId, imageUrl: imageData.url });
    setActiveTab("library");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[60vh]">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
            <Button
              variant={activeTab === "library" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("library")}
              className="flex-1"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Library
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("upload")}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>

          {activeTab === "library" ? (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Image Grid */}
              <div className="flex-1 overflow-y-auto">
                {displayImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {displayImages.map((image) => (
                      <div
                        key={image._id}
                        className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImageData?.imageId === image._id
                            ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        onClick={() => handleImageSelect(image._id, image.url || "")}
                      >
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={image.altText || image.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}

                        {/* Selection Indicator */}
                        {selectedImageData?.imageId === image._id && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-blue-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}

                        {/* Privacy Badge */}
                        <div className="absolute top-1 left-1">
                          <Badge
                            variant={image.isPublic ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {image.isPublic ? (
                              <Eye className="h-2 w-2" />
                            ) : (
                              <EyeOff className="h-2 w-2" />
                            )}
                          </Badge>
                        </div>

                        {/* Image Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                          <p className="text-xs truncate">{image.originalName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ImageIcon className="h-12 w-12 mb-4" />
                    <p className="text-center">
                      {searchTerm
                        ? "No images found matching your search"
                        : "No images in your library yet"}
                    </p>
                    {!searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("upload")}
                        className="mt-2"
                      >
                        Upload your first image
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1">
              <ImageUpload
                onImageUploaded={handleUploadComplete}
                multiple={false}
                maxSizeInMB={10}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedImageData}
            >
              Select Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};