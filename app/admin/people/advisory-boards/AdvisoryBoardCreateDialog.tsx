"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const AdvisoryBoardCreateDialog = () => {
    const createAdvisoryBoard = useMutation(api.advisoryBoards.createAdvisoryBoard)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: ""
    })

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name
    )

    const handleCreate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await createAdvisoryBoard({
                name: formData.name
            })
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error creating advisory board:", err)
            setError(`Failed to create advisory board. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (editingDisabled) return
        setFormData({
            name: ""
        })
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={resetForm} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Advisory Board
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Advisory Board</DialogTitle>
                    <DialogDescription>
                        Add a new advisory board category.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="board-name">Name</Label>
                        <Input
                            id="board-name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter advisory board name"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={resetForm} disabled={editingDisabled}>
                            Reset
                        </Button>
                        <Button onClick={handleCreate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Add Board"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AdvisoryBoardCreateDialog
