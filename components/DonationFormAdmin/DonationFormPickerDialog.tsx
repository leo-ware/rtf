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
import { Input } from "@/components/ui/input"
import { Heart, Search, Plus, Edit, Trash2, X } from "lucide-react"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ScrollDiv from "@/components/ScrollDiv"
import { ImSpinner8 } from "react-icons/im"
import DonationFormCreateDialog from "./DonationFormCreateDialog"
import DonationFormEditDialog, { type DonationForm } from "./DonationFormEditDialog"
import DonationFormDeleteDialog from "./DonationFormDeleteDialog"

type DonationFormPickerDialogProps = {
    donationFormId: Id<"donationForms"> | null
    onDonationFormSelect: (id: Id<"donationForms"> | null) => void
    disabled?: boolean
    children?: React.ReactNode
}

const DonationFormPickerDialog = ({
    donationFormId,
    onDonationFormSelect,
    disabled,
    children,
}: DonationFormPickerDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const selectedDonationForm = useQuery(
        api.donationForms.getDonationForm,
        donationFormId ? { id: donationFormId } : "skip"
    )

    const { results: donationForms, loadMore, status } = usePaginatedQuery(
        api.donationForms.paginatedDonationFormsWithUsage,
        { searchText: searchQuery },
        { initialNumItems: 20 }
    )

    const handleSelect = (id: Id<"donationForms">) => {
        onDonationFormSelect(id)
        setIsOpen(false)
    }

    const handleClear = () => {
        onDonationFormSelect(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={disabled}
                    >
                        <Heart className="h-4 w-4 mr-2" />
                        {selectedDonationForm ? selectedDonationForm.name : "Select a donation form"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Donation Form</DialogTitle>
                    <DialogDescription>
                        Search and select a donation form, or create a new one.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search donation forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <DonationFormCreateDialog onCreated={(id) => handleSelect(id)}>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            New
                        </Button>
                    </DonationFormCreateDialog>
                </div>

                {donationFormId && (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900">
                                {selectedDonationForm?.name || "Loading..."}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <ScrollDiv
                    className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px]"
                    onScrollNearBottom={() => loadMore(20)}
                    threshold={100}
                >
                    <div className="space-y-2">
                        {donationForms?.map((form) => (
                            <div
                                key={form._id}
                                className={`flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer ${
                                    donationFormId === form._id ? "border-blue-500 bg-blue-50" : ""
                                }`}
                                onClick={() => handleSelect(form._id)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{form.name}</div>
                                    {form.notes && (
                                        <div className="text-sm text-gray-500 truncate">
                                            {form.notes}
                                        </div>
                                    )}
                                    {(form.usage.animals.length > 0 || form.usage.herds.length > 0 || form.usage.pathways.length > 0) && (
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {form.usage.animals.length > 0 && (
                                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                                    {form.usage.animals.length} animal{form.usage.animals.length !== 1 ? "s" : ""}
                                                </span>
                                            )}
                                            {form.usage.herds.length > 0 && (
                                                <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                                    {form.usage.herds.length} herd{form.usage.herds.length !== 1 ? "s" : ""}
                                                </span>
                                            )}
                                            {form.usage.pathways.length > 0 && (
                                                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                                                    {form.usage.pathways.length} pathway{form.usage.pathways.length !== 1 ? "s" : ""}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                                    <DonationFormEditDialog donationForm={form as DonationForm}>
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </DonationFormEditDialog>
                                    <DonationFormDeleteDialog
                                        donationFormId={form._id}
                                    >
                                        <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DonationFormDeleteDialog>
                                </div>
                            </div>
                        ))}

                        {status === "LoadingMore" && (
                            <div className="flex justify-center py-4">
                                <ImSpinner8 className="h-5 w-5 animate-spin text-gray-400" />
                            </div>
                        )}

                        {status === "Exhausted" && donationForms?.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No donation forms found</p>
                                <p className="text-sm">Try a different search or create a new donation form</p>
                            </div>
                        )}
                    </div>
                </ScrollDiv>
            </DialogContent>
        </Dialog>
    )
}

export default DonationFormPickerDialog
