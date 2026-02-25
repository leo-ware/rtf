import { cn } from "@/lib/utils"
import { StaticImageData } from "next/image"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"

const WideImage = ({ image, alt, className, imgClassName, authorCredit }: { image: StaticImageData, alt: string, className?: string, imgClassName?: string, authorCredit?: string }) => {
    return (
        <ImageWithAuthorCredit
            src={image}
            alt={alt}
            fill
            className={cn(
                "w-full h-full object-cover object-center",
                imgClassName
            )}
            wrapperClassName={cn("w-full h-[500px] relative", className)}
            authorCredit={authorCredit}
        />
    )
}   

export default WideImage