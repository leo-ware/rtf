import { ResolvedImageType } from "./types"
import ConvexImage from "./ConvexImage"

type ConvexImageFromResolvedImageProps = {
    image: ResolvedImageType
    className?: string
    style?: React.CSSProperties
    objectFit?: "contain" | "cover"
}

const ConvexImageFromResolvedImage = ({ image, className, style, objectFit }: ConvexImageFromResolvedImageProps) => {
    const authorCredit = image.authorNames && image.authorNames.length > 0
        ? image.authorNames.join(", ")
        : image.authorCredit

    return (
        <ConvexImage
            src={image.url || ""}
            imageId={image._id}
            alt={image.altText || image.title || ""}
            width={image.width || 0}
            height={image.height || 0}
            className={className}
            style={style}
            objectFit={objectFit}
            authorCredit={authorCredit}
            blurDataUrl={image.blurDataUrl}
        />
    )
}

export default ConvexImageFromResolvedImage
