"use client"

// Deprecated: discount-code based ticketing is no longer used (kept temporarily for reference)

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Copy, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { useState, useEffect, useMemo } from "react"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type DiscountType = "percentage" | "fixed" | "free" | "tickets"

type DiscountCodeEditorDialogProps = {
    discountCode?: Doc<"discountCodes">
    children?: React.ReactNode
}

const DiscountCodeEditorDialog = ({ discountCode, children }: DiscountCodeEditorDialogProps) => {
    const createDiscountCode = useMutation(api.discountCodes.createDiscountCode)
    const updateDiscountCode = useMutation(api.discountCodes.updateDiscountCode)
    const programs = useQuery(api.programs.getAllPrograms)
    const { results: events } = usePaginatedQuery(
        api.events.getPaginatedEvents,
        {},
        { initialNumItems: 100 }
    )

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [generatedCode, setGeneratedCode] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const [formData, setFormData] = useState({
        description: discountCode?.description || "",
        discountType: (discountCode?.discountType || "percentage") as DiscountType,
        discountQuantity: discountCode?.discountQuantity?.toString() || "",
        programLock: discountCode?.programLock || null as Id<"programs"> | null,
        eventLock: discountCode?.eventLock || null as Id<"events"> | null,
    })

    const isEditing = !!discountCode

    // Reset form when discountCode changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                description: discountCode?.description || "",
                discountType: (discountCode?.discountType || "percentage") as DiscountType,
                discountQuantity: discountCode?.discountQuantity?.toString() || "",
                programLock: discountCode?.programLock || null,
                eventLock: discountCode?.eventLock || null,
            })
            setError(null)
            setGeneratedCode(null)
            setCopied(false)
        }
    }, [discountCode, isOpen])

    const editingDisabled = isLoading
    
    const needsQuantity = formData.discountType === "percentage" || 
                          formData.discountType === "fixed" || 
                          formData.discountType === "tickets"

    const programOptions = useMemo(() => {
        const opts = [{ value: "none", label: "No restriction" }]
        if (programs) {
            opts.push(...programs.map(p => ({ value: p._id, label: p.name })))
        }
        return opts
    }, [programs])

    const eventOptions = useMemo(() => {
        const opts = [{ value: "none", label: "No restriction" }]
        if (events) {
            opts.push(...events.map(e => ({ value: e._id, label: e.title })))
        }
        return opts
    }, [events])

    const saveDisabled = (
        isLoading ||
        (needsQuantity && !formData.discountQuantity)
    )

    const handleSave = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        setGeneratedCode(null)

        try {
            const quantity = formData.discountQuantity ? parseFloat(formData.discountQuantity) : undefined

            if (isEditing) {
                await updateDiscountCode({
                    id: discountCode._id,
                    description: formData.description || undefined,
                    discountType: formData.discountType,
                    discountQuantity: quantity,
                    programLock: formData.programLock || undefined,
                    eventLock: formData.eventLock || undefined,
                })
                setIsOpen(false)
            } else {
                const result = await createDiscountCode({
                    description: formData.description || undefined,
                    discountType: formData.discountType,
                    discountQuantity: quantity,
                    programLock: formData.programLock || undefined,
                    eventLock: formData.eventLock || undefined,
                })
                setGeneratedCode(result.code)
            }
        } catch (err) {
            console.error("Error saving discount code:", err)
            setError(`Failed to save discount code. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopyCode = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            description: discountCode?.description || "",
            discountType: (discountCode?.discountType || "percentage") as DiscountType,
            discountQuantity: discountCode?.discountQuantity?.toString() || "",
            programLock: discountCode?.programLock || null,
            eventLock: discountCode?.eventLock || null,
        })
        setError(null)
        setGeneratedCode(null)
    }

    const getQuantityLabel = () => {
        switch (formData.discountType) {
            case "percentage":
                return "Discount Percentage (%)"
            case "fixed":
                return "Discount Amount ($)"
            case "tickets":
                return "Number of Free Tickets"
            default:
                return "Quantity"
        }
    }

    const getQuantityPlaceholder = () => {
        switch (formData.discountType) {
            case "percentage":
                return "e.g., 10 for 10% off"
            case "fixed":
                return "e.g., 25 for $25 off"
            case "tickets":
                return "e.g., 2 for 2 free tickets"
            default:
                return ""
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Discount Code
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Discount Code" : "Create Discount Code"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing 
                            ? `Editing code: ${discountCode.code}`
                            : "Configure the discount type and restrictions. A unique code will be generated automatically."
                        }
                    </DialogDescription>
                </DialogHeader>

                {generatedCode ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800 mb-2">
                                Discount code created successfully!
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="bg-white px-4 py-2 rounded border font-mono text-lg flex-1 text-center">
                                    {generatedCode}
                                </code>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyCode}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Close
                            </Button>
                            <Button onClick={() => {
                                setGeneratedCode(null)
                                resetForm()
                            }}>
                                Create Another
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                disabled={editingDisabled}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g., VIP member discount, Early bird special"
                            />
                        </div>

                        <div>
                            <Label htmlFor="discountType">Discount Type</Label>
                            <Select
                                value={formData.discountType}
                                disabled={editingDisabled}
                                onValueChange={(value: DiscountType) => setFormData({ ...formData, discountType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentage Off</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                                    <SelectItem value="free">Free (100% off)</SelectItem>
                                    <SelectItem value="tickets">Free Tickets</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {needsQuantity && (
                            <div>
                                <Label htmlFor="discountQuantity">{getQuantityLabel()}</Label>
                                <Input
                                    id="discountQuantity"
                                    type="number"
                                    step={formData.discountType === "fixed" ? "0.01" : "1"}
                                    min="0"
                                    max={formData.discountType === "percentage" ? "100" : undefined}
                                    value={formData.discountQuantity}
                                    disabled={editingDisabled}
                                    onChange={(e) => setFormData({ ...formData, discountQuantity: e.target.value })}
                                    placeholder={getQuantityPlaceholder()}
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="programLock">Restrict to Program (optional)</Label>
                            <SearchableSelect
                                options={programOptions}
                                value={formData.programLock || "none"}
                                onValueChange={(value) => setFormData({ 
                                    ...formData, 
                                    programLock: value === "none" || value === null ? null : value as Id<"programs">
                                })}
                                placeholder="No restriction"
                                searchPlaceholder="Search programs..."
                                emptyMessage="No programs found."
                                disabled={editingDisabled}
                            />
                        </div>

                        <div>
                            <Label htmlFor="eventLock">Restrict to Event (optional)</Label>
                            <SearchableSelect
                                options={eventOptions}
                                value={formData.eventLock || "none"}
                                onValueChange={(value) => setFormData({ 
                                    ...formData, 
                                    eventLock: value === "none" || value === null ? null : value as Id<"events">
                                })}
                                placeholder="No restriction"
                                searchPlaceholder="Search events..."
                                emptyMessage="No events found."
                                disabled={editingDisabled}
                            />
                        </div>

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
                                        {isEditing ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    isEditing ? "Update Code" : "Create Code"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DiscountCodeEditorDialog

