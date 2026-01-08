"use client"

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogTrigger,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { RoleType, roleTypeToLabel, roleTypeToMembershipField } from "./types"
import { Plus } from "lucide-react"
import PeopleSearchAndSelect from "@/components/PeopleSearchAndSelect"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

const PeopleAddRoleDialog = ({ roleType }: { roleType: RoleType }) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectedPeople = useQuery(api.people.listPeople, { personType: roleType })
    const updatePerson = useMutation(api.people.updatePerson)

    const handleSelect = async (personId: Id<"people">) => {
        await updatePerson({
            id: personId,
            [roleTypeToMembershipField(roleType)]: true,
            [`${roleType}Order` as const]: 1000 + Math.floor(Math.random() * 1000),
        })
    }

    const handleRemove = async (personId: Id<"people">) => {
        await updatePerson({
            id: personId,
            [roleTypeToMembershipField(roleType)]: false,
            [`${roleType}Order` as const]: undefined,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add {roleTypeToLabel(roleType)}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add {roleTypeToLabel(roleType)}</DialogTitle>
                    <DialogDescription>
                        Add a new person to the {roleTypeToLabel(roleType)} role.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <PeopleSearchAndSelect
                        selectedPeople={selectedPeople || []}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        disabled={false} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PeopleAddRoleDialog