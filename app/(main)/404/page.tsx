"use client"

import NotFoundGif from "./404.gif"
import Image from "next/image"
import Header from "@/components/public-ui/Header"
import { FaArrowLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"

const NotFoundPage = () => {
    const router = useRouter()
    return (
        <div>
            <div className="w-8/12 h-fit py-16 mx-auto flex gap-12 flex-row items-center justify-center">
                <div className="w-1/2 aspect-auto">
                    <Image src={NotFoundGif} alt="404 Not Found" />
                </div>
                <div className="w-1/2 h-fit flex flex-col items-start justify-center gap-4 text-left">
                    <Header level={2} className="text-cinnamon text-left">
                        Looks like you've wandered off the range...
                    </Header>
                    <div className="text-ink text-[20px]">
                        The page you're looking for may have moved or it may no longer exist.
                    </div>
                    <div
                        onClick={() => router.back()}
                        className="flex flex-row items-center justify-start gap-2 cursor-pointer">
                        <FaArrowLeft /> <div>Go Back</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage