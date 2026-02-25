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
        <div className={cn("aspect-[8/7] w-full bg-seashell rounded-md overflow-hidden", className)}>
            <div className="relative w-full h-8/12">
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
            <div className="px-6 py-2 w-full h-4/12 flex items-center justify-center">
                <div className="text-2xl font-serif text-pewter text-center line-clamp-3">
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