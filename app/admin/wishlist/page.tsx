"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Plus,
    Edit,
    Trash2,
    ClipboardList,
    ExternalLink,
    FolderPlus,
} from "lucide-react"
import ReorderableList from "@/components/ReorderableList"
import WishlistCategoryDialog from "./WishlistCategoryDialog"
import WishlistItemDialog from "./WishlistItemDialog"

const AdminWishlistPage = () => {
    useEffect(() => {
        document.title = "Wishlist - RTF Admin"
    }, [])

    const categories = useQuery(api.wishlist.listCategories)
    const items = useQuery(api.wishlist.listItems)
    const deleteCategory = useMutation(api.wishlist.deleteCategory)
    const deleteItem = useMutation(api.wishlist.deleteItem)
    const reorderCategories = useMutation(api.wishlist.reorderCategories)
    const reorderItems = useMutation(api.wishlist.reorderItems)

    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Doc<"wishlistCategories"> | null>(null)
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Doc<"wishlistItems"> | null>(null)
    const [addItemCategory, setAddItemCategory] = useState<string | undefined>(undefined)

    const [confirmDeleteCategory, setConfirmDeleteCategory] = useState<Id<"wishlistCategories"> | null>(null)
    const [confirmDeleteItem, setConfirmDeleteItem] = useState<Id<"wishlistItems"> | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const itemsByCategory = (categoryName: string) => {
        return (items || [])
            .filter((item) => item.category === categoryName)
            .sort((a, b) => a.order - b.order)
    }

    const handleDeleteCategory = async (id: Id<"wishlistCategories">) => {
        setIsDeleting(true)
        try {
            await deleteCategory({ id })
            setConfirmDeleteCategory(null)
        } catch (error: any) {
            console.error("Error deleting category:", error)
            alert(`Failed to delete category: ${error?.message || "Unknown error"}`)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeleteItem = async (id: Id<"wishlistItems">) => {
        setIsDeleting(true)
        try {
            await deleteItem({ id })
            setConfirmDeleteItem(null)
        } catch (error: any) {
            console.error("Error deleting item:", error)
            alert(`Failed to delete item: ${error?.message || "Unknown error"}`)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleReorderCategories = useCallback((newOrder: string[]) => {
        reorderCategories({ ids: newOrder as Id<"wishlistCategories">[] })
    }, [reorderCategories])

    const handleReorderItems = useCallback((categoryName: string) => (newOrder: string[]) => {
        reorderItems({ ids: newOrder as Id<"wishlistItems">[] })
    }, [reorderItems])

    if (categories === undefined || items === undefined) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const categoryReorderItems = categories.map((cat) => ({
        id: cat._id as string,
        widget: (
            <CategorySection
                category={cat}
                items={itemsByCategory(cat.name)}
                onEditCategory={(c) => { setEditingCategory(c); setIsCategoryDialogOpen(true) }}
                onDeleteCategory={(id) => setConfirmDeleteCategory(id)}
                onEditItem={(item) => { setEditingItem(item); setIsItemDialogOpen(true) }}
                onDeleteItem={(id) => setConfirmDeleteItem(id)}
                onAddItem={(categoryName) => { setAddItemCategory(categoryName); setEditingItem(null); setIsItemDialogOpen(true) }}
                onReorderItems={handleReorderItems(cat.name)}
            />
        ),
    }))

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Description */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">
                    Manage the items displayed on the public wishlist page. Categories and items can be
                    reordered by dragging. On the public page, categories are automatically split into
                    two balanced columns based on item count.
                </p>
            </div>

            {/* Header actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 sm:ml-auto">
                    <Button variant="outline" onClick={() => { setEditingCategory(null); setIsCategoryDialogOpen(true) }}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                    <Button onClick={() => { setAddItemCategory(undefined); setEditingItem(null); setIsItemDialogOpen(true) }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                    </Button>
                </div>
            </div>

            {/* Categories and Items */}
            {categories.length === 0 ? (
                <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No wishlist categories</h3>
                    <p className="text-gray-600 mb-4">
                        Get started by creating your first category.
                    </p>
                    <Button onClick={() => { setEditingCategory(null); setIsCategoryDialogOpen(true) }}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </div>
            ) : (
                <ReorderableList
                    items={categoryReorderItems}
                    onReorder={handleReorderCategories}
                />
            )}

            {/* Category Dialog */}
            <WishlistCategoryDialog
                isOpen={isCategoryDialogOpen}
                onClose={() => { setIsCategoryDialogOpen(false); setEditingCategory(null) }}
                category={editingCategory}
            />

            {/* Item Dialog */}
            <WishlistItemDialog
                isOpen={isItemDialogOpen}
                onClose={() => { setIsItemDialogOpen(false); setEditingItem(null); setAddItemCategory(undefined) }}
                item={editingItem}
                defaultCategory={addItemCategory}
            />

            {/* Delete Category Confirmation */}
            <AlertDialog open={!!confirmDeleteCategory} onOpenChange={() => setConfirmDeleteCategory(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this category and all its items. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteCategory && handleDeleteCategory(confirmDeleteCategory)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Item Confirmation */}
            <AlertDialog open={!!confirmDeleteItem} onOpenChange={() => setConfirmDeleteItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this wishlist item. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteItem && handleDeleteItem(confirmDeleteItem)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// ── Category Section (rendered inside ReorderableList) ──

type CategorySectionProps = {
    category: Doc<"wishlistCategories">
    items: Doc<"wishlistItems">[]
    onEditCategory: (cat: Doc<"wishlistCategories">) => void
    onDeleteCategory: (id: Id<"wishlistCategories">) => void
    onEditItem: (item: Doc<"wishlistItems">) => void
    onDeleteItem: (id: Id<"wishlistItems">) => void
    onAddItem: (categoryName: string) => void
    onReorderItems: (newOrder: string[]) => void
}

const CategorySection = ({
    category,
    items,
    onEditCategory,
    onDeleteCategory,
    onEditItem,
    onDeleteItem,
    onAddItem,
    onReorderItems,
}: CategorySectionProps) => {
    const itemReorderItems = items.map((item) => ({
        id: item._id as string,
        widget: (
            <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-sm text-gray-900 truncate">{item.name}</span>
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
                <div className="flex shrink-0 space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onEditItem(item) }}
                    >
                        <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onDeleteItem(item._id) }}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        ),
    }))

    return (
        <div className="w-full">
            {/* Category header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 mr-2">
                        {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddItem(category.name)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditCategory(category)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteCategory(category._id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Items */}
            {items.length > 0 ? (
                <ReorderableList
                    items={itemReorderItems}
                    onReorder={onReorderItems}
                />
            ) : (
                <div className="px-4 py-4 text-center text-sm text-gray-400 border border-dashed rounded-lg">
                    No items — click + to add one
                </div>
            )}
        </div>
    )
}

export default AdminWishlistPage
