import { cn } from "@/lib/utils"

const EmailLink = ({ children, className, }: { children: React.ReactNode, className?: string, }) => {
    return (
        <div className={cn("inline text-cinnamon underline cursor-pointer", className)}>
            {children}
        </div>
    )
}

export default EmailLink;