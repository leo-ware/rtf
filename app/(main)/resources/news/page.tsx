"use client"

import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import React, { useState, useEffect, useRef, useMemo } from "react"
import Input from "@/components/public-ui/form/Input"
import Select, { SelectOption } from "@/components/public-ui/form/Select"
import NewsHeroImage from "./news-hero-image.jpg"
import { cn, formatDate } from "@/lib/utils"
import { FaSearch } from "react-icons/fa"
import ConvexImage from "@/components/images/ConvexImage"
import { ChevronRight, ExternalLink, Loader2 } from "lucide-react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import { TagBadges } from "@/components/public-ui/TagBadges"
import { Id } from "@/convex/_generated/dataModel"
import { TopicNameType } from "@/convex/models/articleMetadataManager"
import MultiCheckboxDropdown from "@/components/public-ui/form/MultiCheckboxDropdown"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FaCaretDown } from "react-icons/fa6"


const NewsOptionBox = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
    <div
        {...props}
        className={cn(
            `h-full w-fit min-w-fit flex items-center justify-between gap-2 py-1 px-2 rounded-sm
            border-2 border-[#618596] text-[#618596] uppercase font-semibold text-sm`,
            props.className
        )}
    />
)

export default function NewsPage() {

    const [showFilters, setShowFilters] = useState(false)
    const [searchTerm, setSearchTerm] = useState<string | null>(null)
    const [external, setExternal] = useState<SelectOption<boolean | undefined> | null>(null)
    const [selectedTags, setSelectedTags] = useState<Id<"tags">[]>([])
    const [selectedTopics, setSelectedTopics] = useState<TopicNameType[]>([])
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    const availableTopics = useQuery(api.articleMetadata.listTopics)
    const availableTags = useQuery(api.tags.list)

    const combinedFilterItems = [
        ...(availableTopics ?? []).map(t => ({ label: t.name, value: t._id, sectionLabel: "Topics" })),
        ...(availableTags ?? []).map(t => ({ label: t.name, value: t._id, sectionLabel: "Tags" })),
    ]
    const topicValueSet = new Set<string>((availableTopics ?? []).map(t => t._id))
    const combinedSelectedValues = [...selectedTopics, ...(selectedTags as string[])]
    const handleCombinedFilterChange = (vals: string[]) => {
        setSelectedTopics(vals.filter(v => topicValueSet.has(v)) as TopicNameType[])
        setSelectedTags(vals.filter(v => !topicValueSet.has(v)) as Id<"tags">[])
    }

    const resetSearch = () => {
        setSearchTerm(null)
        setExternal(null)
        setSelectedTags([])
        setSelectedTopics([])
        setStartDate("")
        setEndDate("")
    }

    const hasTags = selectedTags.length > 0
    const hasTopics = selectedTopics.length > 0 || !!searchTerm

    // Paginated query — used for all articles and topic/text filtering (branches A and C)
    const { results: topicResults, loadMore: loadMoreTopics, status: topicStatus } = usePaginatedQuery(
        api.articleMetadata.search,
        {
            publicOnly: true,
            query: searchTerm || undefined,
            external: external?.value ?? undefined,
            topics: selectedTopics.length > 0 ? selectedTopics : undefined,
            dateMin: startDate ? new Date(startDate).getTime() : undefined,
            dateMax: endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : undefined,
        },
        { initialNumItems: 20 }
    )

    // Non-paginated reverse-lookup query — used when tags are selected (branch B and C)
    const tagResults = useQuery(
        api.articleMetadata.getForTags,
        hasTags ? {
            tagIds: selectedTags,
            publicOnly: true,
            external: external?.value ?? undefined,
            dateMin: startDate ? new Date(startDate).getTime() : undefined,
            dateMax: endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : undefined,
        } : "skip"
    )

    // Client-side display count for tag-only fake pagination (branch B)
    const [tagDisplayCount, setTagDisplayCount] = useState(20)
    useEffect(() => {
        setTagDisplayCount(20)
    }, [selectedTags, selectedTopics, searchTerm, startDate, endDate, external])

    // Merge results based on active filter branches
    const displayedArticles = useMemo(() => {
        // Branch A: no tags — show paginated topic/text results
        if (!hasTags) return topicResults ?? []

        // Branch B: tags only (no topics/text) — fake pagination over tag results
        if (!hasTopics) return (tagResults ?? []).slice(0, tagDisplayCount)

        // Branch C: both tags + topics/text — merge-sort by date, deduplicate
        const seen = new Set<string>()
        const tags = tagResults ?? []
        const topics = topicResults ?? []
        const merged: typeof tags = []
        let ti = 0
        let pi = 0
        while (ti < tags.length || pi < topics.length) {
            const tDate = tags[ti]?.date ?? -Infinity
            const pDate = topics[pi]?.date ?? -Infinity
            const item = tDate >= pDate ? tags[ti++] : topics[pi++]
            if (!seen.has(item._id)) {
                seen.add(item._id)
                merged.push(item)
            }
        }
        return merged
    }, [hasTags, hasTopics, tagResults, topicResults, tagDisplayCount])

    // Auto-load when paginated query returns 0 results (branch A only)
    useEffect(() => {
        if (!hasTags && topicStatus === "CanLoadMore" && displayedArticles.length === 0) {
            loadMoreTopics(50)
        }
    }, [hasTags, topicStatus, displayedArticles.length, loadMoreTopics])

    // Infinite scroll observer
    const observerTarget = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return
                if (!hasTags && topicStatus === "CanLoadMore") {
                    // Branch A: load more from paginated query
                    loadMoreTopics(20)
                } else if (hasTags && !hasTopics) {
                    // Branch B: advance client-side display count
                    const total = tagResults?.length ?? 0
                    if (tagDisplayCount < total) {
                        setTagDisplayCount(c => c + 20)
                    }
                } else if (hasTags && hasTopics && topicStatus === "CanLoadMore") {
                    // Branch C: load more topics so merge can extend
                    loadMoreTopics(20)
                }
            },
            { threshold: 0.1 }
        )
        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }
        return () => observer.disconnect()
    }, [hasTags, hasTopics, topicStatus, loadMoreTopics, tagResults, tagDisplayCount])

    const isLoading =
        (hasTags && tagResults === undefined) ||
        ((!hasTags || hasTopics) && topicStatus === "LoadingFirstPage")

    const isExhausted = hasTags && !hasTopics
        ? tagDisplayCount >= (tagResults?.length ?? 0)
        : topicStatus === "Exhausted"

    const showSentinel = !isExhausted

    return (
        <div className="w-full h-fit">
            <div className="w-full h-[500px] relative flex items-center justify-center bg-sage-green">
                <ImageWithAuthorCredit
                    src={NewsHeroImage}
                    alt="News Hero"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
                    fill
                    wrapperClassName="z-0 absolute top-0 left-0 w-full h-full"
                />
                <div className="z-10 p-4 text-white text-6xl font-serif">
                    News
                </div>
            </div>

            <div className="h-fit w-10/12 mx-auto flex flex-col gap-8 py-8">
                {/* Search */}
                <div className="flex flex-col gap-3">
                    {/* Desktop: single row | Tablet: two rows | Phone: search + toggle */}
                    <div className="w-full flex flex-col lg:flex-row gap-3">
                        <div className="w-full lg:w-[300px] lg:mr-auto">
                            <Input
                                value={searchTerm ?? ""}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search"
                                containerClassName="pr-3"
                                icon={
                                    <FaSearch
                                        className="text-pewter shrink-0 w-full"
                                        size={16} />
                                }
                            />
                        </div>
                        {/* Phone: Options toggle button */}
                        <button
                            className="md:hidden flex items-center gap-1 text-sm font-semibold text-pewter uppercase"
                            onClick={() => setShowFilters(f => !f)}
                        >
                            <ChevronRight className={cn("w-4 h-4 transition-transform", showFilters && "rotate-90")} />
                            Options
                        </button>
                        {/* Filters: always visible on md+, toggled on phone */}
                        <div className={cn(
                            "w-full lg:w-auto flex flex-wrap lg:flex-nowrap gap-3 items-center",
                            showFilters ? "flex" : "hidden md:flex"
                        )}>
                            <Select
                                placeholder="Source"
                                containerClassName="w-[100px]"
                                options={[
                                    { label: "All", value: undefined },
                                    { label: "RTF", value: false },
                                    { label: "External", value: true },
                                ]}
                                selectedValue={external ?? null}
                                onSelect={setExternal}
                            />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="h-10 w-[130px] border-2 border-pewter rounded-sm px-2 flex items-center justify-between cursor-pointer bg-white shrink-0">
                                        <span className="uppercase text-sm font-semibold text-pewter truncate">
                                            {startDate || endDate ? `${startDate ? startDate.slice(5) : "…"} – ${endDate ? endDate.slice(5) : "…"}` : "Date"}
                                        </span>
                                        <FaCaretDown size={14} className="text-pewter shrink-0 ml-1" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-3 border-2 border-pewter rounded-sm shadow-md"
                                    align="start"
                                    sideOffset={4}
                                    avoidCollisions={false}
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold uppercase text-pewter/60 tracking-wider">From</span>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                max={endDate || undefined}
                                                className="h-9 border-2 border-pewter rounded-sm px-2 text-sm font-semibold text-pewter bg-white"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold uppercase text-pewter/60 tracking-wider">To</span>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                min={startDate || undefined}
                                                className="h-9 border-2 border-pewter rounded-sm px-2 text-sm font-semibold text-pewter bg-white"
                                            />
                                        </div>
                                        {(startDate || endDate) && (
                                            <button
                                                className="mt-1 text-xs font-bold uppercase text-pewter/50 hover:text-pewter tracking-wider text-right"
                                                onClick={() => { setStartDate(""); setEndDate("") }}
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <div className="w-[150px]">
                                <MultiCheckboxDropdown
                                    placeholder="Topics"
                                    items={combinedFilterItems}
                                    selectedValues={combinedSelectedValues}
                                    onSelectionChange={handleCombinedFilterChange}
                                    searchable
                                />
                            </div>
                            <NewsOptionBox
                                className="w-fit h-10 border-none cursor-pointer hover:text-gray-700"
                                onClick={resetSearch}>
                                Reset
                            </NewsOptionBox>
                        </div>
                    </div>
                </div>

                {/* Articles */}
                <div className="w-full h-fit min-h-[400px]">
                    {displayedArticles.length === 0
                        ? (
                            <div className="font-serif text-2xl text-center py-16">
                                {isLoading ? "Loading..." : "No articles found"}
                            </div>
                        ) : (
                            <div className="w-full h-fit min-h-[400px] flex flex-col gap-4">
                                <div className="w-full flex flex-col gap-4">
                                    {displayedArticles.map((article) => (
                                        <div key={article._id} className="w-full md:h-[200px] bg-gray-50 flex flex-col md:flex-row justify-between items-center">
                                            <div className="w-full h-[200px] md:w-1/4 md:h-full bg-gray-100 shrink-0">
                                                {article.image?.url && (
                                                    <ConvexImage
                                                        src={article.image?.url}
                                                        alt={article.title}
                                                        width={article.image?.width}
                                                        height={article.image?.height}
                                                        className="w-full h-full object-cover"
                                                        authorCredit={article.image?.authorCredit}
                                                    />
                                                )}
                                            </div>
                                            <div className="w-full md:w-3/4 px-4 py-4 md:px-10 md:py-0 flex flex-col gap-2 items-start justify-center">
                                                {article.articleId ? (
                                                    <Link href={`/api/redirect/article/${article.articleId}`} className="text-lg font-serif">
                                                        {article.title}
                                                    </Link>
                                                ): (
                                                    <Link
                                                        href={`/api/redirect/external-article/${article.externalArticleId}`}
                                                        target="_blank"
                                                        rel="noopener"
                                                        className="text-lg font-serif inline-flex items-start"
                                                        onClick={() => trackEvent(AnalyticsEvents.EXTERNAL_LINK_CLICKED, {
                                                            title: article.title,
                                                            organization: article.organization,
                                                            externalArticleId: article.externalArticleId,
                                                        })}
                                                    >
                                                        {article.title}
                                                        <ExternalLink className="w-4 h-4 ml-1 mt-1 shrink-0 hidden md:inline" />
                                                    </Link>
                                                )}
                                                <TagBadges tagIds={article.tags} />
                                                <div className="text-sm uppercase font-semibold">
                                                    {article.date ? formatDate(new Date(article.date)) : formatDate(new Date(article._creationTime))}
                                                    {(article.externalArticleId && article.organization) ? (
                                                        <> | {article.organization}</>
                                                    ) : (article.authorNames && article.authorNames.length > 0) ? (
                                                        <> | {article.authorNames.join(", ")}</>
                                                    ) : article.authorCredit ? (
                                                        <> | {article.authorCredit}</>
                                                    ) : null}
                                                    {" | "}
                                                    {article.externalArticleId ? "External" : "RTF"}
                                                </div>
                                                <div className="text-sm line-clamp-3">
                                                    {article.excerpt}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Infinite Scroll Sentinel */}
                                {showSentinel && (
                                    <div ref={observerTarget} className="w-full py-8 flex justify-center">
                                        {(topicStatus === "LoadingMore") && (
                                            <Loader2 className="w-6 h-6 animate-spin text-cinnamon" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
