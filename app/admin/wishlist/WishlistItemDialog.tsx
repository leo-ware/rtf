"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type WishlistItemDialogProps = {
    isOpen: boolean
    onClose: () => void
    item?: Doc<"wishlistItems"> | null
    defaultCategory?: string
}

const WishlistItemDialog = ({ isOpen, onClose, item, defaultCategory }: WishlistItemDialogProps) => {
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [link, setLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const categories = useQuery(api.wishlist.listCategories)
    const allItems = useQuery(api.wishlist.listItems)
    const createItem = useMutation(api.wishlist.createItem)
    const updateItem = useMutation(api.wishlist.updateItem)

    const isEditing = !!item

    useEffect(() => {
        if (item) {
            setName(item.name)
            setCategory(item.category)
            setLink(item.link || "")
        } else {
            setName("")
            setCategory(defaultCategory || categories?.[0]?.name || "")
            setLink("")
        }
    }, [item, isOpen, categories, defaultCategory])

    const handleClose = () => {
        setName("")
        setCategory("")
        setLink("")
        onClose()
    }

    const handleSubmit = async () => {
        if (!name.trim() || !category) return

        setIsSubmitting(true)
        try {
            if (isEditing && item) {
                await updateItem({
                    id: item._id,
                    name: name.trim(),
                    category,
                    link: link.trim() || undefined,
                })
            } else {
                const nextOrder = (allItems || []).filter((i) => i.category === category).length
                await createItem({
                    name: name.trim(),
                    category,
                    order: nextOrder,
                    link: link.trim() || undefined,
                })
            }
            handleClose()
        } catch (error: any) {
            console.error("Error saving item:", error)
            alert(`Failed to save item: ${error?.message || "Unknown error"}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Item" : "Create Item"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update this wishlist item." : "Add a new wishlist item."}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="item-name">Name</Label>
                        <Input
                            id="item-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Small tractors and accessories"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((cat) => (
                                    <SelectItem key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="item-link">Link (optional)</Label>
                        <Input
                            id="item-link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!name.trim() || !category || isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default WishlistItemDialog
