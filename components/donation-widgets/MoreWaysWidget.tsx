import CardLayout from "@/components/public-ui/CardLayout"
import { DonatePanel } from "./DonationLinks"

const MoreWaysWidget = () => {
    return (
        <div className="w-full flex flex-col gap-6">
            <div className="text-4xl font-serif text-cinnamon">
                Other ways to support RTF
            </div>

            <div className="w-10/12 mx-auto h-fit">
                <CardLayout>
                    <DonatePanel title="Capital Campaign In Honor of Robert Redford" />
                    <DonatePanel title="Sponsor a Herd" />
                    <DonatePanel title="Wishlist" />
                </CardLayout>
            </div>
        </div>
    )
}

export default MoreWaysWidget;