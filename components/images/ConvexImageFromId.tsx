import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ConvexImage from "./ConvexImage";

const ConvexImageFromId = ({imageId, className}: {imageId: Id<"images">, className?: string}) => {
    const image = useQuery(api.images.getImage, { id: imageId });
    return (
        <ConvexImage
            src={image?.url || ""}
            alt={image?.altText || image?.title || ""}
            width={image?.width || 0}
            height={image?.height || 0}
            className={className}
        />
    )
}

export default ConvexImageFromId;