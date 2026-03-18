"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Calendar as CalendarIcon,
    Folder,
    BookOpen,
    // Ticket,
} from "lucide-react"

import EventsTab from "./events/EventsTab"
import ProgramGroupsTab from "./programGroups/ProgramGroupsTab"
import ProgramsTab from "./programs/ProgramsTab"
// import DiscountCodesTab from "./discountCodes/DiscountCodesTab"

const AdminEventsPage = () => {
    useEffect(() => {
        document.title = "Special Events & Programs - RTF Admin"
    }, [])

    const [activeTab, setActiveTab] = useState<
        "events" | "programGroups" | "programs"
    >("events")

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Controls */}

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as any)}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            value="events"
                            className="flex items-center gap-2"
                        >
                            <CalendarIcon className="h-4 w-4" />
                            Events
                        </TabsTrigger>
                        <TabsTrigger
                            value="programs"
                            className="flex items-center gap-2"
                        >
                            <BookOpen className="h-4 w-4" />
                            Programs
                        </TabsTrigger>
                        <TabsTrigger
                            value="programGroups"
                            className="flex items-center gap-2"
                        >
                            <Folder className="h-4 w-4" />
                            Program Groups
                        </TabsTrigger>
                        {/*<TabsTrigger value="discountCodes" className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            Discount Codes
                        </TabsTrigger>*/}
                    </TabsList>

                    <TabsContent value="events" className="space-y-6">
                        <EventsTab />
                    </TabsContent>

                    <TabsContent value="programs" className="space-y-6">
                        <ProgramsTab />
                    </TabsContent>

                    <TabsContent value="programGroups" className="space-y-6">
                        <ProgramGroupsTab />
                    </TabsContent>
                    {/*
                    <TabsContent value="discountCodes" className="space-y-6">
                        <DiscountCodesTab />
                    </TabsContent>*/}
                </Tabs>
            </div>
        </div>
    )
}

export default AdminEventsPage
