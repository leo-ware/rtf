import React from 'react'

interface VimeoProps {
    videoId: string
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
    title?: string
    className?: string
    aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9'
}

const Vimeo: React.FC<VimeoProps> = ({
    videoId,
    autoplay = false,
    loop = false,
    muted = false,
    controls = true,
    title = 'Vimeo video',
    className = '',
    aspectRatio = '16:9'
}) => {
    // Build the Vimeo URL with parameters
    const buildVimeoUrl = () => {
        const baseUrl = `https://player.vimeo.com/video/${videoId}`
        const params = new URLSearchParams()

        if (autoplay) params.append('autoplay', '1')
        if (loop) params.append('loop', '1')
        if (muted) params.append('muted', '1')
        if (!controls) params.append('controls', '0')

        const queryString = params.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
    }

    // Get aspect ratio classes
    const getAspectRatioClass = () => {
        const ratios = {
            '16:9': 'aspect-video',
            '4:3': 'aspect-[4/3]',
            '1:1': 'aspect-square',
            '21:9': 'aspect-[21/9]'
        }

        return ratios[aspectRatio]
    }

    return (
        <div className={`relative w-full overflow-hidden ${getAspectRatioClass()} ${className}`}>
            <iframe
                src={buildVimeoUrl()}
                title={title}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        </div>
    )
}

export default Vimeo
