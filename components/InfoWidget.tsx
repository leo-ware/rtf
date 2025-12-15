"use client"

import { Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"

const InfoWidget = ({ children }: { children: React.ReactNode }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
                {children}
            </TooltipContent>
        </Tooltip>
    )
}

export default InfoWidget;