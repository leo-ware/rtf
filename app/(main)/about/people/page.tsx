"use client"

import Image from "next/image"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Button from "@/components/public-ui/Button"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { PersonCard } from "./PersonCard"
import PeopleHero from "./people-hero.png"
import ConvexImage from "@/components/images/ConvexImage";
import { dedupArray, indexArrayUnique, multipleIndexArray } from "@/lib/utils";
import Link from "next/link";
import Hero from "@/components/public-ui/Hero";
import Header from "@/components/public-ui/Header";

const PeoplePage = () => {
    const peopleRaw = useQuery(api.people.listPeople, { limit: 500 });
    const people = dedupArray((peopleRaw || []).map(person => {
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
    }), person => person._id);


    const peopleAlive = people.filter(person => !person.inMemoriam)
    const boardOfDirectors = peopleAlive
        .filter(person => person.isDirector)
        .sort((a, b) => (a.directorOrder ?? Infinity) - (b.directorOrder ?? Infinity));
    const staff = peopleAlive
        .filter(person => person.isStaff)
        .sort((a, b) => (a.staffOrder ?? Infinity) - (b.staffOrder ?? Infinity));
    
    const ranchAndEquine = peopleAlive
        .filter(person => person.isEquine)
        .sort((a, b) => (a.equineOrder ?? Infinity) - (b.equineOrder ?? Infinity))
    
    const inMemoriam = dedupArray(people
        .filter(person => person.inMemoriam)
        .sort((a, b) => (a.inMemoriamOrder ?? Infinity) - (b.inMemoriamOrder ?? Infinity))
    , person => person._id);

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
        <div className="w-full h-fit">
            <Hero title="Our Team" image={PeopleHero} />

            {people.length > 0 && (
                <div className="w-10/12 h-fit py-16 mx-auto grid grid-cols-3 gap-18">
                    {boardOfDirectors.length > 0 && (
                        <div className="w-full h-fit col-span-3 grid grid-cols-subgrid">
                            <Header className="text-pewter col-span-3 mb-8">
                                Board of Directors
                            </Header>

                            {boardOfDirectors.map((person) => (
                                <div key={person._id} className="col-span-1">
                                    <PersonCard key={person._id} person={person} />
                                </div>
                            ))}
                        </div>
                    )}

                    {advisoryBoards.length > 0 && (
                        <div className="w-full h-fit py-2 col-span-3">
                            <Header className="text-cinnamon mb-8">
                                Advisory Boards
                            </Header>
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
                            <Header className="text-pewter no-underline mb-6">
                                Our Team
                            </Header>
                            <div className="text-[24px]">
                                Interested in joining our team? Visit our <Link href="/about/people/opportunities" className="text-cinnamon underline">Opportunities</Link> page.
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
                    <div className="w-full mb-4 text-center text-[48px] text-pewter font-serif">
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
                                        <div className="text-[40px] font-serif">
                                            {person.name}
                                        </div>
                                        {/* <div className="text-xs uppercase">{person.title}</div> */}
                                        <p className="text-[20px]">{person.bio}</p>
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