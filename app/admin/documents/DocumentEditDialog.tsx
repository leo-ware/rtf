"use client"

import { useState, useEffect, useRef } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Upload, FileText, Loader2, ExternalLink } from "lucide-react"
import { documentTypeLabels, DocumentType } from "@/convex/documents"

type DocumentEditDialogProps = {
    documentId: Id<"documents">
    onSuccess?: () => void
    children: React.ReactNode
}

const DocumentEditDialog = ({ documentId, onSuccess, children }: DocumentEditDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)

    const [name, setName] = useState("")
    const [type, setType] = useState<DocumentType>("annual_report")
    const [year, setYear] = useState(new Date().getFullYear())
    const [isPublic, setIsPublic] = useState(true)
    const [newFile, setNewFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const document = useQuery(api.documents.getDocument, { id: documentId })

    const generateUploadUrl = useMutation(api.documents.generateUploadUrl)
    const updateDocument = useMutation(api.documents.updateDocument)

    useEffect(() => {
        if (document) {
            setName(document.name)
            setType(document.type)
            setYear(document.year)
            setIsPublic(document.isPublic)
            setNewFile(null)
        }
    }, [document])

    const handleClose = () => {
        setNewFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        onClose()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setNewFile(selectedFile)
        }
    }

    const handleSubmit = async () => {
        if (!documentId || !name.trim()) return

        setIsSubmitting(true)
        setIsUploading(true)

        try {
            let fileId: Id<"_storage"> | undefined

            // Upload new file if selected
            if (newFile) {
                const uploadUrl = await generateUploadUrl()
                const response = await fetch(uploadUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": newFile.type,
                    },
                    body: newFile,
                })

                if (!response.ok) {
                    throw new Error("Failed to upload file")
                }

                const result = await response.json()
                fileId = result.storageId
            }

            setIsUploading(false)

            // Update document record
            await updateDocument({
                id: documentId,
                name: name.trim(),
                type,
                year,
                isPublic,
                ...(fileId && { fileId }),
            })

            onSuccess?.()
            onClose()
        } catch (error: any) {
            console.error("Error updating document:", error)
            alert(`Failed to update document: ${error?.message || "Unknown error"}`)
        } finally {
            setIsSubmitting(false)
            setIsUploading(false)
        }
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Document</DialogTitle>
                    <DialogDescription>
                        Update document information or replace the file.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Current File Info */}
                    {document?.fileUrl && (
                        <div className="space-y-2">
                            <Label>Current File</Label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                                <FileText className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-700 flex-1">
                                    {document.name}
                                </span>
                                <a
                                    href={document.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1 text-sm"
                                >
                                    View <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Replace File */}
                    <div className="space-y-2">
                        <Label>Replace File (Optional)</Label>
                        <div className="flex flex-col gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className="hidden"
                                id="document-file-edit-input"
                            />
                            <label
                                htmlFor="document-file-edit-input"
                                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                            >
                                {newFile ? (
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="font-medium">{newFile.name}</span>
                                        <span className="text-gray-500">
                                            ({(newFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Upload className="h-5 w-5" />
                                        <span className="text-sm">Click to select a new file</span>
                                    </div>
                                )}
                            </label>
                            {newFile && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setNewFile(null)
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = ""
                                        }
                                    }}
                                >
                                    Cancel Replace
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Document Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-document-name">Document Name</Label>
                        <Input
                            id="edit-document-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter document name"
                        />
                    </div>

                    {/* Document Type */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-document-type">Document Type</Label>
                        <Select value={type} onValueChange={(value: DocumentType) => setType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(documentTypeLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-document-year">Year</Label>
                        <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="edit-document-public">Public Document</Label>
                            <p className="text-sm text-gray-500">
                                Make this document visible to all visitors
                            </p>
                        </div>
                        <Switch
                            id="edit-document-public"
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {isUploading ? "Uploading..." : "Saving..."}
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DocumentEditDialog

