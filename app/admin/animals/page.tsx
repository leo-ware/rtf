"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { FileText, Users } from "lucide-react"
import AnimalsTab from "./animals/AnimalsTab"
import HerdsTab from "./herds/HerdsTab"

const AdminAnimalsPage = () => {
    useEffect(() => {
        document.title = "Animals & Herds - RTF Admin"
    }, [])

    const [activeTab, setActiveTab] = useState<"animals" | "herds">("animals")

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "animals" | "herds")} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="animals" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Animals
                        </TabsTrigger>
                        <TabsTrigger value="herds" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Herds
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="animals" className="space-y-6">
                        <AnimalsTab />
                    </TabsContent>

                    <TabsContent value="herds" className="space-y-6">
                        <HerdsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AdminAnimalsPage
