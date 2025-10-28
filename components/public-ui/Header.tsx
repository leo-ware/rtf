import { cn } from "@/lib/utils"

const Header = ({className, color="pewter", children}: {className?: string, color?: string, children: string}) => {
    return (
        <div className={cn(
            `w-full text-[48px] text-${color} text-center font-serif`,
            className
        )}>
            {children}
        </div>
    )
}

export default Header