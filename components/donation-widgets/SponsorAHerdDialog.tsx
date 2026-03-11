"use client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/public-ui/Dialog"
import Button from "@/components/public-ui/Button"
import SponsorAHerdWidget from "./SponsorAHerdWidget"
import { Id } from "@/convex/_generated/dataModel"

type Props = {
    children?: React.ReactNode
    title?: string
    defaultHerdId?: Id<"herds">
}

const SponsorAHerdDialog = ({ children, title, defaultHerdId }: Props) => {
    return (
        <Dialog className="w-full">
            <DialogTrigger className="w-full">
                {children || (
                    <Button color="cinnamon">
                        {title || "Sponsor a Herd"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <SponsorAHerdWidget defaultHerdId={defaultHerdId} />
            </DialogContent>
        </Dialog>
    )
}

export default SponsorAHerdDialog