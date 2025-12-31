"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Search } from "lucide-react"
import ConvexImageFromId from "@/components/images/ConvexImageFromId"
import { format } from "date-fns"
import ProgramCreateDialog from "./ProgramCreateDialog"
import ProgramEditDialog from "./ProgramEditDialog"
import ProgramDeleteDialog from "./ProgramDeleteDialog"
import ScheduleEventDialog from "./ScheduleEventDialog"
import ReorderableList from "@/components/ReorderableList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ProgramsTab = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterProgramGroup, setFilterProgramGroup] = useState<Id<"programGroups"> | "all">("all")

    const programs = useQuery(api.programs.getAllPrograms)
    const programGroups = useQuery(api.programGroups.getAllProgramGroups)
    const reorderPrograms = useMutation(api.programs.reorderPrograms)

    const handleReorder = async (newOrder: string[]) => {
        await reorderPrograms({ ids: newOrder as Id<"programs">[] })
    }

    const filtering = !!searchTerm
    const filteredPrograms = (programs || [])
        .sort((a, b) => a.order - b.order)
        .filter(program => {
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return (
                program.name.toLowerCase().includes(searchLower) ||
                program.description.toLowerCase().includes(searchLower) ||
                (!!program.location
                    ? program.location?.name?.toLowerCase().includes(searchLower) ?? false
                    : false)
            )
        })
        .filter(program => {
            if (filterProgramGroup === "all") return true
            return program.programGroupId === filterProgramGroup
        })

    if (programs === undefined) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-4">
                <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="w-auto min-w-60">
                    <Select
                        value={filterProgramGroup}
                        onValueChange={(value) => setFilterProgramGroup(value as Id<"programGroups"> | "all")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by program group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {programGroups?.map((group) => (
                                <SelectItem key={group._id} value={group._id}>
                                    {group.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <ProgramCreateDialog />
                </div>
            </div>

            <div className="text-lg font-medium mb-4">
                {filtering
                    ? `Search Results for "${searchTerm}"`
                    : "All Programs"}
            </div>

            <Accordion type="single" collapsible className="w-full">
                <ReorderableList
                    onReorder={handleReorder}
                    disabled={filtering}
                    items={filteredPrograms.map((program) => ({
                        id: program._id,
                        widget: (
                            <AccordionItem key={program._id} value={program._id} className="w-full mr-4">
                                <div className="w-full grid grid-cols-[auto_1fr_auto] gap-x-4 my-2">
                                    <div className="col-span-3 grid grid-cols-subgrid">
                                        <div className="col-span-1 flex items-center gap-2">
                                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                {program.imageId ? (
                                                    <ConvexImageFromId
                                                        imageId={program.imageId}
                                                        className="w-16 h-16"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium">{program.name}</span>
                                                    {program.programGroup && (
                                                        <Badge variant="outline" className="border-2">
                                                            {program.programGroup?.name}
                                                        </Badge>
                                                    )}
                                                    <Badge variant={program.isPublic ? "default" : "secondary"}>
                                                        {program.isPublic ? "Public" : "Private"}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {program.location?.name ?? "No location set"}
                                                    {program.ticketPriceId && " • Pricing configured"}
                                                    {program.maxAttendees && ` • Max ${program.maxAttendees}`}
                                                    {program.requiresRegistration && " • Registration Required"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex items-center gap-2 flex-shrink-0">
                                            <ScheduleEventDialog programId={program._id} />
                                            <ProgramEditDialog program={program} />
                                            <ProgramDeleteDialog programId={program._id} />
                                            <AccordionTrigger className="hover:no-underline p-0 [&>svg]:h-4 [&>svg]:w-4" />
                                        </div>
                                    </div>

                                    <div className="col-start-2 col-span-1">
                                        <AccordionContent>
                                            <div className="mt-4 space-y-5">
                                                {/* Description - short summary */}
                                                <p className="text-gray-600 leading-relaxed">{program.description}</p>

                                                {/* Details - longer content */}
                                                {program.details && (
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="font-semibold text-gray-800 mb-2">Details</h4>
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: program.details }}
                                                            className="prose prose-sm" />
                                                    </div>
                                                )}

                                                {/* Contact & Registration Info */}
                                                {(program.contactEmail || program.contactPhone || program.maxAttendees || program.requiresRegistration) && (
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="font-semibold text-gray-800 mb-2">Registration & Contact</h4>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            {program.maxAttendees && (
                                                                <div>
                                                                    <span className="text-gray-500">Max Attendees:</span>{" "}
                                                                    <span className="text-gray-700">{program.maxAttendees}</span>
                                                                </div>
                                                            )}
                                                            {program.requiresRegistration !== undefined && (
                                                                <div>
                                                                    <span className="text-gray-500">Requires Registration:</span>{" "}
                                                                    <span className="text-gray-700">{program.requiresRegistration ? "Yes" : "No"}</span>
                                                                </div>
                                                            )}
                                                            {program.contactEmail && (
                                                                <div>
                                                                    <span className="text-gray-500">Email:</span>{" "}
                                                                    <a href={`mailto:${program.contactEmail}`} className="text-blue-600 hover:underline">
                                                                        {program.contactEmail}
                                                                    </a>
                                                                </div>
                                                            )}
                                                            {program.contactPhone && (
                                                                <div>
                                                                    <span className="text-gray-500">Phone:</span>{" "}
                                                                    <a href={`tel:${program.contactPhone}`} className="text-blue-600 hover:underline">
                                                                        {program.contactPhone}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Upcoming Events */}
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <h4 className="font-semibold text-gray-800 mb-3">Upcoming Events</h4>
                                                    {(() => {
                                                        const now = Date.now()
                                                        const upcomingEvents = program.events
                                                            .filter((event) => event.dateNumber > now)
                                                            .sort((a, b) => a.dateNumber - b.dateNumber)
                                                            .slice(0, 3)

                                                        if (upcomingEvents.length === 0) {
                                                            return (
                                                                <p className="text-gray-400 italic text-sm">No upcoming events scheduled</p>
                                                            )
                                                        }

                                                        return (
                                                            <div className="space-y-2">
                                                                {upcomingEvents.map((event) => (
                                                                    <div
                                                                        key={event._id}
                                                                        className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-200"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="text-sm">
                                                                                <span className="font-medium text-gray-800">
                                                                                    {format(new Date(event.startDate), "EEE, MMM d, yyyy")}
                                                                                </span>
                                                                                <span className="text-gray-500 ml-2">
                                                                                    {format(new Date(event.startDate), "h:mm a")}
                                                                                    {event.endDate && ` – ${format(new Date(event.endDate), "h:mm a")}`}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {/* <Badge variant={event.isPublic ? "default" : "secondary"} className="text-xs">
                                                                            {event.isPublic ? "Public" : "Private"}
                                                                        </Badge> */}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )
                                                    })()}
                                                </div>

                                                {/* Creation timestamp */}
                                                <div className="text-xs text-gray-400">
                                                    Created {format(new Date(program._creationTime), "MMM dd, yyyy")}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </div>
                                </div>
                            </AccordionItem>
                        )
                    }))}
                />
            </Accordion>

            {filteredPrograms.length === 0 && (
                <div className="text-center py-12 w-full">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
                    <p className="text-gray-600 mb-4">
                        {(searchTerm || (filterProgramGroup !== "all"))
                            ? `No programs match your selected criteria`
                            : "Get started by creating your first program."
                        }
                    </p>
                </div>
            )}
        </>
    )
}

export default ProgramsTab
