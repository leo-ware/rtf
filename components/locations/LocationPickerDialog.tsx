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
import { Input } from "@/components/ui/input"
import { MapPin, Search, Plus, Edit, Trash2, X } from "lucide-react"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ScrollDiv from "@/components/ScrollDiv"
import { ImSpinner8 } from "react-icons/im"
import LocationCreateDialog from "./LocationCreateDialog"
import LocationEditDialog from "./LocationEditDialog"
import LocationDeleteDialog from "./LocationDeleteDialog"

type LocationPickerDialogProps = {
    locationId: Id<"locations"> | null
    onLocationSelect: (locationId: Id<"locations"> | null) => void
    disabled?: boolean
    children?: React.ReactNode
}

const LocationPickerDialog = ({
    locationId,
    onLocationSelect,
    disabled,
    children,
}: LocationPickerDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const selectedLocation = useQuery(
        api.locations.getLocation,
        locationId ? { id: locationId } : "skip"
    )

    const { results: locations, loadMore, status } = usePaginatedQuery(
        api.locations.searchLocations,
        { query: searchQuery},
        { initialNumItems: 20 }
    )

    const handleSelect = (id: Id<"locations">) => {
        onLocationSelect(id)
        setIsOpen(false)
    }

    const handleClear = () => {
        onLocationSelect(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={disabled}
                    >
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedLocation ? selectedLocation.name : "Select a location"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Location</DialogTitle>
                    <DialogDescription>
                        Search and select a location, or create a new one.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <LocationCreateDialog onCreated={(id) => handleSelect(id)}>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            New
                        </Button>
                    </LocationCreateDialog>
                </div>

                {locationId && (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900">
                                {selectedLocation?.name || "Loading..."}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <ScrollDiv
                    className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px]"
                    onScrollNearBottom={() => loadMore(20)}
                    threshold={100}
                >
                    <div className="space-y-2">
                        {locations?.map((location) => (
                            <div
                                key={location._id}
                                className={`flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer ${
                                    locationId === location._id ? "border-blue-500 bg-blue-50" : ""
                                }`}
                                onClick={() => handleSelect(location._id)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{location.name}</div>
                                    {location.address && (
                                        <div className="text-sm text-gray-500 truncate">
                                            {location.address}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                                    <LocationEditDialog location={location}>
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </LocationEditDialog>
                                    <LocationDeleteDialog
                                        locationId={location._id}
                                        locationName={location.name}
                                    >
                                        <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </LocationDeleteDialog>
                                </div>
                            </div>
                        ))}

                        {status === "LoadingMore" && (
                            <div className="flex justify-center py-4">
                                <ImSpinner8 className="h-5 w-5 animate-spin text-gray-400" />
                            </div>
                        )}

                        {status === "Exhausted" && locations?.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No locations found</p>
                                <p className="text-sm">Try a different search or create a new location</p>
                            </div>
                        )}
                    </div>
                </ScrollDiv>
            </DialogContent>
        </Dialog>
    )
}

export default LocationPickerDialog

