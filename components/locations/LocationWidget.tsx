"use client"

import { MapPin, ExternalLink } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type LocationWidgetProps = {
    locationId: Id<"locations">
    className?: string
}

const LocationWidget = ({ locationId, className = "" }: LocationWidgetProps) => {
    const location = useQuery(api.locations.getLocation, { id: locationId })

    if (!location) {
        return (
            <div className={`inline-flex items-center gap-1 text-gray-400 text-sm ${className}`}>
                <MapPin className="h-4 w-4" />
                <span>Loading...</span>
            </div>
        )
    }

    const hasDetails = location.address || location.mapsUrl

    if (!hasDetails) {
        return (
            <div className={`inline-flex items-center gap-1 text-gray-600 text-sm ${className}`}>
                <MapPin className="h-4 w-4" />
                <span>{location.name}</span>
            </div>
        )
    }

    return (
        <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
                <div className={`inline-flex items-center gap-1 text-gray-600 text-sm cursor-pointer hover:text-gray-900 transition-colors ${className}`}>
                    <MapPin className="h-4 w-4" />
                    <span>{location.name}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs p-2 bg-white border border-gray-300 rounded-md">
                <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                        {location.name}
                    </div>
                    {location.address && (
                        <div className="text-sm text-gray-500">{location.address}</div>
                    )}
                    {location.mapsUrl && (
                        <a
                            href={location.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-3 w-3" />
                            View on Maps
                        </a>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    )
}

export default LocationWidget

