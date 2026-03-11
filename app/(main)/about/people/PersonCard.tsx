"use client"

import { ConvexImageProps } from "@/components/images/ConvexImage";
import { IoPersonOutline } from "react-icons/io5";
import { useState } from "react";
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit";

export type Person = {
    name: string
    title?: string
    bio?: string
    image?: ConvexImageProps
}

export const PersonCard = ({ person, size = "medium" }: { person: Person, size?: "small" | "medium" | "large" }) => {
    const [open, setOpen] = useState(false);
    
    return (
        <div className="w-full h-fit text-charcoal" onClick={() => setOpen(!open)}>
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
            {open && <div className="text-[20px]">
                {person.bio}
            </div>}
        </div>
    )
}