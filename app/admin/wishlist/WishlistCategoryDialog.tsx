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

type WishlistCategoryDialogProps = {
    isOpen: boolean
    onClose: () => void
    category?: Doc<"wishlistCategories"> | null
}

const WishlistCategoryDialog = ({ isOpen, onClose, category }: WishlistCategoryDialogProps) => {
    const [name, setName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const categories = useQuery(api.wishlist.listCategories)
    const createCategory = useMutation(api.wishlist.createCategory)
    const updateCategory = useMutation(api.wishlist.updateCategory)

    const isEditing = !!category

    useEffect(() => {
        if (category) {
            setName(category.name)
        } else {
            setName("")
        }
    }, [category, isOpen])

    const handleClose = () => {
        setName("")
        onClose()
    }

    const handleSubmit = async () => {
        if (!name.trim()) return

        setIsSubmitting(true)
        try {
            if (isEditing && category) {
                await updateCategory({
                    id: category._id,
                    name: name.trim(),
                })
            } else {
                const nextOrder = (categories?.length ?? 0)
                await createCategory({
                    name: name.trim(),
                    order: nextOrder,
                })
            }
            handleClose()
        } catch (error: any) {
            console.error("Error saving category:", error)
            alert(`Failed to save category: ${error?.message || "Unknown error"}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Category" : "Create Category"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update this wishlist category." : "Add a new wishlist category."}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Name</Label>
                        <Input
                            id="category-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sanctuary Operations"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default WishlistCategoryDialog
