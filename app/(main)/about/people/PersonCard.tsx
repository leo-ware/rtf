"use client"

import { ConvexImageProps } from "@/components/ConvexImage";
import { IoPersonOutline } from "react-icons/io5";
import { useState } from "react";
import Image from "next/image";

export type Person = {
    name: string
    title?: string
    bio?: string
    image?: ConvexImageProps
}

export const PersonCard = ({ person, size = "medium" }: { person: Person, size?: "small" | "medium" | "large" }) => {
    const [open, setOpen] = useState(false);

    const nameSize = size === "small"
        ? 12
        : size === "medium"
            ? 16
            : 28

    const titleSize = size === "small"
        ? 10
        : size === "medium"
            ? 14
            : 25
    
    const bioSize = size === "small"
        ? 8
        : size === "medium"
            ? 12
            : 18
    
    return (
        <div className="w-full h-fit text-charcoal" onClick={() => setOpen(!open)}>
            <div className="z-0 w-full relative aspect-[382/315] bg-gray-300">
                <div className="z-0 absolute top-0 left-0 w-full h-full mx-auto">
                    <IoPersonOutline className="w-3/4 h-fit object-cover object-center mx-auto text-gray-500" />
                </div>
                <div className="z-10 relative w-full h-full">
                    {person.image && (
                        <Image
                            src={person.image.src}
                            alt={person.image.alt}
                            width={person.image.width}
                            height={person.image.height}
                            className="w-full h-full object-cover object-center"
                        />
                    )}
                </div>
            </div>
            <div className="font-serif" style={{ fontSize: nameSize }}>
                {person.name}
            </div>
            {person.title && (
                <div style={{ fontSize: titleSize }}>
                    {person.title}
                </div>
            )}
            {open && <div style={{ fontSize: bioSize }}>
                {person.bio}
            </div>}
        </div>
    )
}