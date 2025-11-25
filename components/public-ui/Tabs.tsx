"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type TabItem = {
    id: string,
    title: string,
    content: React.ReactNode
}

const Tabs = ({ 
    items, 
    className, 
    showDivider = true,
    defaultTabSelector
}: { 
    items: TabItem[], 
    className?: string, 
    showDivider?: boolean,
    defaultTabSelector?: (item: TabItem) => boolean
}) => {
    const getDefaultTab = () => {
        if (defaultTabSelector) {
            const defaultItem = items.find(defaultTabSelector)
            if (defaultItem) return defaultItem.id
        }
        return items[0]?.id || ""
    }
    
    const [activeTab, setActiveTab] = useState<string>(getDefaultTab())
    return (
        <div className={cn(
            `w-10/12 mx-auto h-fit flex flex-col items-center justify-center ${showDivider && 'border-t-2 border-black'}`,
            className
            )}>
            <div className="w-3/4 h-fit my-8 flex items-center justify-center flex-wrap gap-4">
                {items.map(({id, title}) => (
                    <div
                        key={id}
                        className={`
                            cursor-pointer px-2
                            text-md uppercase font-semibold
                            ${activeTab === id ? "text-cinnamon" : "text-ink"}
                        `}
                        onClick={() => setActiveTab(id)}
                    >
                        {title}
                    </div>
                ))}
            </div>

            <div className="w-full h-fit">
                {items.find(({id}) => id === activeTab)?.content}
            </div>

        </div>
    )
}

export default Tabs