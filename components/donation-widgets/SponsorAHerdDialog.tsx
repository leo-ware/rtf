import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/public-ui/Dialog"
import Button from "@/components/public-ui/Button"
import SponsorAHerdWidget from "./SponsorAHerdWidget"
import { Id } from "@/convex/_generated/dataModel"

const SponsorAHerdDialog = ({ title, defaultHerdId }: { title?: string, defaultHerdId?: Id<"herds"> }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button color="cinnamon">
                    {title || "Sponsor a Herd"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <SponsorAHerdWidget defaultHerdId={defaultHerdId} />
            </DialogContent>
        </Dialog>
    )
}

export default SponsorAHerdDialog