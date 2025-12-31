"use client"

import { DetailedHTMLProps, HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

type ButtonProps = {
    className?: string
    children?: React.ReactNode
    color?: string
    onClick?: () => void
    variant?: "default" | "outline"
    size?: "small" | "medium" | "large"
} & Partial<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>

const Button = ({
    className,
    children,
    color = "pewter",
    variant = "default",
    size = "small",
    ...props
}: ButtonProps) => {
    return (
        <div
            className={twMerge(`
                rounded-xl border-1 w-fit
                flex items-center justify-center
                font-bold text-xs uppercase text-white text-sm
                border-${color}
                ${
                    size === "small" ? "px-2 py-1" :
                    size === "medium" ? "p-2" :
                    size === "large" ? "px-4 py-2" :
                    ""}
                ${
                    variant === "default" ? `bg-${color}` :
                    variant === "outline" ? `text-${color}` :
                    ""
                }
                `,
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default Button
