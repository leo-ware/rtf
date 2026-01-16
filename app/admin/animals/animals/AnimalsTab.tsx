"use client"

import { useState } from "react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Calendar,
    FileText,
    Filter,
    Grid3X3,
    Heart,
    List,
    Search,
    Edit,
} from "lucide-react"
import Link from "next/link"
import ConvexImage from "@/components/images/ConvexImage"
import AnimalCreateDialog from "./AnimalCreateDialog"
import AnimalDeleteDialog from "./AnimalDeleteDialog"

const AnimalsTab = () => {
    const [filterType, setFilterType] = useState<"all" | "horse" | "burro">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("list")

    const { results: animals } = usePaginatedQuery(
        api.animals.listAnimals,
        { ...(filterType !== "all" && { type: filterType as "horse" | "burro" }) },
        { initialNumItems: 100 }
    )

    const { results: herds } = usePaginatedQuery(api.herds.listHerds, {}, { initialNumItems: 100 })

    const filteredAnimals = animals?.filter((animal) => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            animal.name.toLowerCase().includes(searchLower) ||
            animal.herd?.name?.toLowerCase().includes(searchLower)
        )
    }) || []

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (animals === undefined || herds === undefined) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search animals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                    />
                </div>

                <Select value={filterType} onValueChange={(value: "all" | "horse" | "burro") => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="horse">Horses</SelectItem>
                        <SelectItem value="burro">Burros</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2 ml-auto">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <AnimalCreateDialog
                        herds={herds.map((herd) => ({ _id: herd._id, name: herd.name }))}
                    />
                </div>
            </div>

            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAnimals.map((animal) => (
                        <Card key={animal._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative bg-gray-100">
                                {animal.image?.url ? (
                                    <ConvexImage
                                        src={animal.image.url}
                                        alt={animal.name}
                                        width={animal.image.width || 400}
                                        height={animal.image.height || 300}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <FileText className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-1">{animal.name}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Badge variant={animal.type === "horse" ? "default" : "secondary"}>
                                                {animal.type}
                                            </Badge>
                                            {animal.herd && (
                                                <>
                                                    <span>•</span>
                                                    <span>{animal.herd.name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Link href={`/admin/animals/edit/${animal._id}`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <AnimalDeleteDialog animalId={animal._id} />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {animal.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {animal.inMemoriam && (
                                        <Badge variant="outline" className="text-red-600">
                                            <Heart className="h-3 w-3 mr-1" />
                                            In Memoriam
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(animal._creationTime)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Animal</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Herd</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAnimals.map((animal) => (
                                    <tr key={animal._id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {animal.image?.url ? (
                                                        <ConvexImage
                                                            src={animal.image.url}
                                                            alt={animal.name}
                                                            width={48}
                                                            height={48}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-gray-900 truncate">
                                                        {animal.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge variant={animal.type === "horse" ? "default" : "secondary"}>
                                                {animal.type}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            {animal.herd && (
                                                <span className="text-gray-900">
                                                    {animal.herd.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {animal.inMemoriam && (
                                                    <Badge variant="outline" className="text-red-600">
                                                        <Heart className="h-3 w-3 mr-1" />
                                                        In Memoriam
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(animal._creationTime)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/admin/animals/edit/${animal._id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AnimalDeleteDialog animalId={animal._id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredAnimals.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No animals found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No animals match "${searchTerm}"`
                            : "Get started by creating your first animal."
                        }
                    </p>
                </div>
            )}
        </>
    )
}

export default AnimalsTab


