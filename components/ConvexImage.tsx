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
}

const ConvexImage: React.FC<ConvexImageProps> = ({ src, width, height, alt, objectFit = "cover", className }: ConvexImageProps) => {
    const loader = ({ src }: { src: string }) => {
        return src
    }

    const classes = cn("relative", className)

    return (
        <div className={classes}>
            <Image
                src={src}
                width={width}
                height={height}
                alt={alt}
                style={{ objectFit }}
                className="w-full h-full"
                loader={loader} />
        </div>
    )
}

export default ConvexImage