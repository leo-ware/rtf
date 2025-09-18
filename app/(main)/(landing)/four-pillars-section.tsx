'use client'

import FlipCard from "@/components/FlipCard"
import Link from "next/link"
import Image from "next/image"

import jasperImage from "./jasper-square.jpg"
import galaxyImage from "./Galaxy-Feature.jpg"
import stellaLisaImage from "./Visit_stella-lisa.jpg"
import homiesGatheredImage from "./homies_gathered.jpg"

const FourPillarsSection = () => {
    return (
        <section className="py-16 bg-gray-50">
                <div className="max-w-7xl h-[300px] mx-auto px-4">
                    <div className="flex justify-center items-center">
                        <FlipCard
                            className="h-[250px] w-[250px]"
                            frontContent={
                                <div className="relative flex items-center justify-center">
                                    <Image src={jasperImage} alt="Jasper" className="w-[250px] h-[250px]" />
                                    <div className="text-2xl font-bold text-white absolute bottom-4 left-8">CONSERVATION</div>
                                </div>
                            }
                            backContent={
                                <div className="text-center p-4">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Wild Horse Conservation</h4>
                                    <p className="text-gray-600 mb-4">
                                        Return to Freedom is committed to conserving the unique bloodlines of the American Mustang.
                                    </p>
                                    <Link href="/about/conservation" className="text-blue-600 hover:text-blue-800 font-medium">
                                        More Info on Conservation
                                    </Link>
                                </div>
                            }
                        />

                        <FlipCard
                            className="h-[250px] w-[250px]"
                            frontContent={
                                <div className="relative flex items-center justify-center">
                                    <Image src={galaxyImage} alt="Galaxy" className="w-[250px] h-[250px]" />
                                    <div className="text-2xl font-bold text-white absolute bottom-4 left-8">SANCTUARY</div>
                                </div>
                            }
                            backContent={
                                <div className="text-center p-4">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Wild Horse and Burro Sanctuary</h4>
                                    <p className="text-gray-600 mb-4">
                                        The Return to Freedom sanctuary gives permanent safe haven to 400 wild horses and 29 burros.
                                    </p>
                                    <Link href="/about/sanctuary" className="text-blue-600 hover:text-blue-800 font-medium">
                                        More Info on our Sanctuary
                                    </Link>
                                </div>
                            }
                        />

                        <FlipCard
                            className="h-[250px] w-[250px]"
                            frontContent={
                                <div className="relative flex items-center justify-center">
                                    <Image src={stellaLisaImage} alt="stella lisa" className="w-[250px] h-[250px]" />
                                    <div className="text-2xl font-bold text-white absolute bottom-4 left-8">EDUCATION</div>
                                </div>
                            }
                            backContent={
                                <div className="text-center p-4">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Education</h4>
                                    <p className="text-gray-600 mb-4">
                                        We have developed long-established and effective programs for the general public and America&apos;s youth.
                                    </p>
                                    <Link href="/about/education" className="text-blue-600 hover:text-blue-800 font-medium">
                                        More Info on Education
                                    </Link>
                                </div>
                            }
                        />

                        <FlipCard
                            className="h-[250px] w-[250px]"
                            frontContent={
                                <div className="relative flex items-center justify-center">
                                    <Image
                                        className="w-[250px] h-[250px] object-cover"
                                        src={homiesGatheredImage}
                                        alt="Several horses gathered" />
                                    <div className="text-2xl font-bold text-white absolute bottom-4 left-8">ADVOCACY</div>
                                </div>
                            }
                            backContent={
                                <div className="text-center p-4">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Advocacy</h4>
                                    <p className="text-gray-600 mb-4">
                                        Return to Freedom&apos;s Initiatives for America&apos;s horses is rooted in inspiring others to take the initiative.
                                    </p>
                                    <Link href="/about/advocacy" className="text-blue-600 hover:text-blue-800 font-medium">
                                        More Info on Advocacy
                                    </Link>
                                </div>
                            }
                        />
                    </div>
                </div>
            </section>
    )
}

export default FourPillarsSection

