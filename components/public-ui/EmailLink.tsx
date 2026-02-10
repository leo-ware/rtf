"use client"

import { cn } from "@/lib/utils"
import { toast } from "sonner"

type EmailLinkProps = {
    children: React.ReactNode
    email?: string
    className?: string
}

const EmailLink = ({ children, email, className }: EmailLinkProps) => {
    const emailAddress = email ?? (typeof children === 'string' ? children : null)

    const handleClick = async () => {
        if (!emailAddress) return
        try {
            await navigator.clipboard.writeText(emailAddress)
            toast.success('Email copied to clipboard')
        } catch {
            toast.error('Could not copy email')
        }
    }

    return (
        <span
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick()
                }
            }}
            className={cn(
                "text-cinnamon underline cursor-pointer hover:opacity-80 transition-opacity",
                className
            )}
            role="button"
            tabIndex={0}
            title={`Click to copy: ${emailAddress}`}
        >
            {children}
        </span>
    )
}

export default EmailLink
