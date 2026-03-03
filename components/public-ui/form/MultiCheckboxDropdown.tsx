"use client"

import { useState, useRef, useEffect, Fragment } from "react"
import { FaCaretDown, FaCaretUp } from "react-icons/fa6"
import { cn } from "@/lib/utils"

type MultiCheckboxDropdownProps<T extends string> = {
    placeholder: string
    items: { label: string; value: T; sectionLabel?: string }[]
    selectedValues: T[]
    onSelectionChange: (values: T[]) => void
    searchable?: boolean
    containerClassName?: string
}

const MultiCheckboxDropdown = <T extends string>({
    placeholder,
    items,
    selectedValues,
    onSelectionChange,
    searchable = false,
    containerClassName,
}: MultiCheckboxDropdownProps<T>) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const handleMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleMouseDown)
        return () => document.removeEventListener("mousedown", handleMouseDown)
    }, [open])

    const filteredItems = searchable && search.trim()
        ? items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
        : items

    const toggleValue = (value: T) => {
        if (selectedValues.includes(value)) {
            onSelectionChange(selectedValues.filter(v => v !== value))
        } else {
            onSelectionChange([...selectedValues, value])
        }
    }

    const displayText = selectedValues.length === 0
        ? placeholder
        : selectedValues.length === 1
            ? (items.find(i => i.value === selectedValues[0])?.label ?? `1 selected`)
            : `${selectedValues.length} selected`

    return (
        <div className={cn("relative h-10", containerClassName)} ref={containerRef}>
            <div
                className="h-10 w-full border-2 border-pewter rounded-sm px-2 flex items-center justify-between cursor-pointer bg-white"
                onClick={() => setOpen(o => !o)}
            >
                <span className="uppercase text-sm font-semibold text-pewter truncate">
                    {displayText}
                </span>
                {open
                    ? <FaCaretUp size={16} className="text-pewter shrink-0" />
                    : <FaCaretDown size={16} className="text-pewter shrink-0" />
                }
            </div>

            {open && (
                <div className="absolute top-full left-0 z-50 w-fit min-w-[200px] bg-white border-2 border-pewter rounded-sm mt-0.5 max-h-60 overflow-y-auto">
                    {searchable && (
                        <div className="px-2 pt-2 pb-1">
                            <input
                                className="w-full outline-none text-sm font-semibold uppercase text-pewter placeholder:text-pewter/60 bg-transparent border-b border-pewter/30 pb-1"
                                placeholder="Search..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    )}
                    <div className="flex flex-col py-1">
                        {filteredItems.length === 0 && (
                            <div className="px-2 py-1 text-sm font-semibold uppercase text-pewter/50">
                                No results
                            </div>
                        )}
                        {filteredItems.map((item, index) => {
                            const prevItem = filteredItems[index - 1]
                            const showSectionHeader = item.sectionLabel !== undefined &&
                                item.sectionLabel !== prevItem?.sectionLabel
                            const checked = selectedValues.includes(item.value)
                            return (
                                <Fragment key={item.value}>
                                    {showSectionHeader && (
                                        <div className="px-2 pt-2 pb-0.5 text-xs font-bold uppercase text-pewter/50 tracking-wider">
                                            {item.sectionLabel}
                                        </div>
                                    )}
                                    <div
                                        className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:underline underline-offset-2 decoration-2 decoration-pewter"
                                        onClick={() => toggleValue(item.value)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            readOnly
                                            className="accent-pewter cursor-pointer"
                                        />
                                        <span className="text-sm font-semibold uppercase text-pewter">
                                            {item.label}
                                        </span>
                                    </div>
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MultiCheckboxDropdown
