"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Users, User, Star, Heart } from "lucide-react"
import ReorderableList from "@/components/ReorderableList"
import { Id } from "@/convex/_generated/dataModel"
import { RoleType } from "./types"
import PeopleAddRoleDialog from "./PeopleAddRoleDialog"

type PersonListWidgetProps = {
    personType: RoleType
}

const PersonListWidget = ({ personType }: PersonListWidgetProps) => {
    const people = useQuery(api.people.listPeople, { personType, limit: 500 })
    const updatePersonOrder = useMutation(api.people.updatePersonOrder)

    const [localPeople, setLocalPeople] = useState<typeof people>([])

    useEffect(() => {
        if (people) {
            setLocalPeople(people)
        }
    }, [people])

    const handleReorder = async (newOrder: string[]) => {
        const reorderedPeople = newOrder.map((id, index) => {
            const person = localPeople?.find(p => p._id === id)
            return { ...person!, newOrder: index }
        })

        setLocalPeople(reorderedPeople as any)

        try {
            await Promise.all(
                reorderedPeople.map((person) =>
                    updatePersonOrder({
                        id: person._id as Id<"people">,
                        personType: personType,
                        order: person.newOrder,
                    })
                )
            )
        } catch (error) {
            console.error("Error updating order:", error)
            if (people) {
                setLocalPeople(people)
            }
        }
    }

    if (people === undefined) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
            </div>
        )
    }

    if (!localPeople || localPeople.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No people in this category</h3>
                <PeopleAddRoleDialog roleType={personType} />
            </div>
        )
    }

    return (
        <div className="min-h-[400px]">
            <div className="mb-4">
                <PeopleAddRoleDialog roleType={personType} />
            </div>
            
            <ReorderableList
                onReorder={handleReorder}
                items={localPeople.map((person) => ({
                    id: person._id,
                    widget: (
                        <div className="flex items-center gap-3">
                            {person.image?.imageUrl ? (
                                <img
                                    src={person.image.imageUrl}
                                    alt={person.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <User className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate">{person.name}</h3>
                                <p className="text-sm text-gray-600 truncate">{person.title}</p>
                                <div className="flex gap-1 mt-2 flex-wrap">
                                    {person.isDirector && (
                                        <Badge variant="secondary" className="text-xs">
                                            <Star className="h-3 w-3 mr-1" />
                                            Director
                                        </Badge>
                                    )}
                                    {person.isStaff && (
                                        <Badge variant="secondary" className="text-xs">
                                            <Users className="h-3 w-3 mr-1" />
                                            Staff
                                        </Badge>
                                    )}
                                    {person.isEquine && (
                                        <Badge variant="secondary" className="text-xs">
                                            <Heart className="h-3 w-3 mr-1" />
                                            Equine
                                        </Badge>
                                    )}
                                    {person.inMemoriam && (
                                        <Badge variant="secondary" className="text-xs">
                                            <Heart className="h-3 w-3 mr-1" />
                                            In Memoriam
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }))}
            />
        </div>
    )
}

export default PersonListWidget
