"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MdArrowRightAlt } from "react-icons/md";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import ScrollDiv from "./ScrollDiv";
import { ImSpinner8 } from "react-icons/im";
import Link from "next/link";

const monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const formatEventDate = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const sDay = start.getDate()
  const sMonth = monthStrings[start.getMonth()]
  const sYear = start.getFullYear()
  const eDay = end.getDate()
  const eMonth = monthStrings[end.getMonth()]
  const eYear = end.getFullYear()
  const sTime = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  const eTime = end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

  const sameDay = sDay === eDay && start.getMonth() === end.getMonth() && sYear === eYear

  if (sameDay) {
    return {
      dateLine: `${sMonth} ${sDay}`,
      timeLine: sTime !== eTime ? `${sTime} - ${eTime}` : sTime,
    }
  }

  if (sYear !== eYear) {
    return { dateLine: `${sMonth} ${sDay}, ${sYear} - ${eMonth} ${eDay}, ${eYear}`, timeLine: null }
  }
  if (start.getMonth() !== end.getMonth()) {
    return { dateLine: `${sMonth} ${sDay} - ${eMonth} ${eDay}`, timeLine: null }
  }
  return { dateLine: `${sMonth} ${sDay}-${eDay}`, timeLine: null }
}

const UpcomingEventsWidget = ({ className }: { className?: string }) => {
  const {
    results: events,
    loadMore,
    status: eventsStatus,
  } = usePaginatedQuery(
    api.events.getUpcomingPaginatedEvents,
    { paginationOpts: { numItems: 100 } },
    { initialNumItems: 100 },
  );

  const [selectedEventId, setSelectedEventId] = useState<Id<"events"> | null>(
    null,
  );


  return (
    <div
      className={cn(
        `
            w-auto h-full max-h-[400px] @container
            mx-auto px-8 py-8
            flex flex-col items-center justify-center
            bg-seashell overflow-hidden
        `,
        className,
      )}
    >
      <div
        className={`
                    relative w-full h-full min-h-0 max-w-5xl
                    grid gap-x-8
                    grid-rows-[1fr]
                    grid-cols-[1fr]
                    @xl:grid-cols-[250px_1fr]
                    @4xl:grid-cols-[250px_1fr_250px]
                `}
      >
        <ScrollDiv
          onScrollNearBottom={() => {
            if (eventsStatus === "CanLoadMore") {
              loadMore(20);
            }
          }}
          className={`
                        col-start-1 col-span-1 @xl:col-span-2 @4xl:col-span-3
                        min-h-0
                        grid grid-cols-subgrid
                        overflow-y-auto scrollbar-always
                    `}
        >
          {events?.map((event) => (
            <div
              key={event._id}
              className="col-span-full grid grid-cols-subgrid pr-2"
            >
              <div className="hidden @xl:block col-span-1 text-right pt-1">
                {(() => {
                  const { dateLine, timeLine } = formatEventDate(event.startDate, event.endDate)
                  return (
                    <div
                      className={cn(
                        "leading-tight tracking-wide transition-all duration-300 ease-in-out",
                        selectedEventId === event._id
                          ? "text-cinnamon"
                          : "text-pewter",
                      )}
                    >
                      <div className={cn(
                        "font-semibold transition-all duration-300 ease-in-out",
                        selectedEventId === event._id ? "text-[18px]" : "text-[16px]",
                      )}>
                        {dateLine}
                      </div>
                      {timeLine && (
                        <div className="text-[14px] mt-0.5">
                          {timeLine}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
              <div className="col-span-1 mb-6">
                <div
                  className={cn(
                    `cursor-pointer
                    flex items-center gap-1
                    leading-tight text-[20px] font-medium
                    transition-colors duration-150`,
                    selectedEventId === event._id
                      ? "text-cinnamon"
                      : "text-ink hover:text-cinnamon",
                  )}
                  onClick={() =>
                    setSelectedEventId((prev) => {
                      if (prev === event._id) {
                        return null;
                      }
                      return event._id;
                    })
                  }
                >
                  {event.title}
                </div>
                <div className="block @xl:hidden mt-1.5 text-pewter tracking-wide">
                  {(() => {
                    const { dateLine, timeLine } = formatEventDate(event.startDate, event.endDate)
                    return (
                      <>
                        <div className="text-[13px] leading-tight font-semibold">{dateLine}</div>
                        {timeLine && (
                          <div className="text-[12px] leading-tight mt-0.5">{timeLine}</div>
                        )}
                      </>
                    )
                  })()}
                </div>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    selectedEventId === event._id
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-3 mt-2">
                      <div className="text-[15px] text-ink/55 leading-relaxed">
                        {event.description}
                      </div>
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/visit-us/events/${event._id}`}
                        className="group inline-flex items-center gap-1 cursor-pointer"
                      >
                        <div
                          className="text-[14px] text-pewter font-semibold uppercase tracking-wide
                                     group-hover:text-cinnamon transition-colors duration-150"
                        >
                          View Event Details
                        </div>
                        <MdArrowRightAlt className="w-5 h-5 text-pewter group-hover:text-cinnamon transition-all duration-150 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {eventsStatus === "LoadingFirstPage" && (
            <div
              className={`
                            col-start-1 col-span-1 @xl:col-start-2
                            flex items-center justify-center gap-2
                            `}
            >
              <ImSpinner8 className="w-4 h-4 animate-spin text-pewter" />
              <div className="text-sm text-ink/50">Loading events...</div>
            </div>
          )}
        </ScrollDiv>
      </div>
    </div>
  );
};

export default UpcomingEventsWidget;
