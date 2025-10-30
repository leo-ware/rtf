"use client"

import React, { useState } from "react"
import { useQuery, useAction, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
    DialogClose,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Edit, Trash2 } from "lucide-react"
import { ImSpinner8 } from "react-icons/im"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const roleToOrder = {
    admin: 0,
    authorized: 1,
    guest: 2,
    dev: 3,
} as const

const AdminUsersPage = () => {
    const usersRaw = useQuery(api.users.listUsers, { limit: 100 })
    const users = (usersRaw || []).sort((a, b) => roleToOrder[a.role] - roleToOrder[b.role])
    const invitedUsers = useQuery(api.userInvites.listInvitedUsers)

    const [deletedUsers, setDeletedUsers] = useState<string[]>([])
    const deleteUser = useAction(api.users.deleteUserInClerk)

    const handleDeleteUser = async (userId: string) => {
        setDeletedUsers(prev => [...prev, userId])
        try {
            await deleteUser({ userId } as any)
        } catch (error: any) {
            console.error("Error deleting user:", error)
            setDeletedUsers(prev => prev.filter(id => id !== userId))
        }
    }

    const [inviteEmail, setInviteEmail] = useState<string>("")
    const [inviteRole, setInviteRole] = useState<"admin" | "authorized" | "guest" | "dev">("authorized")
    const [inviteLoading, setInviteLoading] = useState<boolean>(false)
    const [inviteError, setInviteError] = useState<string | null>(null)
    const [inviteSuccess, setInviteSuccess] = useState<boolean>(false)
    const inviteUser = useAction(api.userInvites.inviteUser)

    const handleInviteUser = async () => {
        setInviteLoading(true)
        try {
            await inviteUser({ email: inviteEmail, role: inviteRole })
            setInviteError(null)
            setInviteEmail("")
            setInviteRole("authorized")
            setInviteSuccess(true)
            setTimeout(() => {
                setInviteSuccess(false)
            }, 3000)
        } catch (error: any) {
            console.error(error)
            setInviteError(error?.message || "Failed to invite user")
        } finally {
            setInviteLoading(false)
        }
    }

    const [rescindingInvitations, setRescindingInvitation] = useState<string[]>([])
    const [rescindInvitationError, setRescindingInvitationError] = useState<string[]>([])
    const rescindInvitation = useAction(api.userInvites.rescindInvitation)

    const handleRescindInvitation = async (inviteId: string) => {
        setRescindingInvitation(prev => [...prev, inviteId])
        setRescindingInvitationError(prev => prev.filter(id => id !== inviteId))
        try {
            await rescindInvitation({ inviteId: (inviteId as any) })
        } catch (error: any) {
            console.error(error)
            setRescindingInvitationError(prev => [...prev, inviteId])
        } finally {
            setRescindingInvitation(prev => prev.filter(id => id !== inviteId))
        }
    }

    const [prospectiveUserRole, setProspectiveUserRole] = useState<"admin" | "authorized" | "guest">("authorized")
    const [modifyingUserRole, setModifyingUserRole] = useState<string[]>([])
    const [modifyingUserRoleError, setModifyingUserRoleError] = useState<string[]>([])
    const modifyUserRole = useMutation(api.users.modifyUserRole)

    const handleModifyUserRole = async (userId: string, newRole: "admin" | "authorized" | "guest") => {
        setModifyingUserRole(prev => [...prev, userId])
        setModifyingUserRoleError(prev => prev.filter(id => id !== userId))
        try {
            await modifyUserRole({ userId: (userId as any), newRole })
        } catch (error: any) {
            console.error(error)
            setModifyingUserRoleError(prev => [...prev, userId])
        } finally {
            setModifyingUserRole(prev => prev.filter(id => id !== userId))
        }
    }

    return (
        <div className="flex flex-col items-start justify-start gap-8 w-full mx-auto lg:w-2/3 py-12 px-8 lg:px-2">
            <div className="w-full flex flex-row items-center justify-end">
                <Dialog>
                    <DialogTrigger>
                        <Button>
                            Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite User</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Add a new admin user to the system.
                        </DialogDescription>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="mb-1">Email</Label>
                                <Input
                                    id="email"
                                    value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                                    type="email"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="role" className="mb-1">Role</Label>
                                <Select
                                    value={inviteRole}
                                    onValueChange={r => setInviteRole(r as any)}
                                    required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="authorized">Authorized</SelectItem>
                                        <SelectItem value="guest">Guest</SelectItem>
                                        <SelectItem value="dev">Dev</SelectItem>
                                    </SelectContent>
                                </Select>
                                {inviteError && <p className="text-red-500">{inviteError}</p>}
                                {inviteSuccess && <p className="text-green-500">success</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            {inviteLoading ? (
                                <ImSpinner8 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <DialogClose>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleInviteUser}>Invite</Button>
                                </>
                            )}

                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <h1 className="text-2xl font-bold">Current Users</h1>

            <div className="w-full flex flex-col items-start justify-start gap-4">
                {users?.map((user) => (
                    <Card key={user._id} className="w-full h-fit px-8 py-4 flex flex-row justify-between items-start">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <div className="text-lg font-semibold">{user.name}</div>
                            {user.email.map(email => (
                                <div className="text-sm text-gray-500">{email}</div>
                            ))}
                            <div className="border-1 border-gray-300 rounded-full px-2 py-1 text-sm text-gray-500">
                                {user.role}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            {user.role !== "dev" && (
                                <>
                                    {modifyingUserRole.includes(user._id) ? (
                                        <ImSpinner8 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setProspectiveUserRole(user.role as any)}
                                                    >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Modify User Role</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    Modify the role of {user.name}.
                                                </DialogDescription>
                                                <div className="space-y-4">
                                                    <Label htmlFor="role" className="mb-1">Role</Label>
                                                    <Select
                                                        value={prospectiveUserRole}
                                                        onValueChange={r => setProspectiveUserRole(r as any)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="authorized">Authorized</SelectItem>
                                                            <SelectItem value="guest">Guest</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={() => handleModifyUserRole(user._id, prospectiveUserRole)}>Modify</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                    {deletedUsers.includes(user._id) ? (
                                        <Button variant="outline" size="icon">
                                            <ImSpinner8 className="h-4 w-4 animate-spin" />
                                        </Button>
                                    ) : (
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button variant="outline" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Delete User?</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    You are about to delete {user.name}.
                                                    This action cannot be undone.
                                                </DialogDescription>
                                                <DialogFooter className="flex flex-row items-center justify-end gap-2">
                                                    <DialogClose>
                                                        <Button variant="outline">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button onClick={() => handleDeleteUser(user._id)}>
                                                        Delete
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                </>
                            )}
                            {modifyingUserRoleError.includes(user._id) ? (
                                <p className="text-red-500">Error modifying user role</p>
                            ) : null}
                        </div>
                    </Card>
                ))}
            </div>

            {invitedUsers && invitedUsers.length > 0 && (
                <>
                    <h1 className="text-2xl font-bold">Invited Users</h1>
                    <div className="w-full flex flex-col items-start justify-start gap-4">
                        {invitedUsers.map((invitedUser) => (
                            <Card key={invitedUser._id} className="w-full h-fit px-8 py-4 flex flex-row justify-between items-start">
                                <div className="flex items-center justify-start gap-4">
                                    <div className="text-sm">
                                        {invitedUser.email}
                                    </div>
                                    <div className="border-1 border-gray-300 rounded-full px-2 py-1 text-sm text-gray-500">
                                        {invitedUser.role}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-start gap-2">
                                    {rescindingInvitations.includes(invitedUser.email) ? (
                                        <ImSpinner8 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button variant="outline" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Rescind Invitation?</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    The invitation to {invitedUser.email} will be rescinded.
                                                </DialogDescription>
                                                <DialogFooter className="flex flex-row items-center justify-end gap-2">
                                                    <DialogClose>
                                                        <Button variant="outline">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button onClick={() => handleRescindInvitation(invitedUser._id)}>
                                                        Rescind
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                    {rescindInvitationError.includes(invitedUser.email) ? (
                                        <p className="text-red-500">Error rescinding invitation</p>
                                    ) : null}
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminUsersPage