import { StaticImageData } from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import ConvexImage from "./images/ConvexImage"
import ImageWithAuthorCredit from "./images/ImageWithAuthorCredit"
import { ResolvedImageType } from "@/lib/types"

type TakeActionLinkProps = {
    title: string
    image?: ResolvedImageType | null
    fallbackImage?: StaticImageData
    href?: string
    className?: string
}

const TakeActionLink = ({ title, fallbackImage, image, href, className }: TakeActionLinkProps) => {
    const authorCredit = image?.authorCredit

    const card = (
        <div className={cn("aspect-[8/7] w-full rounded-md overflow-hidden relative group", className)}>
            <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                {(image && image.url) ? (
                    <ConvexImage
                        src={image.url}
                        alt={title}
                        width={image.width}
                        height={image.height}
                        className="w-full h-full object-cover object-center"
                        authorCredit={authorCredit}
                    />
                ) : (
                fallbackImage ? (
                    <ImageWithAuthorCredit
                        src={fallbackImage}
                        alt={title}
                        className="w-full h-full object-cover object-center" />
                ) : null
                )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-12 pb-4">
                <div className="text-2xl font-serif text-white text-left line-clamp-3">
                    {title}
                </div>
            </div>
        </div>
    )

    if (!href) {
        return card
    }

    return (
        <Link href={href} className="block w-full">
            {card}
        </Link>
    )
}

export default TakeActionLink