"use client"

import { PageProps } from "@/lib/types"
import { useMutation, useQuery } from "convex/react"
import { use, useState } from "react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import ReorderableList from "@/components/ReorderableList"
import { Trash, User, ArrowLeft } from "lucide-react"
import ConvexImage from "@/components/images/ConvexImage"
import { Button } from "@/components/ui/button"
import AdvisoryBoardEditDialog from "../AdvisoryBoardEditDialog"
import AdvisoryBoardDeleteDialog from "../AdvisoryBoardDeleteDialog"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"

const AdvisoryBoardPage = (props: PageProps<{ advisoryBoardId: Id<"advisoryBoards"> }>) => {
    const { advisoryBoardId } = use(props.params)
    const router = useRouter()

    const advisoryBoard = useQuery(api.advisoryBoards.getAdvisoryBoardWithPeople, { id: advisoryBoardId })
    const updatePeopleAdvisoryBoards = useMutation(api.advisoryBoards.updatePeopleAdvisoryBoards)
    
    const [removeDialogOpen, setRemoveDialogOpen] = useState<null | Id<"peopleAdvisoryBoards">>(null)

    const handleReorder = async (newOrder: Id<"people">[]) => {
        await updatePeopleAdvisoryBoards({
            id: advisoryBoardId,
            people: newOrder
        })
    }

    if (advisoryBoard === undefined) {
        return (
            <div>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                </div>
            </div>
        )
    }

    if (advisoryBoard === null) {
        router.push("/admin/people/advisory-boards")
        return null
    }

    return (
        <div>
            <div>
                <Link href="/admin/people/advisory-boards">
                    <Button variant="ghost" size="sm" className="px-0">
                        <ArrowLeft className="h-4 w-4" />
                        Back to advisory boards
                    </Button>
                </Link>
            </div>
            <div className="my-8">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold">{advisoryBoard?.name}</h1>
                    <div className="flex items-center gap-2">
                        <div className="relative w-fit">
                            <AdvisoryBoardEditDialog advisoryBoardId={advisoryBoardId}>
                                {/* <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                            Edit Advisory Board
                        </Button> */}
                            </AdvisoryBoardEditDialog>
                        </div>

                        <div className="relative w-fit">
                            <AdvisoryBoardDeleteDialog advisoryBoardId={advisoryBoardId}>
                                {/* <Button variant="outline" size="icon">
                            <Trash className="h-4 w-4" />
                            Delete Advisory Board
                        </Button> */}
                            </AdvisoryBoardDeleteDialog>
                        </div>
                    </div>
                </div>
                <div className="my-4">
                    Add members or edit using the edit button. Reorder members through drag and drop below.
                </div>
            </div>

            <div>
                {!advisoryBoard.peopleAdvisoryBoards || advisoryBoard.peopleAdvisoryBoards.length === 0 && (
                    <div className="text-gray-500">
                        This advisory board has no members. Add members using the edit button.
                    </div>
                )}
                {advisoryBoard.peopleAdvisoryBoards && advisoryBoard?.peopleAdvisoryBoards?.length > 0 && (
                    <ReorderableList
                        onReorder={handleReorder}
                        items={(advisoryBoard?.peopleAdvisoryBoards ?? [])
                            .filter(pab => !!pab?.person)
                            .sort((a, b) => a.order - b.order)
                            .map(({ _id, person }) => ({
                                id: person._id,
                                widget: (
                                    <div className="w-full p-2 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                {person.image?.url ? (
                                                    <ConvexImage
                                                        src={person.image.url}
                                                        alt={person.name}
                                                        width={person.image.width || 100}
                                                        height={person.image.height || 100}
                                                        className="w-10 h-10 rounded-md overflow-hidden"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {person.name}
                                            </div>
                                        </div>
                                        <div>
                                            <Tooltip>
                                                <TooltipTrigger asChild onClick={() => setRemoveDialogOpen(_id)}>
                                                    <Button variant="outline" size="icon">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Remove person from advisory board
                                                </TooltipContent>
                                            </Tooltip>

                                            <AlertDialog
                                                open={removeDialogOpen === _id}
                                                onOpenChange={(open) => {
                                                    if (!open) {
                                                        setRemoveDialogOpen(null)
                                                    }
                                                }}>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remove person from advisory board</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to remove this person from the advisory board?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setRemoveDialogOpen(null)}>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={async () => {
                                                                const currentPeople = advisoryBoard.peopleAdvisoryBoards
                                                                    .filter(pab => pab._id !== removeDialogOpen)
                                                                    .sort((a, b) => a.order - b.order)
                                                                    .map(pab => pab.person._id)
                                                                await updatePeopleAdvisoryBoards({
                                                                    id: advisoryBoardId,
                                                                    people: currentPeople
                                                                })
                                                                setRemoveDialogOpen(null)
                                                            }}
                                                        >
                                                            Remove
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                )
                            }))}
                    />
                )}
            </div>
        </div>
    )
}

export default AdvisoryBoardPage