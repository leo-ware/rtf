import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { PageProps } from "@/lib/types"
import IndividualBurroContent from "./IndividualBurroContent"

type Props = PageProps<{ burroId: string }>

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { burroId } = await params
    const animal = await fetchQuery(api.animals.getAnimalBySlug, { slug: burroId })

    if (!animal) {
        return {
            title: "Burro Not Found | Return to Freedom",
        }
    }

    return {
        title: `${animal.name} | Return to Freedom`,
        description: animal.description,
        openGraph: {
            title: `${animal.name} | Return to Freedom`,
            description: animal.description,
            type: "website",
            images: animal.image?.url ? [{ url: animal.image.url }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${animal.name} | Return to Freedom`,
            description: animal.description,
            images: animal.image?.url ? [animal.image.url] : [],
        },
    }
}

const IndividualBurroPage = async ({ params }: Props) => {
    const { burroId } = await params
    return <IndividualBurroContent burroSlug={burroId} />
}

export default IndividualBurroPage
