"use client"

import { useState, useRef, useEffect } from "react"
import { usePaginatedQuery, useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Input } from "@/components/ui/input"
import { X, Plus, Loader2 } from "lucide-react"

type PeopleMultiSelectProps = {
    selectedPersonIds: Id<"people">[]
    onSelect: (ids: Id<"people">[]) => void
    disabled?: boolean
}

const SelectedPersonChip = ({
    personId,
    onRemove,
    disabled,
}: {
    personId: Id<"people">
    onRemove: () => void
    disabled?: boolean
}) => {
    const person = useQuery(api.people.getPersonFast, { id: personId })
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm">
            {person?.name ?? "Loading..."}
            {!disabled && (
                <button onClick={onRemove} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    )
}

const PeopleMultiSelect = ({ selectedPersonIds, onSelect, disabled }: PeopleMultiSelectProps) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isCreatingInline, setIsCreatingInline] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const { results, loadMore, status } = usePaginatedQuery(
        api.people.searchPeoplePaginated,
        { query: searchQuery },
        { initialNumItems: 20 }
    )

    const createPerson = useMutation(api.people.createPerson)

    const filteredResults = results?.filter(
        p => !selectedPersonIds.includes(p._id)
    ) ?? []

    const handleAdd = (personId: Id<"people">) => {
        if (!selectedPersonIds.includes(personId)) {
            onSelect([...selectedPersonIds, personId])
        }
        setSearchQuery("")
        setIsOpen(false)
    }

    const handleRemove = (personId: Id<"people">) => {
        onSelect(selectedPersonIds.filter(id => id !== personId))
    }

    const handleQuickCreate = async (name: string) => {
        if (!name.trim() || isCreatingInline) return
        setIsCreatingInline(true)
        try {
            const personId = await createPerson({ name: name.trim() })
            handleAdd(personId)
        } catch (error) {
            console.error("Error creating person:", error)
        } finally {
            setIsCreatingInline(false)
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 50 && status === "CanLoadMore") {
            loadMore(20)
        }
    }

    return (
        <div className="space-y-2">
            {selectedPersonIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedPersonIds.map(id => (
                        <SelectedPersonChip
                            key={id}
                            personId={id}
                            onRemove={() => handleRemove(id)}
                            disabled={disabled}
                        />
                    ))}
                </div>
            )}

            <div className="relative" ref={dropdownRef}>
                <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    placeholder="Search for a person..."
                    disabled={disabled}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                            e.preventDefault()
                            handleQuickCreate(searchQuery)
                        }
                    }}
                />
                {isOpen && (
                    <div
                        className="absolute z-50 mt-1 w-full border rounded-md bg-white shadow-lg max-h-48 overflow-y-auto"
                        onScroll={handleScroll}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {filteredResults.map((person) => (
                            <button
                                key={person._id}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0"
                                onClick={() => handleAdd(person._id)}
                                disabled={disabled}
                            >
                                {person.name}
                            </button>
                        ))}
                        {(status === "LoadingMore" || status === "LoadingFirstPage") && (
                            <div className="flex items-center justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            </div>
                        )}
                        {status === "CanLoadMore" && (
                            <button
                                className="w-full text-center px-3 py-2 text-xs text-blue-600 hover:bg-gray-50"
                                onClick={() => loadMore(20)}
                            >
                                Load more...
                            </button>
                        )}
                        {searchQuery.trim() && (
                            <button
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-t text-blue-600 flex items-center gap-1"
                                onClick={() => handleQuickCreate(searchQuery)}
                                disabled={disabled || isCreatingInline}
                            >
                                {isCreatingInline ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Plus className="h-3 w-3" />
                                )}
                                Create &ldquo;{searchQuery.trim()}&rdquo;
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PeopleMultiSelect
