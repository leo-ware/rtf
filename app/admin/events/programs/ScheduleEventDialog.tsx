"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, CalendarPlus, Loader2 } from "lucide-react"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { format } from "date-fns"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateTimePicker } from "@/components/DateTimePicker"
import { Input } from "@/components/ui/input"

type ScheduleEventDialogProps = {
    programId?: Id<"programs">
    children?: React.ReactNode
}

const ScheduleEventDialog = (props: ScheduleEventDialogProps) => {
    const createEventFromProgram = useMutation(api.programs.createEventFromProgram)
    const getAllPrograms = useQuery(api.programs.getAllPrograms)

    const fixedProgramId = !!props.programId
    const [programId, setProgramId] = useState<Id<"programs"> | undefined>(props.programId)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dateError, setDateError] = useState<string | null>(null)
    const [selectedDate, _setSelectedDate] = useState<Date>()
    const [selectedEndDate, _setSelectedEndDate] = useState<Date>()
    const [registrationLink, setRegistrationLink] = useState("")

    const selectedProgram = getAllPrograms?.find((p) => p._id === programId)
    const requiresRegistration = selectedProgram?.requiresRegistration ?? false

    const setSelectedDate = (date: Date | undefined) => {
        _setSelectedDate(date)
        setDateError(null)
        if (date) {
            if (selectedEndDate && selectedEndDate < date) {
                setDateError("End date must be after start date")
            }
            if (!selectedEndDate) {
                _setSelectedEndDate(date)
            }
        }
    }

    const setSelectedEndDate = (date: Date | undefined) => {
        _setSelectedEndDate(date)
        setDateError(null)
        if (date) {
            if (selectedDate && selectedDate > date) {
                setDateError("Start date must be before end date")
            }
        }
    }

    const saveDisabled = (
        isLoading ||
        !selectedDate ||
        !selectedEndDate ||
        !(selectedDate < selectedEndDate) ||
        (requiresRegistration && !registrationLink.trim())
    )

    const handleCreateEvent = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            if (!programId) {
                throw new Error("Program ID is required")
            }
            await createEventFromProgram({
                programId,
                startDate: selectedDate!.toISOString(),
                endDate: selectedEndDate!.toISOString(),
                registrationLink: requiresRegistration ? registrationLink.trim() : undefined,
            })
            setIsOpen(false)
            resetForm()
        } catch (err) {
            console.error("Error creating event from program:", err)
            setError(`Failed to create event from program. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setSelectedDate(undefined)
        setSelectedEndDate(undefined)
        setRegistrationLink("")
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                {props.children
                    ? props.children
                    : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        resetForm()
                                        setIsOpen(true)
                                    }}>
                                    <CalendarPlus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Add specific dates when this program will occur.
                            </TooltipContent>
                        </Tooltip>
                    )
                }
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule Event from Program</DialogTitle>
                    <DialogDescription>
                        Select dates to create a new event using the program as a template.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {!fixedProgramId && (
                        <div>
                            <Label>Program</Label>
                            <Select
                                value={programId || undefined}
                                onValueChange={(val) => (
                                    setProgramId(val as Id<"programs"> | undefined)
                                )}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAllPrograms?.map((program) => (
                                        <SelectItem key={program._id} value={program._id}>
                                            {program.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div>
                        <Label>Start Date/Time</Label>
                        <DateTimePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            disabled={isLoading}
                            dateRequired={true}
                            timeRequired={true}
                        />
                    </div>
                    <div>
                        <Label>End Date/Time</Label>
                        <DateTimePicker
                            value={selectedEndDate}
                            onChange={setSelectedEndDate}
                            disabled={isLoading}
                            dateRequired={true}
                            timeRequired={true}
                        />
                    </div>

                    {requiresRegistration && (
                        <div>
                            <Label htmlFor="registrationLink">Registration Link <span className="text-red-500">*</span></Label>
                            <Input
                                id="registrationLink"
                                value={registrationLink}
                                disabled={isLoading}
                                onChange={(e) => setRegistrationLink(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    {dateError && (
                        <div className="text-red-500 text-sm">{dateError}</div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false)
                                resetForm()
                            }}
                            disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateEvent} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Event"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ScheduleEventDialog

