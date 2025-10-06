"use client"

import Image, { StaticImageData } from "next/image"
import { range } from "@/lib/utils"
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

import PeopleHero from "./people-hero.png"
import LeoSquare from "./leo-square.jpg"
import Bill from "./bill-photo.png"
import Rob from "./rob-photo.png"


type Person = {
    name: string
    image: StaticImageData
    title: string
    shortBio: string
}

const boardOfDirectors: Person[] = range(1, 10).map(() => ({
    name: "Leo Ware",
    image: LeoSquare,
    title: "Software Engineer",
    shortBio: "Leo is a software engineer who is building this website.",
}))
const staff = boardOfDirectors

const inMemoriam = [
    {
        name: "William DeMayo",
        image: Bill,
        title: "Co-Founder",
        longBio: `
            Bill began his career as a field examiner for the IRS, retiring as partner of
            Ernst & Young. He then became a professor at the University of New Haven, CT,
            where he also served as Treasurer and a Planned Giving Officer. He was honored
            by numerous professional associations devoted to taxation, financial
            management, and estate planning.
        `
    },
    {
        name: "Rob Redford",
        image: Rob,
        title: "Board Member",
        longBio: `
            Robert Redford was an Academy Award-winning actor, director, and environmental 
            activist whose deep connection to the American West guided his passionate 
            advocacy for wild horses and public lands. He joined Return to Freedom's board 
            of directors in 2014, and his leadership and vision helped bring 
            national attention to wild horse conservation, leaving a lasting legacy in the 
            fight to protect these iconic symbols of American freedom.
        `
    }
]

const PersonCard = ({ person: { name, image, title, shortBio }, color }: { person: Person, color: string }) => {
    return (
        <div className="relative col-span-1 aspect-square">
            <FlipCard
                className="w-full h-full"
                frontContent={
                    <div className={`w-full h-full relative bg-${color}`}>
                        <Image src={image} alt="Leo Square" className="w-full h-full object-cover object-center" fill />
                        <div className={`absolute bottom-0 left-0 w-full h-10 bg-${color} text-white
                            flex items-center justify-center text-md font-bold`}>
                            {name}
                        </div>
                    </div>
                }
                backContent={
                    <div className={`w-full h-full relative bg-${color} p-4 flex flex-col items-start justify-end text-seashell`}>
                        <div className="text-md font-bold text-left">{name}</div>
                        <div className="text-xs uppercase text-left translate-x-[-1px]">{title}</div>
                        <div className="text-sm text-left">{shortBio}</div>
                    </div>
                }
            />
        </div>
    )
}

const PeoplePage = () => {
    return (
        <div className="w-full h-fit">
            <div className="w-full h-[400px] relative flex items-center justify-center bg-sage-green">
                <Image src={PeopleHero} alt="People Hero" className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center" fill />
                <div className="z-10 p-4 border-b border-white text-white text-4xl font-bold">
                    Our Team
                </div>
            </div>

            <div className="w-full h-fit py-12 px-4 bg-seashell flex flex-col items-center justify-center gap-8">
                <div className="text-3xl font-bold text-pewter">
                    Board of Directors
                </div>
                <div className="w-1/2 h-fit grid grid-cols-3 gap-4">
                    {boardOfDirectors.map((person) => (
                        <PersonCard person={person} color="cinnamon" />
                    ))}
                </div>
            </div>

            <div className="w-full h-fit py-12 px-4 bg-seashell flex flex-col items-center justify-center gap-8">
                <div className="text-3xl font-bold text-pewter">
                    Advisory Board
                </div>
                <Accordion className="w-1/2" type="multiple">
                    {["Policy Issues and Advocacy", "Legal", "Development"].map((title) => (
                        <AccordionItem
                            value={title}
                            className="bg-dark-green text-white w-full h-fit"
                        >
                            <AccordionTrigger className="w-full h-10 flex items-center justify-center text-md font-bold rounded-none">
                                {title}
                            </AccordionTrigger>
                            <AccordionContent className="w-full h-fit bg-dark-green text-white p-4">
                                <div className="w-full h-fit grid grid-cols-3 gap-4">
                                    {boardOfDirectors.map((person) => (
                                        <PersonCard person={person} color="burnt-orange" />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="w-full h-fit py-12 px-4 bg-seashell flex flex-col items-center justify-center gap-8">
                <div className="text-3xl font-bold text-burnt-orange">
                    Staff
                </div>
                <div className="w-1/2 h-fit grid grid-cols-3 gap-4">
                    {staff.map((person) => (
                        <PersonCard person={person} color="pewter" />
                    ))}
                </div>
            </div>

            <div className="w-full h-fit py-12 px-4 bg-seashell flex flex-col items-center justify-center gap-8">
                <div className="text-3xl font-bold text-pewter">
                    In Memoriam
                </div>

                <Carousel
                    className="w-5/6"
                    items={inMemoriam.map((person) => ({
                        id: person.name,
                        widget: (
                            <div className="w-[75vw] h-fit flex">
                                <div className="w-1/4 relative aspect-square bg-white">
                                    <Image
                                        src={person.image}
                                        alt={person.name}
                                        className="w-full h-full object-cover object-center"
                                        fill
                                    />
                                </div>
                                <div className="w-3/4 bg-pewter text-seashell px-8 flex flex-col items-start justify-center gap-2">
                                    <div className="text-lg font-bold">
                                        {person.name}
                                    </div>
                                    <div className="text-xs uppercase">{person.title}</div>
                                    <p className="text-xs">{person.longBio}</p>
                                    <Button color="burnt-orange">
                                        Read More
                                    </Button>
                                </div>
                            </div>
                        )
                    }))}
                    nDisplayItems={1}
                    autoPlay={"right"}
                    leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                    rightButton={<FaCaretRight size={30} className="text-pewter" />}
                    transitionDuration={1500}
                    autoPlayInterval={6000}
                />
            </div>
        </div >
    )
}

export default PeoplePage