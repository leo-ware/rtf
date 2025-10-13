import { cn } from "@/lib/utils"

const LongRightArrow = ({ className, size = 37 }: { className?: string, size?: number }) => {
    
    const width = size
    const height = size * (16 / 37)

    return (
        <div className={cn("w-fit aspect-square flex items-center justify-center", className)}>
            <svg
                width={size}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M36.7071 8.70711C37.0976 8.31659 37.0976 7.68342 36.7071 7.2929L30.3431 0.928935C29.9526 0.53841 29.3195 0.53841 28.9289 0.928935C28.5384 1.31946 28.5384 1.95262 28.9289 2.34315L34.5858 8L28.9289 13.6569C28.5384 14.0474 28.5384 14.6805 28.9289 15.0711C29.3195 15.4616 29.9526 15.4616 30.3431 15.0711L36.7071 8.70711ZM0 8L-8.74228e-08 9L36 9L36 8L36 7L8.74228e-08 7L0 8Z"
                fill="white"/>
            </svg>
        </div>
    )
}

export default LongRightArrow