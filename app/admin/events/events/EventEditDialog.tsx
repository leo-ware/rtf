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
import { Input } from "@/components/ui/input"
import { Loader2, AlertTriangle, Calendar as CalendarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { DateTimePicker } from "@/components/DateTimePicker"

type EventEditDialogProps = {
    eventId: Id<"events">
    children?: React.ReactNode
}

const EventEditDialog = (props: EventEditDialogProps) => {
    const updateEvent = useMutation(api.events.updateEvent)
    const event = useQuery(api.events.getEventById, { id: props.eventId })

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dateError, setDateError] = useState<string | null>(null)
    const [selectedDate, _setSelectedDate] = useState<Date>()
    const [selectedEndDate, _setSelectedEndDate] = useState<Date>()
    const [registrationLink, setRegistrationLink] = useState("")

    // Initialize dates and registration link when event data loads
    useEffect(() => {
        if (event && isOpen) {
            _setSelectedDate(new Date(event.startDate))
            _setSelectedEndDate(new Date(event.endDate))
            setRegistrationLink(event.registrationLink || "")
        }
    }, [event, isOpen])

    const setSelectedDate = (date: Date | undefined) => {
        _setSelectedDate(date)
        setDateError(null)
        if (date) {
            if (selectedEndDate && selectedEndDate < date) {
                setDateError("End date must be after start date")
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

    // Duration warning
    const durationWarning = selectedDate && selectedEndDate && selectedDate >= selectedEndDate
        ? "Warning: Event has zero or negative duration"
        : null

    const saveDisabled = (
        isLoading ||
        !selectedDate ||
        !selectedEndDate ||
        !(selectedDate < selectedEndDate)
    )

    const handleUpdateEvent = async () => {
        if (saveDisabled) return

        setIsLoading(true)
        setError(null)
        try {
            await updateEvent({
                id: props.eventId,
                startDate: selectedDate!.toISOString(),
                endDate: selectedEndDate!.toISOString(),
                registrationLink: registrationLink.trim() || undefined,
            })
            setIsOpen(false)
        } catch (err) {
            console.error("Error updating event:", err)
            setError(`Failed to update event. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        if (event) {
            _setSelectedDate(new Date(event.startDate))
            _setSelectedEndDate(new Date(event.endDate))
            setRegistrationLink(event.registrationLink || "")
        }
        setError(null)
        setDateError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (open) {
                resetForm()
            }
        }}>
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
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Edit event scheduling
                            </TooltipContent>
                        </Tooltip>
                    )
                }
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Event Schedule</DialogTitle>
                    <DialogDescription>
                        Update the start and end dates for this event.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {event && (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Event:</span> {event.title}
                        </div>
                    )}
                    <div>
                        <Label>Start Date/Time <span className="text-red-500">*</span></Label>
                        <DateTimePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            disabled={isLoading}
                            dateRequired={true}
                            timeRequired={true}
                        />
                    </div>
                    <div>
                        <Label>End Date/Time <span className="text-red-500">*</span></Label>
                        <DateTimePicker
                            value={selectedEndDate}
                            onChange={setSelectedEndDate}
                            disabled={isLoading}
                            dateRequired={true}
                            timeRequired={true}
                        />
                    </div>

                    <div>
                        <Label htmlFor="registrationLink">Registration Link</Label>
                        <Input
                            id="registrationLink"
                            value={registrationLink}
                            disabled={isLoading}
                            onChange={(e) => setRegistrationLink(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    {dateError && (
                        <div className="text-red-500 text-sm">{dateError}</div>
                    )}
                    {durationWarning && (
                        <div className="text-amber-600 text-sm flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            {durationWarning}
                        </div>
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
                        <Button onClick={handleUpdateEvent} disabled={saveDisabled}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EventEditDialog

