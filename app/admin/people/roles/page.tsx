"use client"

import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonListWidget from "./PersonListWidget"
import { roles, roleTypeToLabel } from "./types"

const RolesTab = () => {
    useEffect(() => {
        document.title = "People Roles - RTF Admin"
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Manage Roles</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Drag and drop to reorder. Changes are saved automatically.
                </p>
            </div>

            <Tabs defaultValue={roles[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    {roles.map((role) => (
                        <TabsTrigger key={role} value={role}>{roleTypeToLabel(role)}</TabsTrigger>
                    ))}
                </TabsList>

                {roles.map((role) => (
                    <TabsContent key={role} value={role} className="mt-6">
                        <PersonListWidget personType={role} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default RolesTab
