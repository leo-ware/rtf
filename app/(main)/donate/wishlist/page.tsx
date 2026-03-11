"use client"

import { useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import List from "@/components/public-ui/List"
import MoreWaysWidget from "../../../../components/donation-widgets/MoreWaysWidget"
import Header from "@/components/public-ui/Header"
import PublicButton from "@/components/public-ui/Button"
import Link from "next/link"

import hero from "./hero.jpg"

const WishlistPage = () => {
    useEffect(() => {
        document.title = "Wishlist - Return to Freedom"
    }, [])

    const wishlist = useQuery(api.wishlist.listPublicWishlist)

    // Distribute categories across two columns, balancing by total item count
    const [leftCategories, rightCategories] = (() => {
        if (!wishlist) return [[], []]
        const left: typeof wishlist = []
        const right: typeof wishlist = []
        let leftCount = 0
        let rightCount = 0
        for (const cat of wishlist) {
            const weight = cat.items.length + 1 // +1 for the header
            if (leftCount <= rightCount) {
                left.push(cat)
                leftCount += weight
            } else {
                right.push(cat)
                rightCount += weight
            }
        }
        return [left, right]
    })()

    const hasItems = wishlist && wishlist.some((cat) => cat.items.length > 0)

    const renderCategory = (cat: NonNullable<typeof wishlist>[number]) => (
        <div key={cat._id}>
            <Header color="pewter" level={3} className="mb-4 text-left">
                {cat.name}
            </Header>
            {cat.items.length > 0 && (
                <List>{cat.items.map((item) => {
                    if (item.link) {
                        return (
                            <span key={item._id}>
                                {item.name} (<a href={item.link} target="_blank" rel="noopener noreferrer" className="underline text-cinnamon">{item.link}</a>)
                            </span>
                        )
                    }
                    return item.name
                })}</List>
            )}
        </div>
    )

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
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                <Header color="pewter" level={2}>
                    Items Needed
                </Header>
                <p className="text-gray-600">
                    Donations of materials, tools, and equipment go a long way in helping us
                    provide daily care for our horses and burros. Every item on this list directly
                    supports sanctuary operations — from maintaining safe fencing and shelters to
                    ensuring our animals receive proper nutrition and veterinary care.
                </p>
                <Link href="/contact" className="mx-auto">
                    <PublicButton color="cinnamon" size="large">
                        Donate an Item
                    </PublicButton>
                </Link>
            </div>
            {wishlist === undefined ? (
                <div className="w-10/12 mx-auto animate-pulse">
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            ) : !hasItems ? (
                <div className="max-w-lg mx-auto text-center py-8">
                    <p className="text-lg text-gray-600">
                        We don't have any specific items on our wishlist right now. Thank you for thinking of us!
                        If you'd like to support the sanctuary, please consider making a{" "}
                        <a href="/donate" className="underline text-cinnamon">donation</a>.
                    </p>
                </div>
            ) : (
                <div className="w-10/12 xl:w-8/12 mx-auto h-fit flex flex-col lg:flex-row gap-8 lg:gap-16">
                    <div className="w-full lg:w-1/2 flex flex-col gap-8">
                        {leftCategories.map(renderCategory)}
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col gap-8">
                        {rightCategories.map(renderCategory)}
                    </div>
                </div>
            )}

            <MoreWaysWidget />
        </div>
    )
}

export default WishlistPage
