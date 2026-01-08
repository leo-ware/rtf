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
import { Edit, Loader2, User, X, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ReorderableList from "@/components/ReorderableList"
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

type AdvisoryBoardEditDialogProps = {
    advisoryBoardId: Id<"advisoryBoards">
    children?: React.ReactNode
}

const AdvisoryBoardEditDialog = ({ advisoryBoardId, children }: AdvisoryBoardEditDialogProps) => {
    
    const board = useQuery(api.advisoryBoards.getAdvisoryBoardWithPeople, { id: advisoryBoardId })
    const allPeople = useQuery(api.people.listPeople, { limit: 100 })
    const updateAdvisoryBoard = useMutation(api.advisoryBoards.updateAdvisoryBoard)
    const updatePeopleAdvisoryBoards = useMutation(api.advisoryBoards.updatePeopleAdvisoryBoards)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [popoverOpen, setPopoverOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        selectedPeopleIds: [] as Id<"people">[],
    })

    useEffect(() => {
        if (board && isOpen) {
            setFormData({
                name: board.name,
                selectedPeopleIds: board.peopleAdvisoryBoards?.filter(pab => pab?.person?._id).map(pab => pab.person._id) || [],
            })
        }
    }, [board, isOpen])

    const editingDisabled = isLoading
    const saveDisabled = (
        isLoading ||
        !formData.name
    )

    const handleUpdate = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateAdvisoryBoard({
                id: advisoryBoardId,
                name: formData.name,
            })

            await updatePeopleAdvisoryBoards({
                id: advisoryBoardId,
                people: formData.selectedPeopleIds,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating advisory board:", err)
            setError(`Failed to update advisory board. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReorderPeople = (newOrder: string[]) => {
        setFormData(prev => ({
            ...prev,
            selectedPeopleIds: newOrder as Id<"people">[],
        }))
    }

    const togglePerson = (personId: Id<"people">) => {
        setFormData(prev => {
            const isSelected = prev.selectedPeopleIds.includes(personId)
            if (isSelected) {
                return {
                    ...prev,
                    selectedPeopleIds: prev.selectedPeopleIds.filter(id => id !== personId),
                }
            } else {
                return {
                    ...prev,
                    selectedPeopleIds: [...prev.selectedPeopleIds, personId],
                }
            }
        })
    }

    if (!board) return null

    const selectedPeopleData = formData.selectedPeopleIds
        .map(id => allPeople?.find(p => p._id === id))
        .filter(Boolean)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Advisory Board</DialogTitle>
                    <DialogDescription>
                        Update the advisory board information and manage people.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="edit-board-name">Name</Label>
                        <Input
                            id="edit-board-name"
                            value={formData.name}
                            disabled={editingDisabled}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter advisory board name"
                        />
                    </div>

                    <div>
                        <Label>Select People</Label>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={editingDisabled}
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add people to this board
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search people..." />
                                    <CommandList>
                                        <CommandEmpty>No people found.</CommandEmpty>
                                        <CommandGroup>
                                            {allPeople
                                                ?.filter((person) => !formData.selectedPeopleIds.includes(person._id))
                                                .map((person) => (
                                                    <CommandItem
                                                        key={person._id}
                                                        onSelect={() => {
                                                            togglePerson(person._id)
                                                            setPopoverOpen(false)
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {person.imageId ? (
                                                                <img
                                                                    src={`https://api.convex.cloud/storage/${person.imageId}`}
                                                                    alt={person.name}
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                    <User className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                            )}
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
                        <div className="mt-2 flex flex-wrap gap-1">
                            {formData.selectedPeopleIds.map((personId) => {
                                const person = allPeople?.find((p) => p._id === personId)
                                if (!person) return null
                                return (
                                    <Badge key={personId} variant="secondary" className="pl-2 pr-1">
                                        {person.name}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={editingDisabled}
                                            className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                                            onClick={() => togglePerson(personId)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>

                    {/* {selectedPeopleData.length > 0 && (
                        <div>
                            <Label>Order People (Drag to Reorder)</Label>
                            <p className="text-sm text-gray-600 mb-2">
                                The order below determines how people appear in this advisory board.
                            </p>
                            <ReorderableList
                                onReorder={handleReorderPeople}
                                disabled={editingDisabled}
                                items={selectedPeopleData.map((person: any) => ({
                                    id: person._id,
                                    widget: (
                                        <div className="flex items-center gap-3 px-2 py-1">
                                            {person.image?.imageUrl ? (
                                                <img
                                                    src={person.image.imageUrl}
                                                    alt={person.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium">{person.name}</div>
                                                <div className="text-sm text-gray-600">{person.title}</div>
                                            </div>
                                        </div>
                                    )
                                }))}
                            />
                        </div>
                    )} */}

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={editingDisabled}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Board"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AdvisoryBoardEditDialog
