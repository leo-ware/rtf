import { ImSpinner8 } from "react-icons/im"
import { cn } from "@/lib/utils"

const LargeLoader = ({ className }: { className?: string }) => {
    return (
        <div className={cn("w-full h-full min-h-[200px] flex items-center justify-center", className)}>
            <ImSpinner8 className="w-10 h-10 animate-spin" />
        </div>
    )
}

export default LargeLoader