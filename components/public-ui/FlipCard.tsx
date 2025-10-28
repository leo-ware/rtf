import React from 'react'
import { twMerge } from 'tailwind-merge'

interface FlipCardProps {
    frontContent: React.ReactNode
    backContent: React.ReactNode
    className?: string
    width?: string
    height?: string
}

const FlipCard: React.FC<FlipCardProps> = ({
    frontContent,
    backContent,
    className = '',
}) => {
    return (
        <div
            className={twMerge(
                `bg-transparent cursor-pointer [perspective:1000px] group`,
                `${className}`
            )}
        >
            <div className="relative w-full h-full text-center transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute w-full h-full [backface-visibility:hidden]">
                    {frontContent}
                </div>
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {backContent}
                </div>
            </div>
        </div>
    )
}

export default FlipCard
