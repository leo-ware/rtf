"use client"

import { cn } from "@/lib/utils"
import Image, { ImageProps } from "next/image"

type BaseProps = Omit<ImageProps, "className"> & {
    className?: string
    wrapperClassName?: string
    wrapperStyle?: React.CSSProperties
}

type WithCredit = BaseProps & { authorCredit: string }

/** @deprecated Missing authorCredit — please provide photographer attribution */
type WithoutCredit = BaseProps & { authorCredit?: undefined }

export type ImageWithAuthorCreditProps = WithCredit | WithoutCredit

const ImageWithAuthorCredit = ({ authorCredit, className, wrapperClassName, wrapperStyle, ...imageProps }: ImageWithAuthorCreditProps) => {
    return (
        <div className={cn("relative group", wrapperClassName)} style={wrapperStyle}>
            <Image
                {...imageProps}
                className={cn("w-full h-full", className)}
            />
            {authorCredit && (
                <div className="absolute bottom-0 right-0 px-2 py-1 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {authorCredit}
                </div>
            )}
        </div>
    )
}

export default ImageWithAuthorCredit
