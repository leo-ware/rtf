"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin, Users, DollarSign, Edit, Trash2, Phone, Mail, FileText } from "lucide-react"
import { format } from "date-fns"
import { Id } from "@/convex/_generated/dataModel"

type Event = {
  _id: string
  title: string
  description: string
  startDate: number
  endDate: number
  location?: string
  eventType: string
  price?: number
  contactEmail?: string
  contactPhone?: string
  requiresRegistration: boolean
  maxAttendees?: number
  currentAttendees: number
  isPublic: boolean
}

type EventCalendarProps = {
  events: Event[]
  isAdminMode?: boolean
  onEditEvent?: (eventId: Id<"events">) => void
  onDeleteEvent?: (eventId: Id<"events">) => void
}

const EventCalendar = ({ events, isAdminMode = false, onEditEvent, onDeleteEvent }: EventCalendarProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Define event type colors
  const eventTypeColors: Record<string, string> = {
    tour: '#3b82f6', // blue
    volunteer: '#10b981', // green
    photo_safari: '#8b5cf6', // purple
    educational: '#f59e0b', // yellow
    fundraising: '#ef4444', // red
    other: '#6b7280', // gray
  }

  const eventTypeLabels: Record<string, string> = {
    tour: "Tour",
    volunteer: "Volunteer",
    photo_safari: "Photo Safari",
    educational: "Educational",
    fundraising: "Fundraising",
    other: "Other"
  }

  // Get events for current month (including multiday events that span into this month)
  const currentMonthEvents = events.filter(event => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)
    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthEnd = new Date(currentYear, currentMonth + 1, 0)

    // Event overlaps with current month if:
    // - Event starts before month ends AND event ends after month starts
    return eventStart <= monthEnd && eventEnd >= monthStart
  })

  // Generate calendar days
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const getEventsForDay = (day: number) => {
    return currentMonthEvents.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      const currentDay = new Date(currentYear, currentMonth, day)

      // Check if the current day falls within the event's date range
      return currentDay >= eventStart && currentDay <= eventEnd
    })
  }

  // Generate year options (current year ± 5 years)
  const yearOptions = []
  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
    yearOptions.push(year)
  }

  // Get today's date for highlighting
  const today = new Date()
  const isToday = (day: number) => {
    return today.getDate() === day &&
           today.getMonth() === currentMonth &&
           today.getFullYear() === currentYear
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentMonth(now.getMonth())
    setCurrentYear(now.getFullYear())
  }

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-t-lg border-b">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>

        <div className="flex items-center space-x-2">
          <Select value={currentMonth.toString()} onValueChange={(value) => setCurrentMonth(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(parseInt(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="ml-2"
          >
            Today
          </Button>
        </div>

        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-b-lg border border-t-0">
        {/* Day Names */}
        <div className="grid grid-cols-7 border-b">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = day ? getEventsForDay(day) : []
            const isTodayDay = day ? isToday(day) : false
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b last:border-r-0 hover:bg-gray-50 ${
                  isTodayDay ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isTodayDay
                        ? 'text-blue-600 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                        : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        const eventStart = new Date(event.startDate)
                        const eventEnd = new Date(event.endDate)
                        const currentDay = new Date(currentYear, currentMonth, day)
                        const isMultiDay = eventStart.toDateString() !== eventEnd.toDateString()
                        const isFirstDay = currentDay.toDateString() === eventStart.toDateString()
                        const isLastDay = currentDay.toDateString() === eventEnd.toDateString()

                        return (
                          <div
                            key={event._id}
                            onClick={() => setSelectedEvent(event)}
                            className="text-xs p-1 rounded cursor-pointer hover:opacity-80 text-white relative"
                            style={{ backgroundColor: eventTypeColors[event.eventType] || '#6b7280' }}
                            title={`${event.title} ${isMultiDay ? `(${format(eventStart, 'MMM dd')} - ${format(eventEnd, 'MMM dd')})` : ''}`}
                          >
                            <div className="truncate">
                              {isMultiDay && !isFirstDay && !isLastDay ? '↔' : ''}
                              {isMultiDay && isFirstDay ? '→' : ''}
                              {isMultiDay && isLastDay ? '←' : ''}
                              {isMultiDay ? ' ' : ''}{event.title}
                            </div>
                          </div>
                        )
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedEvent?.title}</span>
              {isAdminMode && selectedEvent && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(`/admin/events/edit/${selectedEvent._id}`, '_blank')
                      setSelectedEvent(null)
                    }}
                    title="Edit Details"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onEditEvent?.(selectedEvent._id as Id<"events">)
                      setSelectedEvent(null)
                    }}
                    title="Quick Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onDeleteEvent?.(selectedEvent._id as Id<"events">)
                      setSelectedEvent(null)
                    }}
                    title="Delete Event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </DialogTitle>
            <DialogDescription>
              <Badge className={`bg-${eventTypeColors[selectedEvent?.eventType || 'other'].replace('#', '')}`}>
                {eventTypeLabels[selectedEvent?.eventType || 'other']}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <p className="text-gray-700">{selectedEvent.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{format(new Date(selectedEvent.startDate), "PPP")} - {format(new Date(selectedEvent.endDate), "PPP")}</span>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{selectedEvent.currentAttendees}{selectedEvent.maxAttendees ? ` / ${selectedEvent.maxAttendees}` : ""} attendees</span>
                  </div>

                  {selectedEvent.price && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${selectedEvent.price}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedEvent.contactEmail && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${selectedEvent.contactEmail}`} className="text-blue-600 hover:underline">
                        {selectedEvent.contactEmail}
                      </a>
                    </div>
                  )}

                  {selectedEvent.contactPhone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${selectedEvent.contactPhone}`} className="text-blue-600 hover:underline">
                        {selectedEvent.contactPhone}
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Registration:</span>
                      <Badge variant={selectedEvent.requiresRegistration ? "default" : "secondary"}>
                        {selectedEvent.requiresRegistration ? "Required" : "Not Required"}
                      </Badge>
                    </div>

                    {isAdminMode && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Visibility:</span>
                        <Badge variant={selectedEvent.isPublic ? "default" : "secondary"}>
                          {selectedEvent.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvent.requiresRegistration && selectedEvent.contactEmail && (
                <div className="pt-4 border-t">
                  <Button asChild className="w-full">
                    <a href={`mailto:${selectedEvent.contactEmail}?subject=Registration for ${selectedEvent.title}`}>
                      Register for Event
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventCalendar
