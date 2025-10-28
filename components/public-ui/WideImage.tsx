import { cn } from "@/lib/utils"
import { StaticImageData } from "next/image"
import Image from "next/image"

const WideImage = ({ image, alt, className, imgClassName }: { image: StaticImageData, alt: string, className?: string, imgClassName?: string }) => {
    return (
        <div className={cn("w-full h-[500px] relative", className)}>
            <Image src={image} alt={alt} fill className={cn(
                "w-full h-full object-cover object-center",
                imgClassName
            )} />
        </div>
    )
}   

export default WideImage