"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layers, Folder, FileText } from "lucide-react"

import SuperGroupsTab from "./superGroups/SuperGroupsTab"
import GroupsTab from "./groups/GroupsTab"
import ArticlesTab from "./articles/ArticlesTab"

const AdminEducationArticlesPage = () => {
    const [activeTab, setActiveTab] = useState<"superGroups" | "groups" | "articles">("superGroups")

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as any)}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="articles" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Articles
                        </TabsTrigger>
                        <TabsTrigger value="groups" className="flex items-center gap-2">
                            <Folder className="h-4 w-4" />
                            Groups
                        </TabsTrigger>
                        <TabsTrigger value="superGroups" className="flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            Super Groups
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="superGroups" className="space-y-6">
                        <SuperGroupsTab />
                    </TabsContent>

                    <TabsContent value="groups" className="space-y-6">
                        <GroupsTab />
                    </TabsContent>

                    <TabsContent value="articles" className="space-y-6">
                        <ArticlesTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AdminEducationArticlesPage


