"use client"

// Deprecated: discount-code based ticketing is no longer used (kept temporarily for reference)

import { useState } from "react"
import { useQuery, useMutation, usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Ticket,
    Copy,
    Check,
    Ban,
    RotateCcw,
    Edit,
    Search,
    Percent,
    DollarSign,
    Gift,
    Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Id, Doc } from "@/convex/_generated/dataModel"
import DiscountCodeEditorDialog from "./DiscountCodeEditorDialog"

const DiscountCodesTab = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
    const [selectedCode, setSelectedCode] = useState<Doc<"discountCodes"> | null>(null)
    const [isRevoking, setIsRevoking] = useState(false)

    const discountCodes = useQuery(api.discountCodes.listDiscountCodes)
    const revokeCode = useMutation(api.discountCodes.revokeDiscountCode)
    const unrevokeCode = useMutation(api.discountCodes.unrevokeDiscountCode)
    const programs = useQuery(api.programs.getAllPrograms)
    const { results: events } = usePaginatedQuery(
        api.events.getPaginatedEvents,
        {},
        { initialNumItems: 100 }
    )

    const filteredCodes = discountCodes?.filter(code => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            code.code.toLowerCase().includes(searchLower) ||
            code.discountType.toLowerCase().includes(searchLower) ||
            code.description?.toLowerCase().includes(searchLower)
        )
    }) || []

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const handleRevokeClick = (code: Doc<"discountCodes">) => {
        setSelectedCode(code)
        setRevokeDialogOpen(true)
    }

    const handleConfirmRevoke = async () => {
        if (!selectedCode) return
        
        setIsRevoking(true)
        try {
            if (selectedCode.revoked) {
                await unrevokeCode({ id: selectedCode._id })
            } else {
                await revokeCode({ id: selectedCode._id })
            }
            setRevokeDialogOpen(false)
            setSelectedCode(null)
        } catch (err) {
            console.error("Error toggling revoke status:", err)
        } finally {
            setIsRevoking(false)
        }
    }

    const getDiscountTypeIcon = (type: string) => {
        switch (type) {
            case "percentage":
                return <Percent className="h-4 w-4" />
            case "fixed":
                return <DollarSign className="h-4 w-4" />
            case "free":
                return <Gift className="h-4 w-4" />
            case "tickets":
                return <Ticket className="h-4 w-4" />
            default:
                return <Ticket className="h-4 w-4" />
        }
    }

    const getDiscountDescription = (code: Doc<"discountCodes">) => {
        switch (code.discountType) {
            case "percentage":
                return `${code.discountQuantity}% off`
            case "fixed":
                return `$${code.discountQuantity} off`
            case "free":
                return "100% free"
            case "tickets":
                return `${code.discountQuantity} free ticket${code.discountQuantity !== 1 ? "s" : ""}`
            default:
                return code.discountType
        }
    }

    const getProgramName = (programId: Id<"programs">) => {
        const program = programs?.find(p => p._id === programId)
        return program?.name || "Unknown Program"
    }

    const getEventName = (eventId: Id<"events">) => {
        const event = events?.find(e => e._id === eventId)
        return event?.title || "Unknown Event"
    }

    if (discountCodes === undefined) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[200px]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
                    <span className="text-gray-500 text-sm mt-1">Loading discount codes...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between gap-8">
                <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search codes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <DiscountCodeEditorDialog />
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Discount Codes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-[400px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Discount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Restrictions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCodes.map((code) => (
                                    <tr key={code._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                                        {code.code}
                                                    </code>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => handleCopyCode(code.code)}
                                                    >
                                                        {copiedCode === code.code ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {code.description && (
                                                    <span className="text-sm text-gray-500">{code.description}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getDiscountTypeIcon(code.discountType)}
                                                <span>{getDiscountDescription(code)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex flex-col gap-1">
                                                {code.programLock && (
                                                    <Badge variant="outline" className="text-xs w-fit">
                                                        Program: {getProgramName(code.programLock)}
                                                    </Badge>
                                                )}
                                                {code.eventLock && (
                                                    <Badge variant="outline" className="text-xs w-fit">
                                                        Event: {getEventName(code.eventLock)}
                                                    </Badge>
                                                )}
                                                {!code.programLock && !code.eventLock && (
                                                    <span className="text-gray-400">No restrictions</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={code.revoked ? "destructive" : "default"}>
                                                {code.revoked ? "Revoked" : "Active"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <DiscountCodeEditorDialog discountCode={code}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DiscountCodeEditorDialog>
                                                <Button
                                                    size="sm"
                                                    variant={code.revoked ? "outline" : "destructive"}
                                                    title={code.revoked ? "Restore" : "Revoke"}
                                                    onClick={() => handleRevokeClick(code)}
                                                >
                                                    {code.revoked ? (
                                                        <RotateCcw className="h-4 w-4" />
                                                    ) : (
                                                        <Ban className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCodes.length === 0 && (
                            <div className="text-center py-12 w-full">
                                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No discount codes found</h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? `No codes match "${searchTerm}"`
                                        : "Get started by creating your first discount code."
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Revoke/Restore Confirmation Dialog */}
            <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCode?.revoked ? "Restore Discount Code" : "Revoke Discount Code"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCode?.revoked
                                ? `Are you sure you want to restore the code "${selectedCode.code}"? This will make the code active again.`
                                : `Are you sure you want to revoke the code "${selectedCode?.code}"? Users will no longer be able to use this code.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRevokeDialogOpen(false)}
                            disabled={isRevoking}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={selectedCode?.revoked ? "default" : "destructive"}
                            onClick={handleConfirmRevoke}
                            disabled={isRevoking}
                        >
                            {isRevoking ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {selectedCode?.revoked ? "Restoring..." : "Revoking..."}
                                </>
                            ) : (
                                selectedCode?.revoked ? "Restore Code" : "Revoke Code"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DiscountCodesTab

