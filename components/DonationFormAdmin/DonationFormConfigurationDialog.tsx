"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import DonationFormCreateDialog from "./DonationFormCreateDialog"
import DonationFormDeleteDialog from "./DonationFormDeleteDialog"
import DonationFormEditDialog, { type DonationForm } from "./DonationFormEditDialog"
import { Button } from "@/components/ui/button"

type DonationFormConfigurationDialogProps = {
    donationFormId: Id<"donationForms"> | null | undefined
    setDonationFormId: (donationFormId: Id<"donationForms"> | null | undefined) => void
}

const DonationFormEditAndDeleteForId = ({
    donationFormId,
    setDonationFormId,
}: {
    donationFormId: Id<"donationForms">
    setDonationFormId: (donationFormId: Id<"donationForms"> | null | undefined) => void
}) => {
    const donationForm = useQuery(api.donationForms.getDonationForm, { id: donationFormId })

    if (donationForm === undefined) {
        return (
            <Button variant="outline" size="sm" disabled>
                Loading donation form...
            </Button>
        )
    }

    if (donationForm === null) {
        return (
            <Button variant="outline" size="sm" disabled>
                Donation form not found
            </Button>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <DonationFormEditDialog donationForm={donationForm as DonationForm} />
            <DonationFormDeleteDialog
                donationFormId={donationFormId}
                onDeleted={() => setDonationFormId(null)}
            />
        </div>
    )
}

const DonationFormConfigurationDialog = ({
    donationFormId,
    setDonationFormId,
}: DonationFormConfigurationDialogProps) => {
    if (donationFormId === undefined) {
        return null
    }

    if (donationFormId === null) {
        return (
            <DonationFormCreateDialog onCreated={(id) => setDonationFormId(id)} />
        )
    }

    return (
        <DonationFormEditAndDeleteForId
            donationFormId={donationFormId}
            setDonationFormId={setDonationFormId}
        />
    )
}

export default DonationFormConfigurationDialog


