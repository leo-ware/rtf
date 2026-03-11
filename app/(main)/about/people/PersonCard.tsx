"use client"

import { ConvexImageProps } from "@/components/images/ConvexImage"
import { IoPersonOutline } from "react-icons/io5"
import { useState } from "react"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

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
                    className="bg-[#4a5e3e] border-none text-white sm:max-w-2xl p-0 overflow-hidden rounded-lg outline-none"
                >
                    <DialogTitle className="sr-only">{person.name}</DialogTitle>
                    <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-[240px] sm:min-w-[240px] aspect-square relative bg-gray-600 overflow-hidden">
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
                        <div className="p-6 flex flex-col gap-1 overflow-y-auto max-h-[60vh]">
                            <div className="font-serif text-2xl font-bold">{person.name}</div>
                            {person.title && (
                                <div className="text-base italic text-white/80">{person.title}</div>
                            )}
                            {person.bio && (
                                <div className="text-sm leading-relaxed text-white/90 mt-2">{person.bio}</div>
                            )}
                            {person.link && (
                                <a
                                    href={person.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-white/60 hover:text-white mt-2 underline"
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
