"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Plus,
    Edit,
    Trash2,
    User,
    Shield,
    Crown,
    Mail,
    Calendar,
    AlertCircle,
    CheckCircle,
    Users
} from "lucide-react"
import Link from "next/link"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { handleConvexError, handlePermissionError } from "@/lib/errorHandler"

const AdminUsersPage = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<Id<"users"> | null>(null)
    const [deletingUser, setDeletingUser] = useState<Id<"users"> | null>(null)
    const [actionStatus, setActionStatus] = useState<"idle" | "success" | "error">("idle")
    const [actionMessage, setActionMessage] = useState("")

    // Data queries
    const currentUser = useQuery(api.users.getCurrentUser)
    const users = useQuery(api.users.listUsers, { limit: 200 })

    const hasAdminAccess = currentUser?.atLeastAdmin
    const currentUserRole = currentUser?.role

    // Mutations
    const createUser = useMutation(api.approvedUserEmails.createApprovedUserEmail)
    const updateUserRole = useMutation(api.users.updateUserRole)
    const deleteUser = useMutation(api.users.deleteUser)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "authorized" as "authorized" | "admin" | "dev",
    })

    const [editFormData, setEditFormData] = useState({
        role: "authorized" as "authorized" | "admin" | "dev",
    })

    const canEditRole = (userRole: string) => {
        if (currentUserRole === "dev") return true
        if (currentUserRole === "admin" && userRole !== "dev") return true
        return false
    }

    const canDeleteUser = () => {
        return currentUserRole === "dev"
    }

    const handleCreateUser = async () => {
        try {
            await createUser({
                name: formData.name,
                email: formData.email,
                role: formData.role,
            })

            setIsCreateDialogOpen(false)
            resetForm()
            setActionStatus("success")
            setActionMessage("User created successfully!")
            setTimeout(() => setActionStatus("idle"), 3000)
        } catch (error: any) {
            console.error("Error creating user:", error)

            // Check if it's a permission error and redirect to error page
            if (error?.message?.includes('Insufficient permissions') ||
                error?.message?.includes('cannot create')) {
                handlePermissionError(
                    "create users",
                    "user management",
                    currentUserRole || "unknown",
                    "admin"
                )
                return
            }

            // For other errors, use Convex error handler
            if (error?.message?.includes('already exists') ||
                error?.message?.includes('validation')) {
                setActionStatus("error")
                setActionMessage(error.message || "Failed to create user")
                setTimeout(() => setActionStatus("idle"), 5000)
            } else {
                handleConvexError(error, "create user")
            }
        }
    }

    const handleUpdateUserRole = async (userId: Id<"users">) => {
        try {
            await updateUserRole({
                targetUserId: userId,
                newRole: editFormData.role,
            })

            setEditingUser(null)
            setActionStatus("success")
            setActionMessage("User role updated successfully!")
            setTimeout(() => setActionStatus("idle"), 3000)
        } catch (error: any) {
            console.error("Error updating user role:", error)

            // Check for permission errors
            if (error?.message?.includes('Insufficient permissions') ||
                error?.message?.includes('cannot modify')) {
                handlePermissionError(
                    "update user roles",
                    "user management",
                    currentUserRole || "unknown",
                    "admin"
                )
                return
            }

            // For validation errors, show inline message
            if (error?.message?.includes('Cannot modify') ||
                error?.message?.includes('validation')) {
                setActionStatus("error")
                setActionMessage(error.message || "Failed to update user role")
                setTimeout(() => setActionStatus("idle"), 5000)
            } else {
                handleConvexError(error, "update user role")
            }
        }
    }

    const handleDeleteUser = async (userId: Id<"users">) => {
        try {
            setDeletingUser(userId)
            await deleteUser({ targetUserId: userId })

            setActionStatus("success")
            setActionMessage("User deleted successfully!")
            setTimeout(() => setActionStatus("idle"), 3000)
        } catch (error: any) {
            console.error("Error deleting user:", error)

            // Check for permission errors
            if (error?.message?.includes('Only dev users can delete') ||
                error?.message?.includes('Insufficient permissions')) {
                handlePermissionError(
                    "delete users",
                    "user management",
                    currentUserRole || "unknown",
                    "dev"
                )
                return
            }

            // For validation errors, show inline message
            if (error?.message?.includes('Cannot delete') ||
                error?.message?.includes('validation')) {
                setActionStatus("error")
                setActionMessage(error.message || "Failed to delete user")
                setTimeout(() => setActionStatus("idle"), 5000)
            } else {
                handleConvexError(error, "delete user")
            }
        } finally {
            setDeletingUser(null)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            role: "authorized",
        })
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "dev":
                return <Crown className="h-4 w-4" />
            case "admin":
                return <Shield className="h-4 w-4" />
            default:
                return <User className="h-4 w-4" />
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "dev":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "admin":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Check if user has permission to access this page
    if (hasAdminAccess === false) {
        // Redirect to 403 error page with proper context
        handlePermissionError(
            "access user management",
            "user management page",
            currentUserRole || "authorized",
            "admin"
        )

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        )
    }

    if (hasAdminAccess === undefined || users === undefined || currentUserRole === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Action Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    {actionStatus !== "idle" && (
                        <div className={`p-3 rounded-md flex items-center ${actionStatus === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                            }`}>
                            {actionStatus === "success" ? (
                                <CheckCircle className="h-5 w-5 mr-2" />
                            ) : (
                                <AlertCircle className="h-5 w-5 mr-2" />
                            )}
                            {actionMessage}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>
                                    Add a new user to the system with the specified role and permissions.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="authorized">Authorized User</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            {currentUserRole === "dev" && (
                                                <SelectItem value="dev">Developer</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateUser}
                                        disabled={!formData.name || !formData.email}
                                    >
                                        Create User
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        Manage user accounts and their permission levels
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        {user.type === "user" && user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name || user.email || "User"}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-5 w-5 text-gray-500" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-medium text-gray-900">
                                                {user.name || "Unnamed User"}
                                            </h3>
                                            {user._id === currentUser?._id && (
                                                <Badge variant="outline" className="text-xs">
                                                    You
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Mail className="h-3 w-3" />
                                            <span>{user.email || "No email"}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                                            <Calendar className="h-3 w-3" />
                                            <span>Joined {formatDate(user._creationTime)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Badge className={`${getRoleBadgeColor(user.role || 'authorized')} border`}>
                                        <span className="flex items-center space-x-1">
                                            {getRoleIcon(user.role || 'authorized')}
                                            <span className="capitalize">{user.role || 'authorized'}</span>
                                        </span>
                                    </Badge>

                                    {user.type === "user" && user._id !== currentUser?._id && (
                                        <div className="flex space-x-2">
                                            {canEditRole(user.role || 'authorized') && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingUser(user._id)
                                                                setEditFormData({ role: user.role || 'authorized' })
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Update User Role</DialogTitle>
                                                            <DialogDescription>
                                                                Change the role and permissions for {user.name || user.email}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <Label htmlFor="edit-role">Role</Label>
                                                                <Select
                                                                    value={editFormData.role}
                                                                    onValueChange={(value: any) => setEditFormData({ role: value })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select role" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="authorized">Authorized User</SelectItem>
                                                                        <SelectItem value="admin">Administrator</SelectItem>
                                                                        {currentUserRole === "dev" && (
                                                                            <SelectItem value="dev">Developer</SelectItem>
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex justify-end space-x-2 pt-4">
                                                                <Button variant="outline" onClick={() => setEditingUser(null)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={() => handleUpdateUserRole(user._id)}>
                                                                    Update Role
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}

                                            {user.type === "user" && canDeleteUser() && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Trash2 className="h-4 w-4 text-black" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete User</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete this user? This action cannot be undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose onClick={() => setDeletingUser(null)}>
                                                                Cancel
                                                            </DialogClose>
                                                            <Button onClick={() => handleDeleteUser(user._id)} type="submit">
                                                                Delete User
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

export default AdminUsersPage