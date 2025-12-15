"use client"

import React, { useState, useMemo } from "react"
import { X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Item = {
    _id: string
    name: string
}

type TagSelectorProps = {
    label: string
    description?: string
    selectedIds: Array<string>
    availableItems: Array<Item>
    onSelectionChange: (selectedIds: Array<string>) => void
    placeholder?: string
    searchPlaceholder?: string
    loadMore?: () => void
}

export const TagSelector: React.FC<TagSelectorProps> = ({
    label,
    description,
    selectedIds,
    availableItems,
    onSelectionChange,
    placeholder = "Select items...",
    searchPlaceholder = "Search...",
}) => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const selectedItems = useMemo(() => {
        return availableItems.filter(item => selectedIds.includes(item._id))
    }, [availableItems, selectedIds])

    const filteredItems = useMemo(() => {
        if (!searchTerm) return availableItems
        const lower = searchTerm.toLowerCase()
        return availableItems.filter(item => 
            item.name.toLowerCase().includes(lower)
        )
    }, [availableItems, searchTerm])

    const handleSelect = (itemId: string) => {
        if (selectedIds.includes(itemId)) {
            onSelectionChange(selectedIds.filter(id => id !== itemId))
        } else {
            onSelectionChange([...selectedIds, itemId])
        }
    }

    const handleRemove = (itemId: string) => {
        onSelectionChange(selectedIds.filter(id => id !== itemId))
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}
            
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedItems.length > 0 
                            ? `${selectedItems.length} selected` 
                            : placeholder
                        }
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput 
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <CommandList>
                            <CommandEmpty>No items found.</CommandEmpty>
                            <CommandGroup>
                                {filteredItems.map((item) => (
                                    <CommandItem
                                        key={item._id}
                                        value={item._id}
                                        onSelect={() => handleSelect(item._id)}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item._id)}
                                                onChange={() => {}}
                                                className="h-4 w-4"
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedItems.map((item) => (
                        <Badge 
                            key={item._id} 
                            variant="secondary"
                            className="gap-1"
                        >
                            {item.name}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleRemove(item._id)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

