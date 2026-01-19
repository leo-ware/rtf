"use client"

// Deprecated: ticket pricing has been replaced by per-event `registrationLink` (kept temporarily for reference)

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { DateTimePicker } from "@/components/DateTimePicker"
import { Doc } from "@/convex/_generated/dataModel"
import InfoWidget from "@/components/InfoWidget"

export type TicketPriceOption = {
    name: string
    description?: string
    price: number
    availableBefore?: number
    availableAfter?: number
}

export type TicketPriceData = Omit<Doc<"ticketPrice">, "_id" | "_creationTime">

type TicketPriceEditorDialogProps = {
    ticketPrice?: Doc<"ticketPrice">
    onComplete: (ticketPrice: TicketPriceData) => void
    children?: React.ReactNode
}

const TicketPriceEditorDialog = ({ ticketPrice, onComplete, children }: TicketPriceEditorDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [options, setOptions] = useState<TicketPriceOption[]>(
        ticketPrice?.options || [{ name: "", price: 0 }]
    )
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

    // Reset form when ticketPrice changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            setOptions(ticketPrice?.options || [{ name: "", price: 0 }])
            setExpandedIndex(0)
            setError(null)
        }
    }, [ticketPrice, isOpen])

    const editingDisabled = isLoading

    const saveDisabled = (
        isLoading ||
        options.length === 0 ||
        options.some(opt => !opt.name.trim())
    )

    const handleAddOption = () => {
        if (editingDisabled) return
        const newIndex = options.length
        setOptions([...options, { name: "", price: 0 }])
        setExpandedIndex(newIndex)
    }

    const handleRemoveOption = (index: number) => {
        if (editingDisabled) return
        setOptions(options.filter((_, i) => i !== index))
        // Adjust expanded index if needed
        if (expandedIndex === index) {
            setExpandedIndex(null)
        } else if (expandedIndex !== null && expandedIndex > index) {
            setExpandedIndex(expandedIndex - 1)
        }
    }

    const toggleExpanded = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index)
    }

    const handleOptionChange = (index: number, field: keyof TicketPriceOption, value: string | number | undefined) => {
        if (editingDisabled) return
        const newOptions = [...options]
        if (field === "name" || field === "description") {
            newOptions[index] = { ...newOptions[index], [field]: value as string }
        } else {
            newOptions[index] = { ...newOptions[index], [field]: value as number | undefined }
        }
        setOptions(newOptions)
    }

    const handleDateChange = (index: number, field: "availableAfter" | "availableBefore", date: Date | undefined) => {
        if (editingDisabled) return
        const newOptions = [...options]
        newOptions[index] = { ...newOptions[index], [field]: date ? date.getTime() : undefined }
        setOptions(newOptions)
    }

    const handleSave = () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)

        try {
            // Clean up options - remove empty descriptions and undefined timestamps
            const cleanedOptions = options.map(opt => {
                const cleaned: TicketPriceOption = {
                    name: opt.name.trim(),
                    price: opt.price,
                }
                if (opt.description?.trim()) {
                    cleaned.description = opt.description.trim()
                }
                if (opt.availableBefore !== undefined && opt.availableBefore > 0) {
                    cleaned.availableBefore = opt.availableBefore
                }
                if (opt.availableAfter !== undefined && opt.availableAfter > 0) {
                    cleaned.availableAfter = opt.availableAfter
                }
                return cleaned
            })

            const result: TicketPriceData = {
                options: cleanedOptions,
            }

            onComplete(result)
            setIsOpen(false)
        } catch (err) {
            console.error("Error saving ticket price:", err)
            setError(`Failed to save ticket price. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setOptions(ticketPrice?.options || [{ name: "", price: 0 }])
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        Edit Ticket Prices
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {ticketPrice ? "Edit Ticket Prices" : "Create Ticket Prices"}
                    </DialogTitle>
                    <DialogDescription>
                        Configure pricing options for tickets.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-4">
                        {options.map((option, index) => {
                            const isExpanded = expandedIndex === index
                            return (
                                <div key={index} className="border rounded-lg overflow-hidden">
                                    <button
                                        type="button"
                                        className="w-full p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
                                        onClick={() => toggleExpanded(index)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {option.name || `Option ${index + 1}`}
                                            </span>
                                            {!isExpanded && option.name && (
                                                <span className="text-sm text-muted-foreground">
                                                    — ${option.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        {options.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveOption(index)
                                                }}
                                                disabled={editingDisabled}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </button>

                                    {isExpanded && (
                                        <div className="p-4 pt-0 space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`name-${index}`}>Name</Label>
                                                    <Input
                                                        id={`name-${index}`}
                                                        value={option.name}
                                                        disabled={editingDisabled}
                                                        onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                                                        placeholder="e.g., Adult, Child, Senior"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`price-${index}`}>Price ($)</Label>
                                                    <Input
                                                        id={`price-${index}`}
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={option.price}
                                                        disabled={editingDisabled}
                                                        onChange={(e) => handleOptionChange(index, "price", parseFloat(e.target.value) || 0)}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor={`description-${index}`}>Description (optional)</Label>
                                                <Input
                                                    id={`description-${index}`}
                                                    value={option.description || ""}
                                                    disabled={editingDisabled}
                                                    onChange={(e) => handleOptionChange(index, "description", e.target.value)}
                                                    placeholder="Optional description for this pricing tier"
                                                />
                                            </div>

                                            <div>
                                                <Label className="flex items-center gap-1.5">
                                                    Available After
                                                    <InfoWidget>
                                                        When this option becomes available. Use to create early bird pricing that starts on a specific date.
                                                    </InfoWidget>
                                                </Label>
                                                <DateTimePicker
                                                    value={option.availableAfter ? new Date(option.availableAfter) : undefined}
                                                    onChange={(date) => handleDateChange(index, "availableAfter", date)}
                                                    disabled={editingDisabled}
                                                    timeRequired
                                                    placeholder="Select start date (optional)"
                                                />
                                            </div>

                                            <div>
                                                <Label className="flex items-center gap-1.5">
                                                    Available Before
                                                    <InfoWidget>
                                                        When this option expires. Use to create early bird discounts that end before the event.
                                                    </InfoWidget>
                                                </Label>
                                                <DateTimePicker
                                                    value={option.availableBefore ? new Date(option.availableBefore) : undefined}
                                                    onChange={(date) => handleDateChange(index, "availableBefore", date)}
                                                    disabled={editingDisabled}
                                                    timeRequired
                                                    placeholder="Select end date (optional)"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleAddOption}
                        disabled={editingDisabled}
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Pricing Option
                    </Button>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={resetForm} disabled={editingDisabled}>
                            Reset
                        </Button>
                        <Button onClick={handleSave} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TicketPriceEditorDialog

