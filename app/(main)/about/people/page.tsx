"use client"

// Image import removed — using ConvexImage/ImageWithAuthorCredit instead
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
        .sort((a, b) => (a.board.order ?? Infinity) - (b.board.order ?? Infinity))

    return (
        <div className="w-full h-fit">
            <Hero title="Our Team" image={PeopleHero} />

            {people.length > 0 && (
                <div className="w-10/12 h-fit py-16 mx-auto flex flex-col gap-18">
                    {boardOfDirectors.length > 0 && (
                        <div className="w-full h-fit">
                            <Header className="text-pewter mb-8">
                                Board of Directors
                            </Header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-18">
                                {boardOfDirectors.map((person) => (
                                    <div key={person._id} className="mb-4">
                                        <PersonCard key={person._id} person={person} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {advisoryBoards.length > 0 && (
                        <div className="w-full h-fit py-2">
                            <Header className="text-cinnamon mb-8">
                                Advisory Boards
                            </Header>
                            <Accordion className="w-full flex flex-col gap-2 my-2" type="multiple">
                                {advisoryBoards.map(({ board, people }) => (
                                    <AccordionItem
                                        key={board._id}
                                        value={board._id}
                                        className="w-full h-fit my-1 border-b-0"
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
                                                    {people
                                                        .map(person => {
                                                            const boardWithOrder = person.boards.find(b => b._id === board._id)
                                                            return { ...person, pabOrder: boardWithOrder?.pabOrder ?? Infinity }
                                                        })
                                                        .sort((a, b) => a.pabOrder - b.pabOrder)
                                                        .map(person => (
                                                        <li key={person._id} className="text-lg flex items-center gap-4">
                                                            <div className="w-1 h-1 bg-sage-green rounded-full" />
                                                            <div className="text-[25px]">{person.name}{person.title ? `, ${person.title}` : ""}</div>
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
                        <div className="h-fit flex flex-col items-center justify-center gap-1">
                            <Header className="text-pewter no-underline mb-6">
                                Our Team
                            </Header>
                            <div className="text-[24px]">
                                Interested in joining our team? Visit our <Link href="/about/people/opportunities" className="text-cinnamon underline">Opportunities</Link> page.
                            </div>
                        </div>
                    )}

                    {staff.length > 0 && (
                        <div className="w-full h-fit">
                            <div className="relative mb-8 h-fit">
                                <div className="text-[48px] text-pewter font-serif">
                                    Staff
                                </div>
                                <div className="relative top-[-12px] w-full h-1 border-t border-pewter" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-18">
                                {staff.map((person) => (
                                    <div key={person._id}>
                                        <PersonCard key={person._id} person={person} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {ranchAndEquine.length > 0 && (
                        <div className="w-full h-fit">
                            <div className="relative mb-8 h-fit">
                                <div className="text-[48px] text-pewter font-serif">
                                    Ranch & Equine
                                </div>
                                <div className="relative top-[-12px] w-full h-1 border-t border-pewter" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-18">
                                {ranchAndEquine.map((person) => (
                                    <div key={person._id}>
                                        <PersonCard key={person._id} person={person} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {inMemoriam.length > 0 && (
                <div className="w-full h-fit py-12 px-4 md:px-8 flex flex-col items-center justify-center gap-8">
                    <div className="w-full mb-4 text-center text-[48px] text-pewter font-serif">
                        In Memoriam
                    </div>

                    <Carousel
                        className=""
                        items={inMemoriam.map((person) => ({
                            id: person._id,
                            widget: (
                                <div className="w-[92vw] md:w-[85vw] lg:w-[75vw] flex flex-col md:flex-row md:items-stretch rounded-lg overflow-hidden">
                                    <div className="w-full aspect-square md:w-[400px] md:aspect-square shrink-0">
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
                                    <div className="w-full md:w-auto md:grow bg-pewter text-seashell px-6 py-8 md:px-8
                                        flex flex-col items-start justify-center gap-4">
                                        <div className="text-[32px] md:text-[40px] font-serif">
                                            {person.name}
                                        </div>
                                        {/* <div className="text-xs uppercase">{person.title}</div> */}
                                        <p className="text-[18px] md:text-[20px] line-clamp-4">{person.bio ?? ""}</p>
                                        {person.link && (
                                            person.link.startsWith("/") ? (
                                                <Link href={person.link}>
                                                    <Button className="bg-cinnamon border-none py-1 px-4" color="cinnamon">
                                                        Read More
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <a href={person.link} target="_blank" rel="noopener noreferrer">
                                                    <Button className="bg-cinnamon border-none py-1 px-4" color="cinnamon">
                                                        Read More
                                                    </Button>
                                                </a>
                                            )
                                        )}
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