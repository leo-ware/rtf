import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import List from "@/components/public-ui/List"
import MoreWaysWidget from "../widgets/MoreWaysWidget"
import Header from "@/components/public-ui/Header"

import hero from "./hero.jpg"

const WishlistPage = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-16 mb-12 items-center justify-start text-center">
            <Hero title="Wishlist" image={hero} />
            <Callout className="text-cinnamon">
                Return to Freedom's sanctuary supports the lives of 500 wild horses and 51 burros.
                We are always in need of supplies, horse care products, equipment, vehicles and tools.
                Please browse our items below. If you have items on this list in good condition that
                you no longer need, you can make an in kind donation! Or you can make a donation
                for a specific item so that we can make a purchase! Please email us at info@returntofreedom.org
                or call us at (805) 737-9246.
            </Callout>
            <div className="w-10/12 mx-auto h-fit flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <div>
                        <Header color="pewter" level={2} className="mb-4">
                            Sanctuary Operations
                        </Header>
                        <List>{[
                            "https://careasy.org/return-to-freedom-inc",
                            "Small tractors and accessories (bucket, scraper, etc.)",
                            "FEED TRUCK-1/2 Ton 4 WD automatic flatbed (good condition)",
                            "3/4-1 Ton 4 WD Pick Up Truck",
                            "John Deere Utility vehicle (https://tinyurl.com/4arnd647)",
                            "Dump Trailer (https://tinyurl.com/2hhc337p)",
                            "Tools",
                            "16’ Stock Trailer, gooseneck",
                            "Generators",
                            "Welder",
                            "Sucker Rod",
                            "Oil field pipe (2” or 2 7/8)",
                            "6’ steel Pipe Panels",
                            "Weed Whackers",
                            "Lumber, Plywood, 2×12 planks, decking",
                        ]}</List>
                    </div>
                    <div>
                        <Header color="pewter" level={2} className="mb-4">
                            Education & Program Support
                        </Header>
                        <List>{[
                            "All terrain vehicles for hills (Polaris)",
                            "Portable Cabins (LINK : https://parkmodels.com/cavco/)"
                        ]}</List>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <div>
                        <Header color="pewter" level={2} className="mb-4">
                            Horse Care & Safety Supplies
                        </Header>
                        <List>{[
                            "Hay and feed",
                            "Water Troughs",
                            "Wormer, meds and supplements",
                            "Tipperary Ride-Lite Vests (https://tinyurl.com/4zt2pvmv) M, L, XL any color",
                            "Rubber mats",
                            "Break away and/or leather halters",
                            "Lead ropes",
                            "Manure forks",
                            "Rakes",
                        ]}</List>
                    </div>
                    <div>
                        <Header color="pewter" level={2} className="mb-4">
                            Office & Photographic Equipment
                        </Header>
                        <List>{[
                            "Digital projectors",
                            "Camera equipment (digital)",
                            "Video camera — Broadcast quality High Definition",
                        ]}</List>
                    </div>
                </div>
            </div>

            <MoreWaysWidget />
        </div>
    )
}

export default WishlistPage