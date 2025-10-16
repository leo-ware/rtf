"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PersonCard } from "../PersonCard"

const OurStorytellersPage = () => {
    const peopleRaw = useQuery(api.people.listPeople, { limit: 100 });
    const people = (peopleRaw || []).map(person => {
        const imageRemote = person.image
        const image = (imageRemote && imageRemote.imageUrl)
            ? {
                src: imageRemote.imageUrl,
                alt: `portrait of ${person.name}`,
                width: imageRemote.width || 382,
                height: imageRemote.height || 315,
            }
            : undefined

        return { ...person, image }
    })

    const storytellers = people.filter(person => person.isStoryTeller);
    const ambassadors = people.filter(person => person.isAmbassador);

    return (
        <div className="w-11/12 mx-auto h-fit py-12 flex flex-col items-center justify-center gap-12">
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <div className="text-[48px] font-serif text-cinnamon text-center">
                    Our Storytellers
                </div>
                <div className="max-w-1/3 text-center text-lg italic">
                    text aboutt hwo it’s crucial for us to have thw work of these photographers something something; crucial for the work; 
                    maybe an open call to submit stuff if you have ever been involved with rtf?
                </div>
            </div>
            <div className="w-1/2 h-fit grid grid-cols-2 gap-12">
                {storytellers.map(person => (
                    <div key={person._id} className="w-full h-fit">
                        <PersonCard person={person} size="large" />
                    </div>
                ))}
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <div className="text-[48px] font-serif text-pewter text-center">
                    Artists and Ambassadors
                </div>
                <div className="max-w-1/3 text-center text-lg italic">
                    text aboutt hwo it’s crucial for us to have thw work of these photographers something something; crucial for the work; 
                    maybe an open call to submit stuff if you have ever been involved with rtf?
                </div>
            </div>
            <div className="w-1/2 h-fit grid grid-cols-3 gap-12">
                {ambassadors.map(person => (
                    <div key={person._id} className="w-full h-fit">
                        <PersonCard person={person} size="medium" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OurStorytellersPage