"use client"

import Header from "@/components/public-ui/Header"
import { useRouter } from "next/navigation"
import { FaHorseHead } from "react-icons/fa6"

const HelloPage = () => {
    const router = useRouter()
    return (
        <div>
            <div className="w-8/12 h-fit py-16 mx-auto flex gap-12 flex-col items-center justify-center">
                <FaHorseHead className="text-cinnamon text-[120px]" />
                <Header level={2} className="text-cinnamon text-center">
                    Well, hello there, trailblazer!
                </Header>
                <div className="text-ink text-[20px] text-center max-w-lg">
                    You found our secret pasture. There's not much here yet, but thanks for stopping by — the horses say neigh-maste.
                </div>
                <div
                    onClick={() => router.push("/")}
                    className="flex flex-row items-center justify-start gap-2 cursor-pointer text-cinnamon hover:underline">
                    <FaHorseHead /> <div>Back to the herd</div>
                </div>
            </div>
        </div>
    )
}

export default HelloPage
