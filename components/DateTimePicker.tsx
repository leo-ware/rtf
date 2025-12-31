"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateTimePickerProps = {
    value?: Date
    onChange?: (date: Date | undefined) => void
    dateRequired?: boolean
    timeRequired?: boolean
    disabled?: boolean
    placeholder?: string
    className?: string
    minDate?: Date
    maxDate?: Date
}

const DateTimePicker = ({
    value,
    onChange,
    dateRequired = false,
    timeRequired = false,
    disabled = false,
    placeholder = "Pick a date",
    className,
    minDate,
    maxDate,
}: DateTimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) {
            onChange?.(undefined)
            return
        }

        // Preserve existing time if we have a value
        if (value) {
            date.setHours(value.getHours())
            date.setMinutes(value.getMinutes())
            date.setSeconds(value.getSeconds())
        }

        onChange?.(date)

        // Close popover only if time is not required (date-only mode)
        if (!timeRequired) {
            setIsOpen(false)
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value
        if (!timeValue) return

        const [hours, minutes] = timeValue.split(":").map(Number)

        // Create new date or use existing
        const newDate = value ? new Date(value) : new Date()
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        newDate.setSeconds(0)

        onChange?.(newDate)
    }

    const formatDisplay = () => {
        if (!value) return placeholder

        if (timeRequired) {
            return format(value, "PPP 'at' p")
        }

        return format(value, "PPP")
    }

    const getTimeValue = () => {
        if (!value) return ""
        return format(value, "HH:mm")
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplay()}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                        if (minDate && date < minDate) return true
                        if (maxDate && date > maxDate) return true
                        return false
                    }}
                    required={dateRequired}
                />
                {timeRequired && (
                    <div className="border-t p-3">
                        <div className="flex justify-end gap-2">
                            {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
                            <Input
                                type="time"
                                value={getTimeValue()}
                                onChange={handleTimeChange}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

export { DateTimePicker }
export type { DateTimePickerProps }

