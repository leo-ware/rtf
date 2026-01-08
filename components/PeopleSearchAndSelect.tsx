"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Plus, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"

type PeopleSearchAndSelectProps = {
    selectedPeople: Doc<"people">[]
    onSelect: (personId: Id<"people">) => void
    onRemove: (personId: Id<"people">) => void
    disabled: boolean
}

const SelectedPersonItem = ({ person, onRemove }: { person: Doc<"people">, onRemove: () => void }) => {
    return (
        <div className="bg-gray-100 rounded-md p-1 flex items-center gap-2 text-xs">
            <div className="cursor-pointer" onClick={onRemove}>
                <X className="h-3 w-3" />
            </div>
            {person.name}
        </div>
    )
}

const PeopleSearchAndSelect = ({ selectedPeople, onSelect, onRemove, disabled }: PeopleSearchAndSelectProps) => {

    const [popoverOpen, setPopoverOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const selectedPeopleIds = new Set(selectedPeople.map(person => person._id))
    const _searchResults = useQuery(api.people.searchPeople, { query: searchQuery })

    const searchResults = (_searchResults !== undefined) ? [
        ...(_searchResults || [])
            .filter(person => selectedPeopleIds.has(person._id))
            .map(person => ({...person, selected: true}))
        ,
        ...(_searchResults || [])
            .filter(person => !selectedPeopleIds.has(person._id))
            .map(person => ({...person, selected: false})),
    ] : undefined

    return (
        <div className="w-full space-y-2">
            <div className="flex flex-wrap gap-2">
                {selectedPeople.map((person) => (
                    <SelectedPersonItem
                        key={person._id}
                        person={person}
                        onRemove={() => onRemove(person._id)} />
                ))}
            </div>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className="w-full justify-start text-left font-normal"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add people to this board
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search people..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            {searchResults === undefined && (
                                <CommandEmpty className="w-full flex items-center justify-center gap-2 my-4 text-sm">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Loading...
                                </CommandEmpty>
                            )}
                            {searchResults !== undefined && (
                                <CommandEmpty>
                                    No people found.
                                </CommandEmpty>
                            )}

                            <CommandGroup>
                                {(searchResults || []).map((person) => (
                                    <CommandItem
                                        key={person._id}
                                        // onSelect={() => {
                                        //     if (person.selected) {
                                        //         onRemove(person._id)
                                        //     } else {
                                        //         onSelect(person._id)
                                        //     }
                                        // }}
                                    >
                                        <div
                                            className="flex items-center gap-2"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                if (person.selected) {
                                                    onRemove(person._id)
                                                } else {
                                                    onSelect(person._id)
                                                }
                                            }}
                                            >
                                            <div>
                                                {person.selected
                                                    ? <ImCheckboxChecked />
                                                    : <ImCheckboxUnchecked />
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{person.name}</div>
                                                <div className="text-xs text-gray-600">{person.title}</div>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default PeopleSearchAndSelect