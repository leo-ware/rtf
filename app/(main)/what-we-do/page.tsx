import Image from "next/image"
import Button from "@/components/Button"

import HeroImage from "./what-we-do-hero.png"
import ConservationImage from "./conservation-image.png"
import AdvocacyImage from "./advocacy-image.png"
import SanctuaryImage from "./sanctuary-image.png"
import EducationImage from "./education-image.png"
import Link from "next/link"


const WhatWeDoPage = () => {
    return (
        <div className="w-full h-fit pb-8">
            <div className="w-full h-[400px] relative flex items-center justify-center bg-sage-green">
                <Image
                    src={HeroImage}
                    alt="What We Do Hero"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
                    fill />
                <div className="z-10 p-4 border-b border-white text-white text-4xl font-bold">
                    What We Do
                </div>
            </div>

            <div className="w-full h-fit pt-12 pb-4 flex flex-col items-center justify-center gap-4">
                <p className="max-w-11/12 md:max-w-1/2 md:text-center">
                    something something something about what RTF does something something something
                    about what RTF does something something something about what RTF does something
                    something something about what RTF does something something something about
                    what RTF does something something something about what RTF does something something
                    something about what RTF does something something something about what RTF
                    does something something something about what RTF
                </p>
            </div>

            <div className="w-full md:w-3/4 md:h-[400px] py-8 md:py-12
                    flex flex-col items-center justify-center gap-8 mx-auto
                    md:flex-row-reverse"
            >
                <div className="w-full h-[300px] md:w-1/2 md:h-full relative bg-gray-400">
                    <Image
                        src={SanctuaryImage}
                        alt="Sanctuary"
                        className="w-full h-[300px] md:w-full md:h-auto object-cover"
                        fill
                    />
                </div>

                <div className="w-11/12 h-1/2 md:h-full md:w-1/2
                    flex flex-col items-start justify-center gap-2">
                    <div className="text-3xl font-bold text-pewter">
                        Sanctuary
                    </div>
                    <div className="text-sm text-ink">
                        something something something about what RTF does something something something
                        about what RTF does something something something about what RTF
                        does something something something about what RTF
                    </div>
                    <Link href="/what-we-do/sanctuary" className="mt-2">
                        <Button className="px-6" color="sage-green">Learn More</Button>
                    </Link>
                </div>
            </div>

            <div className="w-full md:w-3/4 md:h-[400px] py-8 md:py-12
                    flex flex-col items-center justify-center gap-8 mx-auto
                    md:flex-row"
            >
                <div className="w-full h-[300px] md:w-1/2 md:h-full relative bg-gray-400">
                    <Image
                        src={ConservationImage}
                        alt="Conservation"
                        className="w-full h-[300px] md:w-full md:h-auto object-cover"
                        fill
                    />
                </div>

                <div className="w-11/12 h-1/2 md:h-full md:w-1/2
                    flex flex-col items-start justify-center gap-2">
                    <div className="text-3xl font-bold text-cinnamon">
                        Conservation
                    </div>
                    <div className="text-sm text-ink">
                        something something something about what RTF does something something something
                        about what RTF does something something something about what RTF
                        does something something something about what RTF
                    </div>
                    <Link href="/what-we-do/sanctuary" className="mt-2">
                        <Button className="px-6" color="sage-green">Learn More</Button>
                    </Link>
                </div>
            </div>

            <div className="w-full md:w-3/4 md:h-[400px] py-8 md:py-12
                    flex flex-col items-center justify-center gap-8 mx-auto
                    md:flex-row-reverse"
            >
                <div className="w-full h-[300px] md:w-1/2 md:h-full relative bg-gray-400">
                    <Image
                        src={EducationImage}
                        alt="Education"
                        className="w-full h-[300px] md:w-full md:h-auto object-cover"
                        fill
                    />
                </div>

                <div className="w-11/12 h-1/2 md:h-full md:w-1/2
                    flex flex-col items-start justify-center gap-2">
                    <div className="text-3xl font-bold text-mustard">
                        Education
                    </div>
                    <div className="text-sm text-ink">
                        something something something about what RTF does something something something
                        about what RTF does something something something about what RTF
                        does something something something about what RTF
                    </div>
                    <Link href="/what-we-do/sanctuary" className="mt-2">
                        <Button className="px-6" color="sage-green">Learn More</Button>
                    </Link>
                </div>
            </div>

            <div className="w-full md:w-3/4 md:h-[400px] py-8 md:py-12
                    flex flex-col items-center justify-center gap-8 mx-auto
                    md:flex-row"
            >
                <div className="w-full h-[300px] md:w-1/2 md:h-full relative bg-gray-400">
                    <Image
                        src={AdvocacyImage}
                        alt="Advocacy"
                        className="w-full h-[300px] md:w-full md:h-auto object-cover"
                        fill
                    />
                </div>

                <div className="w-11/12 h-1/2 md:h-full md:w-1/2
                    flex flex-col items-start justify-center gap-2">
                    <div className="text-3xl font-bold text-pewter">
                        Advocacy
                    </div>
                    <div className="text-sm text-ink">
                        something something something about what RTF does something something something
                        about what RTF does something something something about what RTF
                        does something something something about what RTF
                    </div>
                    <Link href="/what-we-do/sanctuary" className="mt-2">
                        <Button className="px-6" color="sage-green">Learn More</Button>
                    </Link>
                </div>
            </div>
            
        </div>
    )
}

export default WhatWeDoPage