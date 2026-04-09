"use client"

import { ConvexImageProps } from "@/components/images/ConvexImage"
import { IoPersonOutline } from "react-icons/io5"
import { useState } from "react"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { XIcon } from "lucide-react"

export type Person = {
    name: string
    title?: string
    bio?: string
    image?: ConvexImageProps
    link?: string
}

export const PersonCard = ({ person }: { person: Person, size?: "small" | "medium" | "large" }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="w-full h-fit text-charcoal cursor-pointer" onClick={() => setOpen(true)}>
                <div className="z-0 w-full relative aspect-[382/315] bg-gray-300 rounded-sm overflow-hidden">
                    <div className="z-0 absolute top-0 left-0 w-full h-full mx-auto">
                        <IoPersonOutline className="w-3/4 h-fit object-cover object-center mx-auto text-gray-500" />
                    </div>
                    <div className="z-10 relative w-full h-full">
                        {person.image && (
                            <ImageWithAuthorCredit
                                src={person.image.src}
                                alt={person.image.alt}
                                width={person.image.width}
                                height={person.image.height}
                                wrapperClassName="w-full h-full"
                                className="w-full h-full object-cover object-center rounded-sm"
                                authorCredit={person.image.authorCredit}
                            />
                        )}
                    </div>
                </div>
                <div className="font-serif text-[36px]">
                    {person.name}
                </div>
                {person.title && (
                    <div className="text-[25px]">
                        {person.title}
                    </div>
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="block bg-sage-green border-none text-white !max-w-none w-[min(80vw,45vh)] h-[min(160vw,90vh)] sm:w-[min(85vw,900px)] sm:h-[min(42.5vw,450px)] p-0 gap-0 overflow-hidden rounded-lg outline-none"
                >
                    <DialogTitle className="sr-only">{person.name}</DialogTitle>
                    <DialogClose className="absolute top-3 right-3 z-10 text-white opacity-70 hover:opacity-100 transition-opacity outline-none focus:outline-none">
                        <XIcon className="size-6" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                    <div className="flex flex-col sm:flex-row w-full h-full">
                        <div className="w-full h-1/2 sm:w-1/2 sm:h-full relative bg-gray-600 overflow-hidden shrink-0">
                            {person.image ? (
                                <ImageWithAuthorCredit
                                    src={person.image.src}
                                    alt={person.image.alt}
                                    width={person.image.width}
                                    height={person.image.height}
                                    wrapperClassName="w-full h-full"
                                    className="w-full h-full object-cover object-center"
                                    authorCredit={person.image.authorCredit}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IoPersonOutline className="w-3/4 h-3/4 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="w-full h-1/2 sm:w-1/2 sm:h-full p-6 flex flex-col gap-1 min-w-0 min-h-0 overflow-hidden">
                            <div className="font-serif text-2xl lg:text-3xl font-bold shrink-0 min-w-0">{person.name}</div>
                            {person.title && (
                                <div className="text-base lg:text-lg italic text-white/80 shrink-0 min-w-0">{person.title}</div>
                            )}
                            {person.bio && (
                                <div className="text-sm lg:text-base leading-relaxed text-white/90 mt-2 flex-1 min-h-0 min-w-0 overflow-y-auto [overflow-wrap:anywhere]">{person.bio}</div>
                            )}
                            {person.link && (
                                <a
                                    href={person.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-white/60 hover:text-white mt-2 underline shrink-0 min-w-0"
                                >
                                    Read more
                                </a>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
