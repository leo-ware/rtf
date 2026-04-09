"use client"

import SpiritImage from "./spirit-hidley.jpg"
import Image from "next/image"
import Header from "@/components/public-ui/Header"
import { FaArrowLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"

const NotFoundPage = () => {
    const router = useRouter()
    return (
        <div>
            <div className="w-10/12 lg:w-8/12 h-fit py-16 mx-auto flex gap-8 lg:gap-12 flex-col lg:flex-row items-center justify-center">
                <div className="w-full md:w-2/3 lg:w-1/2 aspect-auto">
                    <Image src={SpiritImage} alt="Spirit" className="w-full h-auto" />
                </div>
                <div className="w-full lg:w-1/2 h-fit flex flex-col items-start justify-center gap-4 text-left">
                    <Header level={2} className="text-cinnamon !text-left">
                        404: Page Not Found
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