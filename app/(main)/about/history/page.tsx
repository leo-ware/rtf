"use client"

import Image from "next/image"

import HistoryHeroImg from "./history-hero-image.jpg"
import { VisibilityTracker, useVisibility } from "@/components/VisibilityTracker"

// const VisibilityInner = () => {
//     const { percentScroll } = useVisibility()

//     const innerMax = percentScroll["history-inner"]

//     const yearOpacity = Math.min(innerMax * 2, 100)

//     return (
//         <div className="relative w-full h-[400px] border border-red-500 p-12">

//             <div>{yearOpacity} {innerMax}</div>
//             <div
//                 className="absolute text-[100px] font-bold"
//                 style={{
//                     fontFamily: "times new roman, serif",
//                     top: `50%`,
//                     opacity: `${yearOpacity}%`,
//                     left: "50%",
//                 }}>
//                 1967
//             </div>
//         </div>
//     )
// }

// const Timeline = () => {
//     const { pixelsScrolled } = useVisibility()
//     const scrolled = pixelsScrolled["history-outer"]

//     const topOffset = 200
//     const pbOffset = 150
//     const progress = Math.max(0, scrolled - topOffset - pbOffset)

//     const barStyle = {
//         position: `absolute` as const,
//         top: `${topOffset}px`,
//         left: `50%`,
//         width: `2px`,
//         backgroundColor: `black`,
//         height: `${progress}px`,
//     }
//     console.log(barStyle)

//     return (
//         <div style={barStyle} />
//     )
// }

const HistoryPage = () => {
    return (
        <div className="w-full h-fit">
            <div className="w-full h-[400px] relative flex items-center justify-center bg-sage-green">
                <Image
                    src={HistoryHeroImg}
                    alt="History Hero"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-top"
                    fill
                />
                <div className="z-10 p-4 border-b border-white text-white text-4xl font-bold">
                    Our History
                </div>
            </div>

            {/* <div className="w-full h-[400px] bg-sage-green" />

            <VisibilityTracker id="history-outer" className="relative">
                <Timeline />
                <VisibilityTracker id="history-inner">
                    <VisibilityInner />
                </VisibilityTracker>
                <VisibilityTracker id="history-inner">
                    <VisibilityInner />
                </VisibilityTracker>
            </VisibilityTracker>

            <div className="w-full h-[400px] bg-sage-green" /> */}
        </div>
    )
}

export default HistoryPage