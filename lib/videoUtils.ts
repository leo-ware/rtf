export type VideoSource = "youtube" | "vimeo"

export type ParsedVideo = {
    source: VideoSource
    videoId: string
}

/**
 * Parse a video URL to extract the source (YouTube/Vimeo) and video ID
 */
export const parseVideoUrl = (url: string): ParsedVideo | null => {
    // YouTube patterns
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/embed/VIDEO_ID
    // - https://www.youtube.com/v/VIDEO_ID
    const youtubePatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of youtubePatterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            return {
                source: "youtube",
                videoId: match[1],
            }
        }
    }

    // Vimeo patterns
    // - https://vimeo.com/VIDEO_ID
    // - https://player.vimeo.com/video/VIDEO_ID
    const vimeoPatterns = [
        /vimeo\.com\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/,
    ]

    for (const pattern of vimeoPatterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            return {
                source: "vimeo",
                videoId: match[1],
            }
        }
    }

    return null
}

/**
 * Get the thumbnail URL for a YouTube video
 */
export const getYoutubeThumbnail = (videoId: string, quality: "default" | "hq" | "mq" | "sd" | "maxres" = "hq"): string => {
    const qualityMap = {
        default: "default",
        hq: "hqdefault",
        mq: "mqdefault",
        sd: "sddefault",
        maxres: "maxresdefault",
    }
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

/**
 * Get the embed URL for a YouTube video
 */
export const getYoutubeEmbedUrl = (videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Get the embed URL for a Vimeo video
 */
export const getVimeoEmbedUrl = (videoId: string): string => {
    return `https://player.vimeo.com/video/${videoId}`
}

/**
 * Get the embed URL for any video based on source
 */
export const getVideoEmbedUrl = (source: VideoSource, videoId: string): string => {
    if (source === "youtube") {
        return getYoutubeEmbedUrl(videoId)
    }
    return getVimeoEmbedUrl(videoId)
}

/**
 * Fetch Vimeo thumbnail URL via oEmbed API
 * Note: This should be called client-side due to CORS
 */
export const fetchVimeoThumbnail = async (videoId: string): Promise<string | null> => {
    try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`)
        if (!response.ok) return null
        const data = await response.json()
        return data.thumbnail_url || null
    } catch {
        return null
    }
}

/**
 * Get the thumbnail URL for any video
 * For YouTube, returns immediately. For Vimeo, returns a placeholder (use fetchVimeoThumbnail for actual thumbnail)
 */
export const getVideoThumbnail = (source: VideoSource, videoId: string): string => {
    if (source === "youtube") {
        return getYoutubeThumbnail(videoId)
    }
    // Vimeo requires an API call, return a placeholder
    return `https://vumbnail.com/${videoId}.jpg`
}
