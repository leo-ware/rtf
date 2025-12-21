import { cn } from "@/lib/utils"

const Callout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn(
            `mx-auto w-10/12 md:w-8/12
            h-fit font-serif text-[25px] text-pewter text-center
            `,
            className
        )}>
            {children}
        </div>
    )
}

export default Callout