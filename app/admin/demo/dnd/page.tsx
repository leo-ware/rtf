"use client";

import ReorderableList from "@/components/ReorderableList"
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

const DndDemoPage = () => {
    useEffect(() => {
        document.title = "Drag & Drop Demo - RTF Admin"
    }, [])
    const handleReorder = (newOrder: string[]) => {
        console.log(newOrder);
    }
    const [open, setOpen] = useState(false);
    return (
        <div className="container mx-auto">
            <Switch checked={open} onCheckedChange={setOpen} />
            
                <ReorderableList
                    items={[1, 2, 3, 4].map((num) => (
                        {
                            id: num.toString(),
                            widget: (
                                <div className="border border-red-500 flex items-center gap-2">
                                    Item {num}
                                </div>
                            )
                        }
                    ))}
                    onReorder={handleReorder}
                    disabled={!open}
                />
            
        </div>
    )
}

export default DndDemoPage