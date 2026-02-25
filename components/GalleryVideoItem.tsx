"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { getVideoEmbedUrl, VideoSource } from "@/lib/videoUtils"

type GalleryVideoItemProps = {
    videoSource: VideoSource
    videoId: string
    videoTitle?: string
    thumbnailUrl?: string
}

const GalleryVideoItem = ({ videoSource, videoId, videoTitle, thumbnailUrl }: GalleryVideoItemProps) => {
    const [isPlaying, setIsPlaying] = useState(false)

    const handlePlay = () => {
        setIsPlaying(true)
    }

    if (isPlaying) {
        return (
            <div className="relative w-full aspect-[16/9]">
                <iframe
                    src={`${getVideoEmbedUrl(videoSource, videoId)}?autoplay=1`}
                    title={videoTitle || "Video"}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        )
    }

    return (
        <div
            className="relative w-full aspect-[16/9] cursor-pointer group"
            onClick={handlePlay}
        >
            {thumbnailUrl ? (
                <Image
                    src={thumbnailUrl}
                    alt={videoTitle || "Video thumbnail"}
                    fill
                    className="object-cover"
                    unoptimized
                />
            ) : (
                <div className="absolute inset-0 bg-gray-200" />
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 group-hover:bg-black/70 rounded-full p-4 transition-colors">
                    <Play className="h-12 w-12 text-white fill-white" />
                </div>
            </div>

            {/* Video title overlay */}
            {videoTitle && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{videoTitle}</p>
                </div>
            )}
        </div>
    )
}

export default GalleryVideoItem
