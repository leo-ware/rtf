"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

export type ConvexImageProps = {
    src: string
    width: number | undefined
    height: number | undefined
    alt: string
    objectFit?: "contain" | "cover"
    className?: string
    authorCredit?: string
    style?: React.CSSProperties
    blurDataUrl?: string | null
}

const ConvexImage: React.FC<ConvexImageProps> = ({ src, width, height, alt, objectFit = "cover", className, authorCredit, style, blurDataUrl }: ConvexImageProps) => {
    const classes = cn("relative group", className)

    return (
        <div className={classes} style={style}>
            {src && src.length > 0 && (
                <Image
                    src={src}
                    width={width}
                    height={height}
                    alt={alt}
                    style={{ objectFit }}
                    className="w-full h-full"
                    {...(blurDataUrl ? { placeholder: "blur", blurDataURL: blurDataUrl } : {})}
                />
            )}
            {authorCredit && (
                <div className="absolute bottom-0 right-0 px-2 py-1 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {authorCredit}
                </div>
            )}
        </div>
    )
}

export default ConvexImage
