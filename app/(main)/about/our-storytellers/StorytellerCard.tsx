"use client"

import Image from "next/image"

type StorytellerCardProps = {
    name: string
    title?: string
    bio?: string
    link?: string
    image?: {
        src: string
        alt: string
        width: number
        height: number
    }
}

const StorytellerCard = ({ name, title, bio, link, image }: StorytellerCardProps) => {
    return (
        <div className="group relative aspect-square overflow-hidden rounded-sm bg-stone-200">
            {image ? (
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    loader={({ src }) => src}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-300">
                    <span className="text-stone-500 text-sm">No image</span>
                </div>
            )}

            {/* Hover overlay — warm stone tint, content stacked at top */}
            <div className="absolute inset-0 bg-stone-500/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-6 overflow-hidden">
                <div className="shrink-0 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-2xl font-serif font-bold leading-tight">{name}</h3>
                    {title && (
                        <p className="text-white/85 text-base mt-1">{title}</p>
                    )}
                </div>

                {bio && (
                    <p className="text-white/80 text-sm leading-relaxed mt-4 overflow-y-auto translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">{bio}</p>
                )}

                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-2 text-white text-sm font-bold tracking-wider mt-4 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                    >
                        <span className="hover:underline">READ MORE</span> <span className="text-lg no-underline">&rarr;</span>
                    </a>
                )}
            </div>
        </div>
    )
}

export default StorytellerCard
