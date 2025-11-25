"use client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/public-ui/Dialog"

import SponsorAHerdWidget from "./SponsorAHerdWidget"

const SponsorAHerdDialog = ({ children }: { children: React.ReactNode }) => {
    return (
        <Dialog>
            <DialogContent>
                <SponsorAHerdWidget />
            </DialogContent>
            <DialogTrigger>
                {children}
            </DialogTrigger>
        </Dialog>
    )
}

export default SponsorAHerdDialog