"use client"

import Header from "./public-ui/Header"
import { Fragment } from "react/jsx-runtime"
import Tabs from "./public-ui/Tabs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"

const EducationResourcesWidget = () => {
    const tree = useQuery(api.education.getEducationTree, { includePrivate: false })

    if (!tree || tree.superGroups.length === 0) {
        return null
    }

    return (
        <div className="w-full flex flex-col items-center justify-center gap-8">
            <Header className="text-sage-green mx-auto underline">
                Resources
            </Header>
            <p className="w-full md:w-8/12 -mt-2 text-left md:text-center text-lg md:text-xl text-ink">
                Articles, guides, and educational materials to deepen your understanding of wild horse conservation and advocacy.
            </p>

            <Link
                href="/resources/learn/articles"
                className="text-cinnamon font-semibold text-lg hover:underline"
            >
                See all resources →
            </Link>

            <Tabs className="w-full" items={tree?.superGroups
                .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
                .map(superGroup => ({
                    id: superGroup._id,
                    title: superGroup.title,
                    content: (
                        <div className="w-full">
                            <Header level={2} className="text-pewter mx-auto underline">
                                {superGroup.title}
            </Header>
            <div className="md:grid my-6 gap-16" style={{ gridTemplateColumns: "300px 1fr" }}>
                                {superGroup.groups.map((group) => (
                                    <Fragment key={group._id}>
                        <div
                            className="pb-4 w-full flex items-start justify-start">
                            <div className="text-[36px] font-serif text-cinnamon">
                                                {group.title}
                            </div>
                        </div>
                                        <div className="pb-8 flex flex-col gap-4 text-[20px]">
                                            {group.articles.map((article) => (
                                                <div key={article._id}>
                                                    <div className="underline">
                                                        {article.slug ? (
                                                            <Link href={`/resources/learn/${article.slug}`} className="hover:text-cinnamon">
                                                                {article.title}
                                                            </Link>
                                                        ) : (
                                                            article.title
                                                        )}
                                    </div>
                                                    <div>
                                                        {article.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    )
                }))} />
    </div>
    )
}

export default EducationResourcesWidget