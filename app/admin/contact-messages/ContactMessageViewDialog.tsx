"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Mail,
    Phone,
    Building2,
    Clock,
    Eye,
    Reply,
    Archive,
    Loader2,
} from "lucide-react"
import ContactMessageDeleteDialog from "./ContactMessageDeleteDialog"

type ContactMessageViewDialogProps = {
    messageId: Id<"contactMessages">
    children?: React.ReactNode
    onStatusChange?: () => void
}

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

const formatTimestamp = (timestamp: number | undefined) => {
    if (!timestamp) return null
    return new Date(timestamp).toLocaleString()
}

const ContactMessageViewDialog = ({ messageId, children, onStatusChange }: ContactMessageViewDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

    const message = useQuery(api.contactMessages.getContactMessage, { id: messageId })
    const updateStatus = useMutation(api.contactMessages.updateContactMessageStatus)

    // Auto-mark as read when dialog opens and message is "new"
    useEffect(() => {
        if (isOpen && message && message.status === "new") {
            updateStatus({ id: messageId, status: "read" })
                .then(() => onStatusChange?.())
                .catch((err) => console.error("Error marking message as read:", err))
        }
    }, [isOpen, message, messageId, updateStatus, onStatusChange])

    const handleStatusUpdate = async (status: "read" | "replied" | "archived") => {
        setUpdatingStatus(status)
        try {
            await updateStatus({ id: messageId, status })
            onStatusChange?.()
        } catch (err) {
            console.error("Error updating status:", err)
        } finally {
            setUpdatingStatus(null)
        }
    }

    if (!message && isOpen) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {message && (
                    <>
                        <DialogHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <DialogTitle className="text-xl mb-2">
                                        {message.subject}
                                    </DialogTitle>
                                    <Badge
                                        variant={statusBadgeVariants[message.status]}
                                        className={statusBadgeClasses[message.status]}
                                    >
                                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Sender Information */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Sender Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium text-gray-700">{message.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <a
                                            href={`mailto:${message.email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {message.email}
                                        </a>
                                    </div>
                                    {message.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <a
                                                href={`tel:${message.phone}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {message.phone}
                                            </a>
                                        </div>
                                    )}
                                    {message.organization && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Building2 className="h-4 w-4 text-gray-400" />
                                            <span>{message.organization}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Message Details */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Message
                                </h3>
                                {message.topic && (
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">Topic: </span>
                                        <span className="text-gray-700">{message.topic}</span>
                                    </div>
                                )}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {message.message}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Timestamps */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Timeline
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <span className="text-gray-500">Received: </span>
                                            <span className="text-gray-700">
                                                {formatTimestamp(message._creationTime)}
                                            </span>
                                        </div>
                                    </div>
                                    {message.readAt && (
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <span className="text-gray-500">Read: </span>
                                                <span className="text-gray-700">
                                                    {formatTimestamp(message.readAt)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {message.repliedAt && (
                                        <div className="flex items-center gap-2">
                                            <Reply className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <span className="text-gray-500">Replied: </span>
                                                <span className="text-gray-700">
                                                    {formatTimestamp(message.repliedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <div className="flex flex-wrap gap-2">
                                {message.status !== "read" && message.status !== "new" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusUpdate("read")}
                                        disabled={!!updatingStatus}
                                    >
                                        {updatingStatus === "read" ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Eye className="h-4 w-4 mr-2" />
                                        )}
                                        Mark as Read
                                    </Button>
                                )}
                                {message.status !== "replied" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusUpdate("replied")}
                                        disabled={!!updatingStatus}
                                    >
                                        {updatingStatus === "replied" ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Reply className="h-4 w-4 mr-2" />
                                        )}
                                        Mark as Replied
                                    </Button>
                                )}
                                {message.status !== "archived" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusUpdate("archived")}
                                        disabled={!!updatingStatus}
                                    >
                                        {updatingStatus === "archived" ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Archive className="h-4 w-4 mr-2" />
                                        )}
                                        Archive
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2 sm:ml-auto">
                                <ContactMessageDeleteDialog
                                    messageId={messageId}
                                    senderName={message.name}
                                    onDeleted={() => setIsOpen(false)}
                                >
                                    <Button variant="destructive" size="sm">
                                        Delete
                                    </Button>
                                </ContactMessageDeleteDialog>
                            </div>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ContactMessageViewDialog
