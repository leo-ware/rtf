"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Plus,
    Edit,
    Trash2,
    User,
    Users,
    Image as ImageIcon,
    AlertCircle,
    Star,
    Heart,
    ArrowUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { handleConvexError, handleNotFoundError } from "@/lib/errorHandler";
import { ImagePicker } from "@/components/ImagePicker";

const AdminPeoplePage = () => {
    const router = useRouter();
    const [isCreatePersonDialogOpen, setIsCreatePersonDialogOpen] = useState(false);
    const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false);
    const [isEditPersonDialogOpen, setIsEditPersonDialogOpen] = useState(false);
    const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] = useState(false);
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [deletingPerson, setDeletingPerson] = useState<Id<"people"> | null>(null);
    const [deletingBoard, setDeletingBoard] = useState<Id<"advisoryBoards"> | null>(null);
    const [confirmDeletePersonId, setConfirmDeletePersonId] = useState<Id<"people"> | null>(null);
    const [confirmDeleteBoardId, setConfirmDeleteBoardId] = useState<Id<"advisoryBoards"> | null>(null);
    const [editingPerson, setEditingPerson] = useState<Id<"people"> | null>(null);
    const [editingBoard, setEditingBoard] = useState<Id<"advisoryBoards"> | null>(null);

    const people = useQuery(api.people.listPeople, { limit: 100 });
    const advisoryBoards = useQuery(api.advisoryBoards.listAdvisoryBoards, { limit: 100 });
    const deletePerson = useMutation(api.people.deletePerson);
    const deleteBoard = useMutation(api.advisoryBoards.deleteAdvisoryBoard);
    const createPerson = useMutation(api.people.createPerson);
    const createBoard = useMutation(api.advisoryBoards.createAdvisoryBoard);
    const updatePerson = useMutation(api.people.updatePerson);
    const updateBoard = useMutation(api.advisoryBoards.updateAdvisoryBoard);

    const [personFormData, setPersonFormData] = useState({
        name: "",
        title: "",
        bio: "",
        imageId: "",
        imageUrl: "",
        isDirector: false,
        isStaff: false,
        isEquine: false,
        isStoryteller: false,
        isAmbassador: false,
        inMemoriam: false,
        advisoryBoardIds: [] as string[],
    });

    const [boardFormData, setBoardFormData] = useState({
        name: "",
        order: "",
    });

    const handleCreatePerson = async () => {
        try {
            await createPerson({
                name: personFormData.name,
                title: personFormData.title,
                bio: personFormData.bio,
                imageId: personFormData.imageId ? personFormData.imageId as Id<"images"> : undefined,
                isDirector: personFormData.isDirector,
                isStaff: personFormData.isStaff,
                isEquine: personFormData.isEquine,
                isStoryTeller: personFormData.isStoryteller,
                isAmbassador: personFormData.isAmbassador,
                inMemoriam: personFormData.inMemoriam,
                advisoryBoardIds: personFormData.advisoryBoardIds.map(id => id as Id<"advisoryBoards">),
            });

            setIsCreatePersonDialogOpen(false);
            resetPersonForm();
        } catch (error: any) {
            console.error("Error creating person:", error);
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "create person", router);
            } else {
                alert("Failed to create person: " + (error?.message || "Unknown error"));
            }
        }
    };

    const handleCreateBoard = async () => {
        try {
            await createBoard({
                name: boardFormData.name,
                order: parseInt(boardFormData.order),
            });

            setIsCreateBoardDialogOpen(false);
            resetBoardForm();
        } catch (error: any) {
            console.error("Error creating advisory board:", error);
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "create advisory board", router);
            } else {
                alert("Failed to create advisory board: " + (error?.message || "Unknown error"));
            }
        }
    };

    const handleDeletePerson = async (personId: Id<"people">) => {
        try {
            setDeletingPerson(personId);
            await deletePerson({ id: personId });
            setConfirmDeletePersonId(null);
        } catch (error: any) {
            console.error("Error deleting person:", error);
            if (error?.message?.includes('not found')) {
                handleNotFoundError("person", personId, undefined, router);
            } else if (error?.message?.includes('permission')) {
                handleConvexError(error, "delete person", router);
            } else {
                alert("Failed to delete person: " + (error?.message || "Unknown error"));
            }
        } finally {
            setDeletingPerson(null);
        }
    };

    const handleDeleteBoard = async (boardId: Id<"advisoryBoards">) => {
        try {
            setDeletingBoard(boardId);
            await deleteBoard({ id: boardId });
            setConfirmDeleteBoardId(null);
        } catch (error: any) {
            console.error("Error deleting advisory board:", error);
            if (error?.message?.includes('not found')) {
                handleNotFoundError("advisory board", boardId, undefined, router);
            } else if (error?.message?.includes('permission')) {
                handleConvexError(error, "delete advisory board", router);
            } else {
                alert("Failed to delete advisory board: " + (error?.message || "Unknown error"));
            }
        } finally {
            setDeletingBoard(null);
        }
    };

    const resetPersonForm = () => {
        setPersonFormData({
            name: "",
            title: "",
            bio: "",
            imageId: "",
            imageUrl: "",
            isDirector: false,
            isStaff: false,
            isEquine: false,
            isStoryteller: false,
            isAmbassador: false,
            inMemoriam: false,
            advisoryBoardIds: [],
        });
    };

    const resetBoardForm = () => {
        setBoardFormData({
            name: "",
            order: "",
        });
    };

    const handleEditPerson = (person: any) => {
        setPersonFormData({
            name: person.name,
            title: person.title,
            bio: person.bio,
            imageId: person.imageId || "",
            imageUrl: person.image?.imageUrl || "",
            isDirector: person.isDirector,
            isStaff: person.isStaff || false,
            isEquine: person.isEquine || false,
            isStoryteller: person.isStoryTeller || false,
            isAmbassador: person.isAmbassador || false,
            inMemoriam: person.inMemoriam,
            advisoryBoardIds: [], // We'll need to fetch this separately
        });
        setEditingPerson(person._id);
        setIsEditPersonDialogOpen(true);
    };

    const handleEditBoard = (board: any) => {
        setBoardFormData({
            name: board.name,
            order: board.order.toString(),
        });
        setEditingBoard(board._id);
        setIsEditBoardDialogOpen(true);
    };

    const handleUpdatePerson = async () => {
        if (!editingPerson) return;

        try {
            await updatePerson({
                id: editingPerson,
                name: personFormData.name,
                title: personFormData.title,
                bio: personFormData.bio,
                imageId: personFormData.imageId ? personFormData.imageId as Id<"images"> : undefined,
                isDirector: personFormData.isDirector,
                isStaff: personFormData.isStaff,
                isEquine: personFormData.isEquine,
                isStoryTeller: personFormData.isStoryteller,
                isAmbassador: personFormData.isAmbassador,
                inMemoriam: personFormData.inMemoriam,
                advisoryBoardIds: personFormData.advisoryBoardIds.map(id => id as Id<"advisoryBoards">),
            });

            setIsEditPersonDialogOpen(false);
            setEditingPerson(null);
            resetPersonForm();
        } catch (error: any) {
            console.error("Error updating person:", error);
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "update person", router);
            } else {
                alert("Failed to update person: " + (error?.message || "Unknown error"));
            }
        }
    };

    const handleUpdateBoard = async () => {
        if (!editingBoard) return;

        try {
            await updateBoard({
                id: editingBoard,
                name: boardFormData.name,
                order: parseInt(boardFormData.order),
            });

            setIsEditBoardDialogOpen(false);
            setEditingBoard(null);
            resetBoardForm();
        } catch (error: any) {
            console.error("Error updating advisory board:", error);
            if (error?.message?.includes('permission') || error?.message?.includes('not authenticated')) {
                handleConvexError(error, "update advisory board", router);
            } else {
                alert("Failed to update advisory board: " + (error?.message || "Unknown error"));
            }
        }
    };

    const handleImageSelect = (imageData: { imageId: string; imageUrl: string }) => {
        setPersonFormData(prev => ({
            ...prev,
            imageId: imageData.imageId,
            imageUrl: imageData.imageUrl,
        }));
        setIsImagePickerOpen(false);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (people === undefined || advisoryBoards === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="people" className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <TabsList className="grid w-fit grid-cols-2">
                        <TabsTrigger value="people">People</TabsTrigger>
                        <TabsTrigger value="advisory-boards">Advisory Boards</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <Dialog open={isCreatePersonDialogOpen} onOpenChange={setIsCreatePersonDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetPersonForm}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Person
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New Person</DialogTitle>
                                    <DialogDescription>
                                        Add a new person to your organization directory.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="person-name">Name</Label>
                                        <Input
                                            id="person-name"
                                            value={personFormData.name}
                                            onChange={(e) => setPersonFormData({ ...personFormData, name: e.target.value })}
                                            placeholder="Enter person's name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="person-title">Title</Label>
                                        <Input
                                            id="person-title"
                                            value={personFormData.title}
                                            onChange={(e) => setPersonFormData({ ...personFormData, title: e.target.value })}
                                            placeholder="Enter person's title"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="person-bio">Bio</Label>
                                        <Textarea
                                            id="person-bio"
                                            value={personFormData.bio}
                                            onChange={(e) => setPersonFormData({ ...personFormData, bio: e.target.value })}
                                            placeholder="Enter person's biography"
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <Label>Profile Image</Label>
                                        <div className="flex items-center gap-4">
                                            {personFormData.imageUrl ? (
                                                <img
                                                    src={personFormData.imageUrl}
                                                    alt="Selected"
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsImagePickerOpen(true)}
                                            >
                                                {personFormData.imageUrl ? "Change Image" : "Select Image"}
                                            </Button>
                                            {personFormData.imageUrl && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setPersonFormData({ ...personFormData, imageId: "", imageUrl: "" })}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Advisory Boards</Label>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {advisoryBoards.map((board) => (
                                                <div key={board._id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`board-${board._id}`}
                                                        checked={personFormData.advisoryBoardIds.includes(board._id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setPersonFormData({
                                                                    ...personFormData,
                                                                    advisoryBoardIds: [...personFormData.advisoryBoardIds, board._id]
                                                                });
                                                            } else {
                                                                setPersonFormData({
                                                                    ...personFormData,
                                                                    advisoryBoardIds: personFormData.advisoryBoardIds.filter(id => id !== board._id)
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`board-${board._id}`}>{board.name}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is-director"
                                                checked={personFormData.isDirector}
                                                onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isDirector: !!checked })}
                                            />
                                            <Label htmlFor="is-director">Board Director</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is-staff"
                                                checked={personFormData.isStaff}
                                                onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isStaff: !!checked })}
                                            />
                                            <Label htmlFor="is-staff">Staff</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is-equine"
                                                checked={personFormData.isEquine}
                                                onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isEquine: !!checked })}
                                            />
                                            <Label htmlFor="is-equine">Equine</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is-storyteller"
                                                checked={personFormData.isStoryteller}
                                                onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isStoryteller: !!checked })}
                                            />
                                            <Label htmlFor="is-storyteller">Storyteller</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is-ambassador"
                                                checked={personFormData.isAmbassador}
                                                onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isAmbassador: !!checked })}
                                            />
                                            <Label htmlFor="is-ambassador">Ambassador</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="in-memoriam"
                                                checked={personFormData.inMemoriam}
                                                onCheckedChange={(checked) => setPersonFormData({ ...personFormData, inMemoriam: !!checked })}
                                            />
                                            <Label htmlFor="in-memoriam">In Memoriam</Label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={resetPersonForm}>
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={handleCreatePerson}
                                            disabled={!personFormData.name || !personFormData.title || !personFormData.bio}
                                        >
                                            Add Person
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isCreateBoardDialogOpen} onOpenChange={setIsCreateBoardDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" onClick={resetBoardForm}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Advisory Board
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add Advisory Board</DialogTitle>
                                    <DialogDescription>
                                        Add a new advisory board category.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="board-name">Name</Label>
                                        <Input
                                            id="board-name"
                                            value={boardFormData.name}
                                            onChange={(e) => setBoardFormData({ ...boardFormData, name: e.target.value })}
                                            placeholder="Enter advisory board name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="board-order">Display Order</Label>
                                        <Input
                                            id="board-order"
                                            type="number"
                                            value={boardFormData.order}
                                            onChange={(e) => setBoardFormData({ ...boardFormData, order: e.target.value })}
                                            placeholder="Enter display order (e.g., 1, 2, 3)"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={resetBoardForm}>
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={handleCreateBoard}
                                            disabled={!boardFormData.name || !boardFormData.order}
                                        >
                                            Add Board
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <TabsContent value="people" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total People
                                </CardTitle>
                                <Users className="h-4 w-4 text-gray-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{people?.length || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Board Directors
                                </CardTitle>
                                <Star className="h-4 w-4 text-gray-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {people?.filter(p => p.isDirector).length || 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Staff
                                </CardTitle>
                                <User className="h-4 w-4 text-gray-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {people?.filter(p => p.isStaff).length || 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Equine
                                </CardTitle>
                                <Heart className="h-4 w-4 text-gray-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {people?.filter(p => p.isEquine).length || 0}
                                </div>
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
                                <div className="text-2xl font-bold">
                                    {people?.filter(p => p.inMemoriam).length || 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {people.map((person) => (
                            <Card key={person._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-2">{person.name}</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">{person.title}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                {person.isDirector && (
                                                    <Badge className="bg-blue-100 text-blue-800">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Director
                                                    </Badge>
                                                )}
                                                {person.isStaff && (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <User className="h-3 w-3 mr-1" />
                                                        Staff
                                                    </Badge>
                                                )}
                                                {person.isEquine && (
                                                    <Badge className="bg-orange-100 text-orange-800">
                                                        <Heart className="h-3 w-3 mr-1" />
                                                        Equine
                                                    </Badge>
                                                )}
                                                {person.inMemoriam && (
                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                                        <Heart className="h-3 w-3 mr-1" />
                                                        In Memoriam
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button variant="outline" size="sm" onClick={() => handleEditPerson(person)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setConfirmDeletePersonId(person._id)}
                                                disabled={deletingPerson === person._id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {person.image?.imageUrl && (
                                            <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={person.image.imageUrl}
                                                    alt={person.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {person.bio}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <User className="h-3 w-3 mr-1" />
                                                Unknown
                                            </div>
                                            <div>
                                                {formatDate(person._creationTime)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {people.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No people yet</h3>
                            <p className="text-gray-600 mb-4">Get started by adding your first team member</p>
                            <Button onClick={() => setIsCreatePersonDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Person
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="advisory-boards" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {advisoryBoards.map((board) => (
                            <Card key={board._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-2">{board.name}</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">Order: {board.order}</p>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button variant="outline" size="sm" onClick={() => handleEditBoard(board)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setConfirmDeleteBoardId(board._id)}
                                                disabled={deletingBoard === board._id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <User className="h-3 w-3 mr-1" />
                                            Unknown
                                        </div>
                                        <div>
                                            {formatDate(board._creationTime)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {advisoryBoards.length === 0 && (
                        <div className="text-center py-12">
                            <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No advisory boards yet</h3>
                            <p className="text-gray-600 mb-4">Get started by adding your first advisory board</p>
                            <Button onClick={() => setIsCreateBoardDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Advisory Board
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Delete Person Confirmation Dialog */}
            <AlertDialog open={confirmDeletePersonId !== null} onOpenChange={(open) => !open && setConfirmDeletePersonId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Person</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this person? This action cannot be undone and will permanently remove the person from your organization directory.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDeletePersonId(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeletePersonId && handleDeletePerson(confirmDeletePersonId)}
                            disabled={deletingPerson !== null}
                        >
                            {deletingPerson === confirmDeletePersonId ? "Deleting..." : "Delete Person"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Advisory Board Confirmation Dialog */}
            <AlertDialog open={confirmDeleteBoardId !== null} onOpenChange={(open) => !open && setConfirmDeleteBoardId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Advisory Board</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this advisory board? This action cannot be undone and will remove all associations with people.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDeleteBoardId(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteBoardId && handleDeleteBoard(confirmDeleteBoardId)}
                            disabled={deletingBoard !== null}
                        >
                            {deletingBoard === confirmDeleteBoardId ? "Deleting..." : "Delete Board"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Person Dialog */}
            <Dialog open={isEditPersonDialogOpen} onOpenChange={setIsEditPersonDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Person</DialogTitle>
                        <DialogDescription>
                            Update the person's information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-person-name">Name</Label>
                            <Input
                                id="edit-person-name"
                                value={personFormData.name}
                                onChange={(e) => setPersonFormData({ ...personFormData, name: e.target.value })}
                                placeholder="Enter person's name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-person-title">Title</Label>
                            <Input
                                id="edit-person-title"
                                value={personFormData.title}
                                onChange={(e) => setPersonFormData({ ...personFormData, title: e.target.value })}
                                placeholder="Enter person's title"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-person-bio">Bio</Label>
                            <Textarea
                                id="edit-person-bio"
                                value={personFormData.bio}
                                onChange={(e) => setPersonFormData({ ...personFormData, bio: e.target.value })}
                                placeholder="Enter person's biography"
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label>Profile Image</Label>
                            <div className="flex items-center gap-4">
                                {personFormData.imageUrl ? (
                                    <img
                                        src={personFormData.imageUrl}
                                        alt="Selected"
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsImagePickerOpen(true)}
                                >
                                    {personFormData.imageUrl ? "Change Image" : "Select Image"}
                                </Button>
                                {personFormData.imageUrl && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setPersonFormData({ ...personFormData, imageId: "", imageUrl: "" })}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Advisory Boards</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {advisoryBoards.map((board) => (
                                    <div key={board._id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`edit-board-${board._id}`}
                                            checked={personFormData.advisoryBoardIds.includes(board._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setPersonFormData({
                                                        ...personFormData,
                                                        advisoryBoardIds: [...personFormData.advisoryBoardIds, board._id]
                                                    });
                                                } else {
                                                    setPersonFormData({
                                                        ...personFormData,
                                                        advisoryBoardIds: personFormData.advisoryBoardIds.filter(id => id !== board._id)
                                                    });
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`edit-board-${board._id}`}>{board.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-is-director"
                                    checked={personFormData.isDirector}
                                    onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isDirector: !!checked })}
                                />
                                <Label htmlFor="edit-is-director">Board Director</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-is-staff"
                                    checked={personFormData.isStaff}
                                    onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isStaff: !!checked })}
                                />
                                <Label htmlFor="edit-is-staff">Staff</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-is-equine"
                                    checked={personFormData.isEquine}
                                    onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isEquine: !!checked })}
                                />
                                <Label htmlFor="edit-is-equine">Equine</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-is-storyteller"
                                    checked={personFormData.isStoryteller}
                                    onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isStoryteller: !!checked })}
                                />
                                <Label htmlFor="edit-is-storyteller">Storyteller</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-is-ambassador"
                                    checked={personFormData.isAmbassador}
                                    onCheckedChange={(checked) => setPersonFormData({ ...personFormData, isAmbassador: !!checked })}
                                />
                                <Label htmlFor="edit-is-ambassador">Ambassador</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-in-memoriam"
                                    checked={personFormData.inMemoriam}
                                    onCheckedChange={(checked) => setPersonFormData({ ...personFormData, inMemoriam: !!checked })}
                                />
                                <Label htmlFor="edit-in-memoriam">In Memoriam</Label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => {
                                setIsEditPersonDialogOpen(false);
                                setEditingPerson(null);
                                resetPersonForm();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdatePerson}
                                disabled={!personFormData.name || !personFormData.title || !personFormData.bio}
                            >
                                Update Person
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Advisory Board Dialog */}
            <Dialog open={isEditBoardDialogOpen} onOpenChange={setIsEditBoardDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Advisory Board</DialogTitle>
                        <DialogDescription>
                            Update the advisory board information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-board-name">Name</Label>
                            <Input
                                id="edit-board-name"
                                value={boardFormData.name}
                                onChange={(e) => setBoardFormData({ ...boardFormData, name: e.target.value })}
                                placeholder="Enter advisory board name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-board-order">Display Order</Label>
                            <Input
                                id="edit-board-order"
                                type="number"
                                value={boardFormData.order}
                                onChange={(e) => setBoardFormData({ ...boardFormData, order: e.target.value })}
                                placeholder="Enter display order (e.g., 1, 2, 3)"
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => {
                                setIsEditBoardDialogOpen(false);
                                setEditingBoard(null);
                                resetBoardForm();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateBoard}
                                disabled={!boardFormData.name || !boardFormData.order}
                            >
                                Update Board
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Image Picker */}
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onImageSelect={handleImageSelect}
                title="Select Profile Image"
                description="Choose an image for this person's profile"
            />
        </div>
    );
};

export default AdminPeoplePage;