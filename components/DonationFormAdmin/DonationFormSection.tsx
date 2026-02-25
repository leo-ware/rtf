"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Heart, X } from "lucide-react"
import DonationFormPickerDialog from "./DonationFormPickerDialog"
import DonationFormEditDialog, { type DonationForm } from "./DonationFormEditDialog"

export type DonationFormSectionProps = {
    donationFormId: Id<"donationForms"> | null | undefined
    setDonationFormId: (id: Id<"donationForms"> | null | undefined) => void
    disabled?: boolean
}

const DonationFormSection = ({ donationFormId, setDonationFormId, disabled }: DonationFormSectionProps) => {
    const donationForm = useQuery(
        api.donationForms.getDonationForm,
        donationFormId ? { id: donationFormId } : "skip"
    )

    if (donationFormId === undefined) {
        return (
            <div className="space-y-2">
                <Label>Donation Form (Optional)</Label>
                <DonationFormPickerDialog
                    donationFormId={null}
                    onDonationFormSelect={(id) => setDonationFormId(id)}
                    disabled={disabled}
                >
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Donation Form
                    </Button>
                </DonationFormPickerDialog>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <Label>Donation Form (Optional)</Label>
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">
                        {donationForm?.name || "Loading..."}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <DonationFormPickerDialog
                        donationFormId={donationFormId}
                        onDonationFormSelect={(id) => setDonationFormId(id)}
                        disabled={disabled}
                    >
                        <Button variant="ghost" size="sm" disabled={disabled}>
                            Change
                        </Button>
                    </DonationFormPickerDialog>
                    {donationForm && (
                        <DonationFormEditDialog donationForm={donationForm as DonationForm}>
                            <Button variant="ghost" size="sm" disabled={disabled}>
                                Edit
                            </Button>
                        </DonationFormEditDialog>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDonationFormId(undefined)}
                        disabled={disabled}
                        className="text-green-600 hover:text-green-800"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DonationFormSection
