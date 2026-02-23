import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { PageProps } from "@/lib/types"
import ProgramGroupContent from "./ProgramGroupContent"

type Props = PageProps<{ programGroupId: string }>

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { programGroupId } = await params
    const programGroup = await fetchQuery(api.programs.getProgramGroupById, {
        id: programGroupId as Id<"programGroups">
    })

    if (!programGroup) {
        return {
            title: "Program Not Found | Return to Freedom",
        }
    }

    return {
        title: `${programGroup.name} | Programs | Return to Freedom`,
        description: programGroup.description,
        openGraph: {
            title: `${programGroup.name} | Programs | Return to Freedom`,
            description: programGroup.description,
            type: "website",
            images: programGroup.image?.url ? [{ url: programGroup.image.url }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${programGroup.name} | Programs | Return to Freedom`,
            description: programGroup.description,
            images: programGroup.image?.url ? [programGroup.image.url] : [],
        },
    }
}

const ProgramGroupPage = async ({ params }: Props) => {
    const { programGroupId } = await params
    return <ProgramGroupContent programGroupId={programGroupId as Id<"programGroups">} />
}

export default ProgramGroupPage
