import { cn } from "@/lib/utils"

const CardLayout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("w-full h-fit gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ", className)}>
            {children}
        </div>
    )
}

export default CardLayout;