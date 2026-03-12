"use client"

import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { useState } from "react"
import Input from "@/components/public-ui/form/Input"
import Select, { SelectOption } from "@/components/public-ui/form/Select"
import HeroImg from "../learn-hero.jpg"
import { FaSearch } from "react-icons/fa"
import Button from "@/components/public-ui/Button"
import { Loader2 } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"

export default function EducationArticlesPage() {
    const [searchTerm, setSearchTerm] = useState<string | null>(null)
    const [superGroup, setSuperGroup] = useState<SelectOption<Id<"educationArticleSuperGroups"> | undefined> | null>(null)
    const [group, setGroup] = useState<SelectOption<Id<"educationArticleGroups"> | undefined> | null>(null)

    const groupsAndSuperGroups = useQuery(api.education.getGroupsAndSuperGroups)

    const superGroupOptions: SelectOption<Id<"educationArticleSuperGroups"> | undefined>[] = [
        { label: "All", value: undefined },
        ...(groupsAndSuperGroups?.superGroups.map(sg => ({
            label: sg.title,
            value: sg._id,
        })) ?? []),
    ]

    const groupOptions: SelectOption<Id<"educationArticleGroups"> | undefined>[] = [
        { label: "All", value: undefined },
        ...(groupsAndSuperGroups?.groups
            .filter(g => !superGroup?.value || g.superGroupId === superGroup.value)
            .map(g => ({
                label: g.title,
                value: g._id,
            })) ?? []),
    ]

    const handleSuperGroupChange = (option: SelectOption<Id<"educationArticleSuperGroups"> | undefined> | null) => {
        setSuperGroup(option)
        // Reset group if it doesn't belong to the new supergroup
        if (option?.value && group?.value) {
            const currentGroup = groupsAndSuperGroups?.groups.find(g => g._id === group.value)
            if (currentGroup && currentGroup.superGroupId !== option.value) {
                setGroup(null)
            }
        }
    }

    const resetSearch = () => {
        setSearchTerm(null)
        setSuperGroup(null)
        setGroup(null)
    }

    const { results: articles, loadMore, status } = usePaginatedQuery(
        api.education.searchArticles,
        {
            query: searchTerm || undefined,
            groupId: group?.value ?? undefined,
            superGroupId: !group?.value ? (superGroup?.value ?? undefined) : undefined,
        },
        { initialNumItems: 20 }
    )

    const filteredArticles = articles || []

    return (
        <div className="w-full h-fit">
            <div className="w-full h-[500px] relative flex items-center justify-center bg-sage-green">
                <ImageWithAuthorCredit
                    src={HeroImg}
                    alt="Education Articles Hero"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
                    fill
                    wrapperClassName="z-0 absolute top-0 left-0 w-full h-full"
                />
                <div className="z-10 p-4 text-white text-6xl font-serif">
                    Education Articles
                </div>
            </div>

            <div className="h-fit w-10/12 mx-auto flex flex-col gap-8 py-8">
                {/* Search */}
                <div className="w-full h-10 flex justify-between gap-8">
                    <div className="w-1/3">
                        <Input
                            value={searchTerm ?? ""}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            icon={
                                <FaSearch
                                    className="text-pewter shrink-0 w-full"
                                    size={16}
                                />
                            }
                        />
                    </div>
                    <div className="flex gap-4">
                        <Select
                            placeholder="Category"
                            containerClassName="w-72"
                            options={superGroupOptions}
                            selectedValue={superGroup ?? null}
                            onSelect={handleSuperGroupChange}
                        />
                        <Select
                            placeholder="Topic"
                            options={groupOptions}
                            selectedValue={group ?? null}
                            onSelect={setGroup}
                        />
                        <div
                            className="h-full w-fit min-w-fit flex items-center justify-between gap-2 py-1 px-2 rounded-sm
                                border-2 border-[#618596] text-[#618596] uppercase font-semibold text-sm cursor-pointer"
                            onClick={resetSearch}
                        >
                            Reset
                        </div>
                    </div>
                </div>

                {/* Articles */}
                <div className="w-full h-fit min-h-[400px]">
                    {filteredArticles.length === 0 ? (
                        <div className="font-serif text-2xl text-center py-16">
                            {status === "LoadingFirstPage"
                                ? "Loading..."
                                : "No articles found"}
                        </div>
                    ) : (
                        <div className="w-full h-fit min-h-[400px] flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-4">
                                {filteredArticles.map((article) => (
                                    <div
                                        key={article._id}
                                        className="w-full bg-gray-50 p-8 flex flex-col gap-2"
                                    >
                                        {article.documentUrl ? (
                                            <a
                                                href={article.documentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-lg font-serif"
                                            >
                                                {article.title}
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/resources/learn/${article.slug ?? article._id}`}
                                                className="text-lg font-serif"
                                            >
                                                {article.title}
                                            </Link>
                                        )}
                                        {(article.superGroupTitle || article.groupTitle) && (
                                            <div className="text-sm uppercase font-semibold text-[#618596]">
                                                {[article.superGroupTitle, article.groupTitle]
                                                    .filter(Boolean)
                                                    .join(" > ")}
                                            </div>
                                        )}
                                        <div className="text-sm line-clamp-4">
                                            {article.description}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!["LoadingFirstPage", "Exhausted"].includes(status) && (
                                <Button
                                    onClick={() => loadMore(50)}
                                    color={status === "Exhausted" ? "gray-100" : "cinnamon"}
                                >
                                    {status === "CanLoadMore" && "Load More"}
                                    {status === "LoadingMore" && (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading...
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
