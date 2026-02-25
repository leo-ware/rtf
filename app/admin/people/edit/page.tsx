"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Star, User, Heart, Search } from "lucide-react"
import PersonCreateDialog from "./PersonCreateDialog"
import PersonEditDialog from "./PersonEditDialog"
import PersonDeleteDialog from "./PersonDeleteDialog"

const PeopleTab = () => {
    useEffect(() => {
        document.title = "People - RTF Admin"
    }, [])

    const [searchTerm, setSearchTerm] = useState("")

    const people = useQuery(api.people.listPeople, { limit: 100 })

    const filteredPeople = (people || []).filter(person => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            person.name.toLowerCase().includes(searchLower) ||
            (person.title ?? "").toLowerCase().includes(searchLower) ||
            (person.bio ?? "").toLowerCase().includes(searchLower)
        )
    })

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (people === undefined) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search people..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <PersonCreateDialog />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPeople.map((person) => (
                    <Card key={person._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg line-clamp-2">{person.name}</CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">{person.title ?? ""}</p>
                                    <div className="flex items-center space-x-2 mt-2 flex-wrap gap-1">
                                        {person.isDirector && (
                                            <Badge className="bg-blue-100 text-blue-800">
                                                <Star className="h-3 w-3 mr-1" />
                                                Director
                                            </Badge>
                                        )}
                                        {person.isStaff && (
                                            <Badge className="bg-green-100 text-green-800">
                                                <User className="h-3 w-3 mr-1" />
                                                Staff
                                            </Badge>
                                        )}
                                        {person.isEquine && (
                                            <Badge className="bg-orange-100 text-orange-800">
                                                <Heart className="h-3 w-3 mr-1" />
                                                Equine
                                            </Badge>
                                        )}
                                        {person.inMemoriam && (
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                                <Heart className="h-3 w-3 mr-1" />
                                                In Memoriam
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <PersonEditDialog personId={person._id} />
                                    <PersonDeleteDialog personId={person._id} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {person.image?.imageUrl && (
                                    <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                                        <img
                                            src={person.image.imageUrl}
                                            alt={person.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    </div>
                                )}

                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {person.bio}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <User className="h-3 w-3 mr-1" />
                                        {person.boards && person.boards.length > 0
                                            ? `${person.boards.length} board${person.boards.length > 1 ? 's' : ''}`
                                            : 'No boards'}
                                    </div>
                                    <div>
                                        {formatDate(person._creationTime)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPeople.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? "No people found" : "No people yet"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No people match "${searchTerm}"`
                            : "Get started by adding your first team member"}
                    </p>
                </div>
            )}
        </>
    )
}

export default PeopleTab
