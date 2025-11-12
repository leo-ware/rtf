import { cn } from "@/lib/utils"

const Header = (
    {className, color="pewter", children, level = 1}:
    {className?: string, color?: string, children: string, level?: 1 | 2 | 3}
) => {
    return (
        <div className={cn(
            `w-full text-${color} text-center font-serif
            ${level === 1 && "text-[48px]"}
            ${level === 2 && "text-[32px]"}
            ${level === 3 && "text-[24px]"}`,
            className
        )}>
            {children}
        </div>
    )
}

export default Header