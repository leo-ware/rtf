import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { PageProps } from "@/lib/types"
import IndividualHorseContent from "./IndividualHorseContent"

type Props = PageProps<{ horseId: string }>

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { horseId } = await params
    const animal = await fetchQuery(api.animals.getAnimalBySlug, { slug: horseId })

    if (!animal) {
        return {
            title: "Horse Not Found | Return to Freedom",
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

const IndividualHorsePage = async ({ params }: Props) => {
    const { horseId } = await params
    return <IndividualHorseContent horseSlug={horseId} />
}

export default IndividualHorsePage
