"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import DonationFormCreateDialog from "@/app/admin/donation-forms/DonationFormCreateDialog"

type DonationFormSelectorProps = {
    value: Id<"donationForms"> | null
    onChange: (value: Id<"donationForms"> | null) => void
    disabled?: boolean
}

const DonationFormSelector = ({ value, onChange, disabled = false }: DonationFormSelectorProps) => {
    const donationForms = useQuery(api.donationForms.listDonationForms)
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    const handleFormCreated = (newFormId: Id<"donationForms">) => {
        onChange(newFormId)
        setShowCreateDialog(false)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Select
                    value={value || ""}
                    onValueChange={(val) => onChange(val as Id<"donationForms">)}
                    disabled={disabled}
                >
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a donation form..." />
                    </SelectTrigger>
                    <SelectContent>
                        {donationForms?.map((form) => (
                            <SelectItem key={form._id} value={form._id}>
                                {form.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {value && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onChange(null)}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateDialog(true)}
                disabled={disabled}
                className="w-fit"
            >
                <Plus className="h-4 w-4 mr-2" />
                Create New Form
            </Button>
            <DonationFormCreateDialog
                isOpen={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onCreated={handleFormCreated}
            />
        </div>
    )
}

export default DonationFormSelector
