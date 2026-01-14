import Image, { StaticImageData } from "next/image"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"


const BlurredImageCard = ({ image, children, className, innerClassName }: { image: StaticImageData, children: ReactNode, className?: string, innerClassName?: string }) => {
    return (
        <div
            className={cn(`
                relative w-full h-fit rounded-[7px] overflow-hidden
                `, className
            )}
        >
            <div
                className="absolute inset-0 -z-10 blur-sm bg-cover bg-center scale-110"
                style={{ backgroundImage: `url(${image.src})` }}
            />
            <div className={cn("w-full h-full", innerClassName)}>
                {children}
            </div>
        </div>
    )
}

export default BlurredImageCard