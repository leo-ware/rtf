"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { parseVideoUrl, getVideoThumbnail, fetchVimeoThumbnail, VideoSource } from "@/lib/videoUtils"
import { Video, AlertCircle } from "lucide-react"
import Image from "next/image"

type VideoPickerDialogProps = {
    isOpen: boolean
    onClose: () => void
    onVideoSelect: (videoData: {
        videoSource: VideoSource
        videoId: string
        videoTitle?: string
        thumbnailUrl?: string
    }) => void
}

export const VideoPickerDialog = ({ isOpen, onClose, onVideoSelect }: VideoPickerDialogProps) => {
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    const [parsedVideo, setParsedVideo] = useState<{ source: VideoSource; videoId: string } | null>(null)
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Parse URL when it changes
    useEffect(() => {
        if (!url.trim()) {
            setParsedVideo(null)
            setThumbnailUrl(null)
            setError(null)
            return
        }

        const parsed = parseVideoUrl(url)
        if (parsed) {
            setParsedVideo(parsed)
            setError(null)

            // Get thumbnail
            const thumbnail = getVideoThumbnail(parsed.source, parsed.videoId)
            setThumbnailUrl(thumbnail)

            // For Vimeo, try to fetch actual thumbnail
            if (parsed.source === "vimeo") {
                fetchVimeoThumbnail(parsed.videoId).then((actualThumbnail) => {
                    if (actualThumbnail) {
                        setThumbnailUrl(actualThumbnail)
                    }
                })
            }
        } else {
            setParsedVideo(null)
            setThumbnailUrl(null)
            setError("Could not parse video URL. Please enter a valid YouTube or Vimeo URL.")
        }
    }, [url])

    const handleSubmit = () => {
        if (!parsedVideo) return

        onVideoSelect({
            videoSource: parsedVideo.source,
            videoId: parsedVideo.videoId,
            videoTitle: title.trim() || undefined,
            thumbnailUrl: thumbnailUrl || undefined,
        })

        // Reset form
        setUrl("")
        setTitle("")
        setParsedVideo(null)
        setThumbnailUrl(null)
        setError(null)
        onClose()
    }

    const handleClose = () => {
        setUrl("")
        setTitle("")
        setParsedVideo(null)
        setThumbnailUrl(null)
        setError(null)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Add Video
                    </DialogTitle>
                    <DialogDescription>
                        Enter a YouTube or Vimeo URL to add a video to the gallery.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="video-url">Video URL</Label>
                        <Input
                            id="video-url"
                            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                    </div>

                    {parsedVideo && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="video-title">Title (optional)</Label>
                                <Input
                                    id="video-title"
                                    placeholder="Enter a title for this video"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Preview</Label>
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    {thumbnailUrl && (
                                        <Image
                                            src={thumbnailUrl}
                                            alt="Video thumbnail"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/50 rounded-full p-3">
                                            <Video className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 capitalize">
                                    Source: {parsedVideo.source}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!parsedVideo}>
                        Add Video
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default VideoPickerDialog
