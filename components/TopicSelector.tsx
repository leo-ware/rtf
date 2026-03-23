"use client"

import React, { useState, useMemo } from "react"
import { X, Search } from "lucide-react"
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

const TOPICS = [
    { value: "conservation", label: "Conservation" },
    { value: "sanctuary", label: "Sanctuary" },
    { value: "advocacy", label: "Advocacy" },
    { value: "education", label: "Education" },
    { value: "herd-management", label: "Herd Management" },
    { value: "population-management", label: "Population Management" },
    { value: "roundups", label: "Roundups" },
    { value: "horse-slaughter", label: "Horse Slaughter" },
    { value: "spirit", label: "Spirit" },
    { value: "about", label: "About" },
] as const

type Topic = typeof TOPICS[number]["value"]

type TopicSelectorProps = {
    label: string
    description?: string
    selectedTopics: Array<Topic>
    onSelectionChange: (selectedTopics: Array<Topic>) => void
    placeholder?: string
    searchPlaceholder?: string
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
    label,
    description,
    selectedTopics,
    onSelectionChange,
    placeholder = "Select topics...",
    searchPlaceholder = "Search topics...",
}) => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const selectedTopicLabels = useMemo(() => {
        return TOPICS.filter(topic => selectedTopics.includes(topic.value))
    }, [selectedTopics])

    const filteredTopics = useMemo(() => {
        if (!searchTerm) return TOPICS
        const lower = searchTerm.toLowerCase()
        return TOPICS.filter(topic => 
            topic.label.toLowerCase().includes(lower)
        )
    }, [searchTerm])

    const handleSelect = (topicValue: Topic) => {
        if (selectedTopics.includes(topicValue)) {
            onSelectionChange(selectedTopics.filter(t => t !== topicValue))
        } else {
            onSelectionChange([...selectedTopics, topicValue])
        }
    }

    const handleRemove = (topicValue: Topic) => {
        onSelectionChange(selectedTopics.filter(t => t !== topicValue))
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
                        {selectedTopicLabels.length > 0 
                            ? `${selectedTopicLabels.length} selected` 
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
                            <CommandEmpty>No topics found.</CommandEmpty>
                            <CommandGroup>
                                {filteredTopics.map((topic) => (
                                    <CommandItem
                                        key={topic.value}
                                        value={topic.value}
                                        onSelect={() => handleSelect(topic.value)}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                type="checkbox"
                                                checked={selectedTopics.includes(topic.value)}
                                                onChange={() => {}}
                                                className="h-4 w-4"
                                            />
                                            <span>{topic.label}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedTopicLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTopicLabels.map((topic) => (
                        <Badge 
                            key={topic.value} 
                            variant="secondary"
                            className="gap-1"
                        >
                            {topic.label}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleRemove(topic.value)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

