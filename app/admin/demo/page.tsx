"use client"

import Image from "next/image"
import Link from "next/link"
import Button from "@/components/Button"
import Carosel from "@/components/Carousel"
import { useState } from "react"


const colors = ["red-500", "blue-500", "green-500", "yellow-500", "purple-500"]
const items = colors.map((color, index) => (
    <div className={`w-[100px] h-[100px] bg-green-500`}>
        <div className="text-md font-bold text-white p-4">Item #{index}</div>
    </div>
))

const DemoPage = () => {
    const [autoPlay, setAutoPlay] = useState(true)
    const [wrap, setWrap] = useState(true)

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start p-8">
            <div className="flex gap-2 mb-4">
                <Button color="pewter" onClick={() => setAutoPlay(!autoPlay)}>Auto Play: {autoPlay ? "On" : "Off"}</Button>
                <Button color="pewter" onClick={() => setWrap(!wrap)}>Wrap: {wrap ? "On" : "Off"}</Button>
            </div>
            <div className="h-[400px]">
                <Carosel items={items} nDisplayItems={3} autoPlay={"right"}/>
            </div>
        </div>
    )
}

export default DemoPage
