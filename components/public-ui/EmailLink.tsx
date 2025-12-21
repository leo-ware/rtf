import { cn } from "@/lib/utils"

const EmailLink = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <span className={cn("inline text-cinnamon underline cursor-pointer", className)}>
            {children}
        </span>
    )
}

export default EmailLink;