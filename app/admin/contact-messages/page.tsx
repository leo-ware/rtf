"use client"

import { useState } from "react"
import { useMutation, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Search,
    Eye,
    Archive,
    Trash2,
    Loader2,
    MessageSquare,
} from "lucide-react"
import ContactMessageViewDialog from "./ContactMessageViewDialog"
import ContactMessageDeleteDialog from "./ContactMessageDeleteDialog"

type MessageStatus = "new" | "read" | "replied" | "archived"

const statusBadgeVariants = {
    new: "default",
    read: "secondary",
    replied: "outline",
    archived: "secondary",
} as const

const statusBadgeClasses = {
    new: "bg-blue-500 hover:bg-blue-500",
    read: "",
    replied: "text-green-600 border-green-600",
    archived: "opacity-60",
}

const statusLabels: Record<MessageStatus, string> = {
    new: "New",
    read: "Read",
    replied: "Replied",
    archived: "Archived",
}

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    } else if (diffDays === 1) {
        return "Yesterday"
    } else if (diffDays < 7) {
        return date.toLocaleDateString(undefined, { weekday: "short" })
    } else {
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    }
}

const AdminContactMessagesPage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<MessageStatus | "all">("all")
    const [archivingId, setArchivingId] = useState<Id<"contactMessages"> | null>(null)

    const { results: messages, loadMore, status: queryStatus } = usePaginatedQuery(
        api.contactMessages.searchContactMessages,
        {
            query: searchTerm || undefined,
            status: filterStatus === "all" ? undefined : filterStatus,
        },
        { initialNumItems: 50 }
    )

    const updateStatus = useMutation(api.contactMessages.updateContactMessageStatus)

    const handleArchive = async (messageId: Id<"contactMessages">) => {
        setArchivingId(messageId)
        try {
            await updateStatus({ id: messageId, status: "archived" })
        } catch (error) {
            console.error("Error archiving message:", error)
        } finally {
            setArchivingId(null)
        }
    }

    // Loading state
    if (messages === undefined) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select
                    value={filterStatus}
                    onValueChange={(value: MessageStatus | "all") => setFilterStatus(value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Messages Table */}
            {messages.length > 0 ? (
                <div className="bg-white rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr className="text-sm">
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Sender</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Subject / Topic</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Received</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {messages.map((message) => (
                                    <tr
                                        key={message._id}
                                        className={`hover:bg-gray-50 ${message.status === "new" ? "bg-blue-50/30" : ""}`}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className={`font-medium text-gray-900 ${message.status === "new" ? "font-semibold" : ""}`}>
                                                    {message.name}
                                                </span>
                                                <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                                    {message.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className={`text-gray-900 truncate max-w-[250px] ${message.status === "new" ? "font-semibold" : ""}`}>
                                                    {message.subject}
                                                </span>
                                                {message.topic && (
                                                    <span className="text-sm text-gray-500">
                                                        {message.topic}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge
                                                variant={statusBadgeVariants[message.status]}
                                                className={statusBadgeClasses[message.status]}
                                            >
                                                {statusLabels[message.status]}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-gray-600">
                                                {formatDate(message._creationTime)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <TooltipProvider>
                                                <div className="flex justify-end space-x-2">
                                                    <ContactMessageViewDialog messageId={message._id}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </ContactMessageViewDialog>
                                                    {message.status !== "archived" && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleArchive(message._id)}
                                                                    disabled={archivingId === message._id}
                                                                >
                                                                    {archivingId === message._id ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Archive className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Archive message</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span>
                                                                <ContactMessageDeleteDialog
                                                                    messageId={message._id}
                                                                    senderName={message.name}
                                                                >
                                                                    <Button variant="outline" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </ContactMessageDeleteDialog>
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete message</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TooltipProvider>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Load More */}
                    {queryStatus === "CanLoadMore" && (
                        <div className="p-4 border-t text-center">
                            <Button variant="outline" onClick={() => loadMore(50)}>
                                Load More
                            </Button>
                        </div>
                    )}
                    {queryStatus === "LoadingMore" && (
                        <div className="p-4 border-t text-center">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                        </div>
                    )}
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                    <p className="text-gray-600">
                        {searchTerm || filterStatus !== "all"
                            ? "No messages match your search criteria"
                            : "No contact messages have been submitted yet."
                        }
                    </p>
                </div>
            )}
        </div>
    )
}

export default AdminContactMessagesPage
