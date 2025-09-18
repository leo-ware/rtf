"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    User,
    FileText,
    ExternalLink,
    Heart,
    Award,
    Filter,
    Search,
    X,
    Grid3X3,
    List
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { handleConvexError, handleNotFoundError } from "@/lib/errorHandler"
import ConvexImage from "@/components/ConvexImage"
import { ImagePicker } from "@/components/ImagePicker"

const AdminAnimalsPage = () => {
    const router = useRouter()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [deletingAnimal, setDeletingAnimal] = useState<Id<"animals"> | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"animals"> | null>(null)
    const [filterType, setFilterType] = useState<"all" | "horse" | "burro">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
    const [isCreatingNewHerd, setIsCreatingNewHerd] = useState(false)
    const [newHerdName, setNewHerdName] = useState("")
    const [newHerdDescription, setNewHerdDescription] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const animals = useQuery(api.animals.listAnimals, {
        publicOnly: false,
        limit: 100,
        ...(filterType !== "all" && { type: filterType as "horse" | "burro" })
    })
    const herds = useQuery(api.herds.listHerds, { limit: 100 })
    const animalStats = useQuery(api.animals.getAnimalStats)
    const deleteAnimal = useMutation(api.animals.deleteAnimal)
    const createAnimal = useMutation(api.animals.createAnimal)
    const createHerd = useMutation(api.herds.createHerd)

    const [formData, setFormData] = useState({
        name: "",
        type: "horse" as "horse" | "burro",
        herdId: "",
        description: "",
        content: "",
        imageId: "",
        ambassador: false,
        inMemoriam: false,
        public: false,
    })

    const filteredAnimals = animals?.filter(animal =>
        searchTerm === "" ||
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.herd.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    const handleCreateAnimal = async () => {
        try {
            let herdId = formData.herdId

            // If creating a new herd, create it first
            if (isCreatingNewHerd && newHerdName.trim()) {
                herdId = await createHerd({
                    name: newHerdName,
                    description: newHerdDescription || undefined,
                })
            }

            if (!herdId) {
                alert("Please select or create a herd first")
                return
            }

            const animalId = await createAnimal({
                name: formData.name,
                type: formData.type,
                herdId: herdId as Id<"herds">,
                description: formData.description,
                content: formData.content || undefined,
                imageId: formData.imageId as Id<"images"> || undefined,
                ambassador: formData.ambassador,
                inMemoriam: formData.inMemoriam,
                public: formData.public,
            })

            setIsCreateDialogOpen(false)
            resetForm()

            // Navigate to edit page for the new animal
            router.push(`/admin/animals/edit/${animalId}`)
        } catch (error: any) {
            console.error("Error creating animal:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "create animal", router)
            } else {
                alert("Failed to create animal: " + (error?.message || "Unknown error"))
            }
        }
    }

    const handleDeleteAnimal = async (animalId: Id<"animals">) => {
        setDeletingAnimal(animalId)
        try {
            await deleteAnimal({ id: animalId })
            setConfirmDeleteId(null)
        } catch (error: any) {
            console.error("Error deleting animal:", error)
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "delete animal", router)
            } else {
                alert("Failed to delete animal: " + (error?.message || "Unknown error"))
            }
        } finally {
            setDeletingAnimal(null)
        }
    }

    const handleCreateNewHerd = async () => {
        if (!newHerdName.trim()) return

        try {
            const herdId = await createHerd({
                name: newHerdName,
                description: newHerdDescription || undefined,
            })

            // Set the newly created herd as selected
            setFormData(prev => ({ ...prev, herdId: herdId }))

            // Reset herd creation form
            setNewHerdName("")
            setNewHerdDescription("")
            setIsCreatingNewHerd(false)
        } catch (error: any) {
            console.error("Error creating herd:", error)
            alert("Failed to create herd: " + (error?.message || "Unknown error"))
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            type: "horse",
            herdId: "",
            description: "",
            content: "",
            imageId: "",
            ambassador: false,
            inMemoriam: false,
            public: false,
        })
        setIsCreatingNewHerd(false)
        setNewHerdName("")
        setNewHerdDescription("")
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (animals === undefined || herds === undefined) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Action Header */}
            <div className="flex justify-end items-center mb-8">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Animal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Animal</DialogTitle>
                            <DialogDescription>
                                Add a new animal to your collection. You can edit more details after creation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Animal name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Select value={formData.type} onValueChange={(value: "horse" | "burro") => setFormData(prev => ({ ...prev, type: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="horse">Horse</SelectItem>
                                        <SelectItem value="burro">Burro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="herdId">Herd</Label>
                                {!isCreatingNewHerd ? (
                                    <div className="space-y-2">
                                        <Select value={formData.herdId} onValueChange={(value) => setFormData(prev => ({ ...prev, herdId: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a herd" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {herds?.map((herd) => (
                                                    <SelectItem key={herd._id} value={herd._id}>
                                                        {herd.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsCreatingNewHerd(true)}
                                            className="w-full"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create New Herd
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Create New Herd</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setIsCreatingNewHerd(false)
                                                    setNewHerdName("")
                                                    setNewHerdDescription("")
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <Label htmlFor="newHerdName">Herd Name</Label>
                                            <Input
                                                id="newHerdName"
                                                value={newHerdName}
                                                onChange={(e) => setNewHerdName(e.target.value)}
                                                placeholder="Enter herd name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="newHerdDescription">Description (Optional)</Label>
                                            <Textarea
                                                id="newHerdDescription"
                                                value={newHerdDescription}
                                                onChange={(e) => setNewHerdDescription(e.target.value)}
                                                placeholder="Brief description of the herd"
                                                rows={2}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handleCreateNewHerd}
                                            disabled={!newHerdName.trim()}
                                            className="w-full"
                                        >
                                            Create Herd
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the animal"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Image</Label>
                                <div className="space-y-2">
                                    {formData.imageId ? (
                                        <div className="text-sm text-gray-600">
                                            Image selected
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            No image selected
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsImagePickerOpen(true)}
                                            className="flex-1"
                                        >
                                            {formData.imageId ? "Change" : "Select"} Image
                                        </Button>
                                        {formData.imageId && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setFormData(prev => ({ ...prev, imageId: "" }))}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ambassador"
                                        checked={formData.ambassador}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ambassador: checked }))}
                                    />
                                    <Label htmlFor="ambassador">Ambassador</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="inMemoriam"
                                        checked={formData.inMemoriam}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inMemoriam: checked }))}
                                    />
                                    <Label htmlFor="inMemoriam">In Memoriam</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="public"
                                        checked={formData.public}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, public: checked }))}
                                    />
                                    <Label htmlFor="public">Public</Label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateAnimal}
                                    disabled={
                                        !formData.name ||
                                        !formData.description ||
                                        (!formData.herdId && !isCreatingNewHerd) ||
                                        (isCreatingNewHerd && !newHerdName.trim())
                                    }
                                >
                                    Create Animal
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            {animalStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Animals
                            </CardTitle>
                            <FileText className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{animalStats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Public
                            </CardTitle>
                            <Eye className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{animalStats.public}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Ambassadors
                            </CardTitle>
                            <Award className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{animalStats.ambassadors}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                In Memoriam
                            </CardTitle>
                            <Heart className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{animalStats.inMemoriam}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search animals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                    />
                </div>

                <Select value={filterType} onValueChange={(value: "all" | "horse" | "burro") => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="horse">Horses</SelectItem>
                        <SelectItem value="burro">Burros</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg ml-auto">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Animals Content */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAnimals.map((animal) => (
                        <Card key={animal._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative bg-gray-100">
                                {animal.image?.url ? (
                                    <ConvexImage
                                        src={animal.image.url}
                                        alt={animal.name}
                                        width={animal.image.width || 400}
                                        height={animal.image.height || 300}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <FileText className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                            
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-1">{animal.name}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Badge variant={animal.type === "horse" ? "default" : "secondary"}>
                                                {animal.type}
                                            </Badge>
                                            <span>•</span>
                                            <span>{animal.herd.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Link href={`/admin/animals/edit/${animal._id}`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setConfirmDeleteId(animal._id)}
                                            disabled={deletingAnimal === animal._id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {animal.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {animal.public && (
                                        <Badge variant="outline" className="text-green-600">
                                            <Eye className="h-3 w-3 mr-1" />
                                            Public
                                        </Badge>
                                    )}
                                    {!animal.public && (
                                        <Badge variant="outline" className="text-gray-600">
                                            <EyeOff className="h-3 w-3 mr-1" />
                                            Private
                                        </Badge>
                                    )}
                                    {animal.ambassador && (
                                        <Badge variant="outline" className="text-yellow-600">
                                            <Award className="h-3 w-3 mr-1" />
                                            Ambassador
                                        </Badge>
                                    )}
                                    {animal.inMemoriam && (
                                        <Badge variant="outline" className="text-red-600">
                                            <Heart className="h-3 w-3 mr-1" />
                                            In Memoriam
                                        </Badge>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(animal._creationTime)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Animal</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Herd</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAnimals.map((animal) => (
                                    <tr key={animal._id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {animal.image?.url ? (
                                                        <ConvexImage
                                                            src={animal.image.url}
                                                            alt={animal.name}
                                                            width={48}
                                                            height={48}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-gray-900 truncate">
                                                        {animal.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {animal.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge variant={animal.type === "horse" ? "default" : "secondary"}>
                                                {animal.type}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-900">{animal.herd.name}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {animal.public && (
                                                    <Badge variant="outline" className="text-green-600">
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        Public
                                                    </Badge>
                                                )}
                                                {!animal.public && (
                                                    <Badge variant="outline" className="text-gray-600">
                                                        <EyeOff className="h-3 w-3 mr-1" />
                                                        Private
                                                    </Badge>
                                                )}
                                                {animal.ambassador && (
                                                    <Badge variant="outline" className="text-yellow-600">
                                                        <Award className="h-3 w-3 mr-1" />
                                                        Ambassador
                                                    </Badge>
                                                )}
                                                {animal.inMemoriam && (
                                                    <Badge variant="outline" className="text-red-600">
                                                        <Heart className="h-3 w-3 mr-1" />
                                                        In Memoriam
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(animal._creationTime)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/admin/animals/edit/${animal._id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setConfirmDeleteId(animal._id)}
                                                    disabled={deletingAnimal === animal._id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredAnimals.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No animals found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? `No animals match "${searchTerm}"`
                            : "Get started by creating your first animal."
                        }
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Animal
                        </Button>
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the animal and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteId && handleDeleteAnimal(confirmDeleteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Image Picker Modal */}
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={(imageData) => {
                    setFormData(prev => ({ ...prev, imageId: imageData.imageId }))
                }}
                title="Select Animal Image"
                description="Choose an image for this animal"
            />
        </div>
    )
}

export default AdminAnimalsPage
