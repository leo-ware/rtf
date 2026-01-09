import Image, { StaticImageData } from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"
import ConvexImageFromId from "@/components/images/ConvexImageFromId"

type TakeActionLinkProps = {
    title: string
    image?: StaticImageData
    imageId?: Id<"images">
    href?: string
    className?: string
}

const TakeActionLink = ({ title, image, imageId, href, className }: TakeActionLinkProps) => {
    const card = (
        <div className={cn("aspect-[8/7] w-full bg-seashell rounded-md overflow-hidden", className)}>
            <div className="relative w-full h-8/12">
                {imageId ? (
                    <ConvexImageFromId
                        imageId={imageId}
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    image ? (
                        <Image src={image} alt={title} className="w-full h-full object-cover object-center" />
                    ) : null
                )}
            </div>
            <div className="px-6 py-2 w-full h-4/12 flex items-center justify-center">
                <div className="text-2xl font-serif text-pewter text-center">
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