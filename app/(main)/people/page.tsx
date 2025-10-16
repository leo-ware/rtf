"use client"

import Image from "next/image"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Button from "@/components/Button"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import FlipCard from "@/components/FlipCard"
import { IoPersonOutline } from "react-icons/io5"
import { PersonCard } from "./PersonCard"
import PeopleHero from "./people-hero.png"
import ConvexImage, { ConvexImageProps } from "@/components/ConvexImage";
import { useState } from "react";
import { dedupArray, indexArrayUnique, multipleIndexArray } from "@/lib/utils";

const PeoplePage = () => {
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


    const boardOfDirectors = people.filter(person => person.isDirector && !person.inMemoriam);
    const staff = people.filter(person => person.isStaff);
    const ranchAndEquine = people.filter(person => person.isEquine);
    const inMemoriam = people.filter(person => person.inMemoriam);

    const userBoardsMap = multipleIndexArray(people, person => person.boards.map(board => board._id));
    const advisoryBoardsMap = indexArrayUnique(people.map(person => person.boards).flat(), board => board._id);
    const advisoryBoards = Array.from(advisoryBoardsMap
        .keys()
        .map(key => {
            const board = advisoryBoardsMap.get(key)
            const people = userBoardsMap.get(key) || []
            return {
                board: board!,
                people,
            }
        }))

    return (
        <div className="w-full h-fit bg-[#F4F0E8]">
            <div className="w-full h-[400px] relative flex items-center justify-center">
                <Image src={PeopleHero} alt="People Hero" className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center" fill />
                <div className="z-10 p-4 border-b border-white text-white text-[48px] font-serif">
                    Our Team
                </div>
            </div>

            {people.length > 0 && (
                <div className="w-10/12 h-fit py-16 mx-auto grid grid-cols-3 gap-12">
                    {boardOfDirectors.length > 0 && (
                        <div className="w-full h-fit col-span-3 grid grid-cols-subgrid">
                            <div className="col-span-3 mb-10 text-center text-[48px] text-pewter font-serif">
                                Board of Directors
                            </div>

                            {boardOfDirectors.map((person) => (
                                <div key={person._id} className="col-span-1">
                                    <PersonCard key={person._id} person={person} />
                                </div>
                            ))}
                        </div>
                    )}

                    {advisoryBoards.length > 0 && (
                        <div className="w-full h-fit py-2 col-span-3">
                            <div className="w-full mb-10 text-center text-[48px] text-cinnamon font-serif">
                                Advisory Board
                            </div>
                            <Accordion className="w-full flex flex-col gap-2 my-2" type="multiple">
                                {advisoryBoards.map(({ board, people }) => (
                                    <AccordionItem
                                        key={board._id}
                                        value={board._id}
                                        className="w-full h-fit my-1"
                                    >
                                        <div className="w-full h-fit rounded-sm border border-dark-green bg-cream">
                                            <AccordionTrigger
                                                className="w-full h-fit py-2 flex items-center justify-center text-md font-bold rounded-none"
                                                icon={null}
                                            >
                                                <div className="w-fit h-fit text-dark-green font-serif text-[28px]">
                                                    {board.name}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="w-full h-fit py-4">
                                                <ul className="w-3/4 h-fit mx-auto">
                                                    {people.map(person => (
                                                        <li key={person._id} className="text-lg flex items-center gap-4">
                                                            <div className="w-1 h-1 bg-sage-green rounded-full" />
                                                            <div className="text-[25px]">{person.name}, {person.title}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </div>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    {(staff.length + ranchAndEquine.length) > 0 && (
                        <div className="col-span-3 h-fit flex flex-col items-center justify-center gap-1">
                            <div className="text-[48px] text-pewter font-serif">
                                Our Team
                            </div>
                            <div className="text-[24px]">
                                Interested in joining our team? Visit our Opportunities page.
                            </div>
                        </div>
                    )}

                    {staff.length > 0 && (
                        <div className="w-full h-fit col-span-3 grid grid-cols-subgrid">
                            <div className="relative mb-8 h-fit col-span-3">
                                <div className="text-[48px] text-pewter font-serif">
                                    Staff
                                </div>
                                <div className="relative top-[-12px] w-full h-1 border-t border-pewter" />
                            </div>

                            {staff.map((person) => (
                                <div key={person._id} className="col-span-1">
                                    <PersonCard key={person._id} person={person} />
                                </div>
                            ))}
                        </div>
                    )}

                    {ranchAndEquine.length > 0 && (
                        <div className="w-full h-fit col-span-3 grid grid-cols-subgrid">
                            <div className="relative mb-8 h-fit col-span-3">
                                <div className="text-[48px] text-pewter font-serif">
                                    Ranch & Equine
                                </div>
                                <div className="relative top-[-12px] w-full h-1 border-t border-pewter" />
                            </div>

                            {ranchAndEquine.map((person) => (
                                <div key={person._id} className="col-span-1">
                                    <PersonCard key={person._id} person={person} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {inMemoriam.length > 0 && (
                <div className="w-full h-fit py-12 px-8 flex flex-col items-center justify-center gap-8">
                    <div className="w-full mb-6 text-center text-[48px] text-pewter font-serif">
                        In Memoriam
                    </div>

                    <Carousel
                        className=""
                        items={inMemoriam.map((person) => ({
                            id: person._id,
                            widget: (
                                <div className="w-[75vw] h-[400px] flex items-stretch">
                                    <div className="w-1/4 h-full">
                                        {person.image && (
                                            <ConvexImage
                                                src={person.image.src}
                                                alt={person.image.alt}
                                                width={person.image.width}
                                                height={person.image.height}
                                                className="w-full h-full object-cover object-center bg-white"
                                            />
                                        )}
                                    </div>
                                    <div className="w-3/4 h-full bg-pewter text-seashell px-8 
                                        flex flex-col items-start justify-center gap-4">
                                        <div className="text-2xl font-serif">
                                            {person.name}
                                        </div>
                                        {/* <div className="text-xs uppercase">{person.title}</div> */}
                                        <p className="text-md">{person.bio}</p>
                                        <Button className="bg-cinnamon border-none py-1 px-4" color="cinnamon">
                                            Read More
                                        </Button>
                                    </div>
                                </div>
                            )
                        }))}
                        nDisplayItems={1}
                        autoPlay={"right"}
                        leftButton={<FaCaretLeft size={30} className="text-cinnamon" />}
                        rightButton={<FaCaretRight size={30} className="text-cinnamon" />}
                        transitionDuration={1500}
                        autoPlayInterval={8000}
                    />
                </div>
            )}
        </div >
    )
}

export default PeoplePage