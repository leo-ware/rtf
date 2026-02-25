"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Plus, Loader2 } from "lucide-react"

type PersonSearchSelectProps = {
    selectedPersonId: Id<"people"> | undefined
    onSelect: (personId: Id<"people"> | undefined) => void
    disabled?: boolean
}

const PersonSearchSelect = ({ selectedPersonId, onSelect, disabled }: PersonSearchSelectProps) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [newPersonName, setNewPersonName] = useState("")
    const [createError, setCreateError] = useState<string | null>(null)

    const searchResults = useQuery(api.people.searchPeopleLight, { query: searchQuery })
    const selectedPerson = useQuery(
        api.people.getPersonFast,
        selectedPersonId ? { id: selectedPersonId } : "skip"
    )
    const createPerson = useMutation(api.people.createPerson)

    const handleCreate = async () => {
        if (!newPersonName.trim()) return
        setCreateError(null)
        try {
            const personId = await createPerson({
                name: newPersonName.trim(),
            })
            onSelect(personId)
            setNewPersonName("")
            setIsCreating(false)
            setSearchQuery("")
        } catch (error) {
            console.error("Error creating person:", error)
            setCreateError("Failed to create person")
        }
    }

    if (selectedPersonId && selectedPerson) {
        return (
            <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <span className="flex-1 text-sm">{selectedPerson.name}</span>
                {!disabled && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelect(undefined)}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        )
    }

    if (selectedPersonId && !selectedPerson) {
        return (
            <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <span className="flex-1 text-sm text-gray-400">Loading...</span>
            </div>
        )
    }

    if (isCreating) {
        return (
            <div className="space-y-2">
                <Input
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Enter person's name"
                    disabled={disabled}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleCreate()
                        }
                    }}
                />
                {createError && <p className="text-red-500 text-xs">{createError}</p>}
                <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreate} disabled={!newPersonName.trim() || disabled}>
                        Create
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setIsCreating(false); setNewPersonName("") }}>
                        Cancel
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-1">
            <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a person..."
                disabled={disabled}
            />
            {searchQuery.trim() && searchResults && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                    {searchResults.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">No results found</div>
                    ) : (
                        searchResults.map((person) => (
                            <button
                                key={person._id}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0"
                                onClick={() => {
                                    onSelect(person._id)
                                    setSearchQuery("")
                                }}
                                disabled={disabled}
                            >
                                {person.name}
                            </button>
                        ))
                    )}
                </div>
            )}
            <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setIsCreating(true)}
                disabled={disabled}
            >
                <Plus className="h-3 w-3 mr-1" />
                Create new person
            </Button>
        </div>
    )
}

export default PersonSearchSelect
