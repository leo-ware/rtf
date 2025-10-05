"use client"

import { twMerge } from "tailwind-merge"

type ButtonProps = {
    className?: string
    children?: React.ReactNode
    color: string
    onClick?: () => void
}

const Button = ({className, children, color = "pewter", onClick}: ButtonProps) => {
    return (
        <div className={twMerge(`
            rounded-xl border-1 w-fit flex items-center font-bold text-xs uppercase
            justify-center p-2 text-white text-sm bg-${color} border-${color}`,
            className)}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Button
