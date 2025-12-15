"use client"

import { useState, useRef } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
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
import { Upload, FileText, Loader2 } from "lucide-react"
import { documentTypeLabels, DocumentType } from "@/convex/documents"

type DocumentCreateDialogProps = {
    children: React.ReactNode
    onSuccess?: () => void
}

const DocumentCreateDialog = ({ children, onSuccess }: DocumentCreateDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)

    const [name, setName] = useState("")
    const [type, setType] = useState<DocumentType>("annual_report")
    const [year, setYear] = useState(new Date().getFullYear())
    const [isPublic, setIsPublic] = useState(true)
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const generateUploadUrl = useMutation(api.documents.generateUploadUrl)
    const createDocument = useMutation(api.documents.createDocument)

    const resetForm = () => {
        setName("")
        setType("annual_report")
        setYear(new Date().getFullYear())
        setIsPublic(true)
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            if (!name) {
                const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "")
                setName(fileNameWithoutExtension)
            }
        }
    }

    const handleSubmit = async () => {
        if (!name.trim() || !file) return

        setIsSubmitting(true)
        setIsUploading(true)

        try {
            // Get upload URL
            const uploadUrl = await generateUploadUrl()

            // Upload file
            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            })

            if (!response.ok) {
                throw new Error("Failed to upload file")
            }

            const { storageId } = await response.json()
            setIsUploading(false)

            // Create document record
            await createDocument({
                name: name.trim(),
                type,
                year,
                fileId: storageId,
                isPublic,
            })

            onSuccess?.()
            handleClose()
        } catch (error: any) {
            console.error("Error creating document:", error)
            alert(`Failed to create document: ${error?.message || "Unknown error"}`)
        } finally {
            setIsSubmitting(false)
            setIsUploading(false)
        }
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogTrigger onClick={() => setIsOpen(true)}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                        Add a new document to your library. Supported formats: PDF, DOC, DOCX.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label>Document File</Label>
                        <div className="flex flex-col gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className="hidden"
                                id="document-file-input"
                            />
                            <label
                                htmlFor="document-file-input"
                                className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                            >
                                {file ? (
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="font-medium">{file.name}</span>
                                        <span className="text-gray-500">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Upload className="h-8 w-8" />
                                        <span>Click to select a file</span>
                                    </div>
                                )}
                            </label>
                            {file && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setFile(null)
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = ""
                                        }
                                    }}
                                >
                                    Remove File
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Document Name */}
                    <div className="space-y-2">
                        <Label htmlFor="document-name">Document Name</Label>
                        <Input
                            id="document-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter document name"
                        />
                    </div>

                    {/* Document Type */}
                    <div className="space-y-2">
                        <Label htmlFor="document-type">Document Type</Label>
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
                        <Label htmlFor="document-year">Year</Label>
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
                            <Label htmlFor="document-public">Public Document</Label>
                            <p className="text-sm text-gray-500">
                                Make this document visible to all visitors
                            </p>
                        </div>
                        <Switch
                            id="document-public"
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
                            disabled={!name.trim() || !file || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {isUploading ? "Uploading..." : "Creating..."}
                                </>
                            ) : (
                                "Upload Document"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DocumentCreateDialog

