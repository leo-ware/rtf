import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Header from "./public-ui/Header"

const TitledText = ({ title, children, color = "pewter", className }: { title: string, children: string, color?: string, className?: string }) => {
    return (
        <div className={cn("mx-auto w-10/12 md:w-8/12 h-fit flex flex-col items-center justify-center gap-4", className)}>
            <Header color={color}>
                {title}
            </Header>
            <div className="text-lg text-ink text-center">
                {children}
            </div>
        </div>
    )
}

export default TitledText