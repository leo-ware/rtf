import Image, { StaticImageData } from "next/image"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"


const BlurredImageCard = ({image, children, className, innerClassName}: {image: StaticImageData, children: ReactNode, className?: string, innerClassName?: string}) => {
    return (
        <div className={cn(
            "relative w-full h-fit flex flex-col items-center justify-center gap-4 rounded-[7px] overflow-hidden",
            className,
        )}>
            <Image
                className="scale-120 absolute blur-sm z-0 top-0 left-0 w-full h-full object-cover object-center"
                src={image}
                alt={"Card background image"} />
            <div className={cn(
                "relative z-10 w-full h-full",
                innerClassName
                )}>
                {children}
            </div>
        </div>
    )
}

export default BlurredImageCard