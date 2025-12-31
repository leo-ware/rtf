"use client"

import { useState } from "react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, ExternalLink, Edit, Trash2 } from "lucide-react"
import { ImSpinner8 } from "react-icons/im"
import ScrollDiv from "@/components/ScrollDiv"
import LocationCreateDialog from "@/components/locations/LocationCreateDialog"
import LocationEditDialog from "@/components/locations/LocationEditDialog"
import LocationDeleteDialog from "@/components/locations/LocationDeleteDialog"

const AdminLocationsPage = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const { results: locations, loadMore, status } = usePaginatedQuery(
        api.locations.searchLocations,
        { query: searchTerm },
        { initialNumItems: 50 }
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                    <div className="relative grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <LocationCreateDialog />
                </div>

                {/* Locations List */}
                {locations === undefined ? (
                    <div className="flex items-center justify-center p-8 min-h-[200px]">
                        <div className="flex flex-col items-center gap-2">
                            <ImSpinner8 className="animate-spin h-6 w-6 text-gray-400" />
                            <span className="text-gray-500 text-sm mt-1">Loading locations...</span>
                        </div>
                    </div>
                ) : (
                    <ScrollDiv
                        className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto"
                        onScrollNearBottom={() => loadMore(50)}
                        threshold={200}
                    >
                        {locations.map((location) => (
                            <Card key={location._id} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {location.name}
                                            </h3>
                                        </div>

                                        {location.address && (
                                            <p className="text-gray-600 mb-2">
                                                {location.address}
                                            </p>
                                        )}

                                        {location.notes && (
                                            <p className="text-sm text-gray-500 mb-2">
                                                {location.notes}
                                            </p>
                                        )}

                                        {location.mapsUrl && (
                                            <a
                                                href={location.mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                View on Google Maps
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <LocationEditDialog location={location}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </LocationEditDialog>
                                        <LocationDeleteDialog
                                            locationId={location._id}
                                            locationName={location.name}
                                        >
                                            <Button variant="outline" size="icon">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </LocationDeleteDialog>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {status === "LoadingMore" && (
                            <div className="flex justify-center py-4">
                                <ImSpinner8 className="h-5 w-5 animate-spin text-gray-400" />
                            </div>
                        )}

                        {status === "Exhausted" && locations.length === 0 && (
                            <div className="text-center py-12">
                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No locations found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? `No locations match "${searchTerm}"`
                                        : "Get started by creating your first location."
                                    }
                                </p>
                            </div>
                        )}
                    </ScrollDiv>
                )}
            </div>
        </div>
    )
}

export default AdminLocationsPage

