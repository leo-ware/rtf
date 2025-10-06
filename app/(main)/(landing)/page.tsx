import Button from "@/components/Button"
import VideoStandin from "./landing_hero_video_preview.png"
import Image from "next/image"
import Link from "next/link"
import Vimeo from "@/components/Vimeo"

import ConservationImage from "./some-mountain.png"
import AdvocacyImage from "./horses-in-hills.jpg"
import SanctuaryImage from "./california-prairie.jpg"
import EducationImage from "./rolling-hills.jpg"
import OminouseHorses from "./ominous-horses.jpg"
import SpiritImage from "./spirit-zooming.png"

const HomePage = () => {
    return (
        <div className="w-full">

            <div className="relative w-full h-[400px]">
                <Image src={VideoStandin} alt="Video Standin" className="z-0 absolute w-full h-full object-cover" />
                <div className="absolute top-16 z-10 w-full text-center text-white text-4xl font-bold">
                    Wild Horse Conservation
                </div>
            </div>

            <div className="w-full h-fit py-8 md:py-16 flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="max-w-11/12 md:max-w-[230px] flex flex-col items-start md:items-end justify-center gap-2">
                    <div className="md:text-right text-burnt-orange text-3xl font-bold">
                        About Return <br /> to Freedom
                    </div>

                    <p className="text-ink text-sm md:text-right">
                        Return to Freedom is dedicated to preserving the freedom,
                        diversity, and habitat of America’s wild horses and burros
                        through sanctuary, education, advocacy, and conservation,
                        while enriching the human spirit through direct experience
                        with the natural world.
                    </p>

                    <Link href="/about">
                        <Button color="pewter py-1">
                            ABOUT US
                        </Button>
                    </Link>
                </div>

                <div className="h-auto w-11/12 md:w-5/12">
                    <Vimeo videoId="160682894" />
                </div>
            </div>

            <div className="w-full h-fit md:py-16 flex flex-col items-center justify-center gap-8">
                <div className="w-11/12 md:w-full flex flex-col items-start md:items-center justify-center gap-2">
                    <div className="text-pewter text-3xl font-bold">What We Do</div>
                    <div className="md:max-w-1/2 md:text-center text-ink text-sm">
                        Return to Freedom is dedicated to preserving the freedom, diversity, and
                        habitat of America’s wild horses and burros through sanctuary, education,
                        advocacy, and conservation, while enriching the human spirit through direct
                        experience with the natural world.
                    </div>
                </div>

                <div className="w-full flex items-center justify-center">
                    <div className="md:w-11/12 h-[500px] flex stretch flex-wrap md:flex-nowrap">
                        {[
                            {
                                title: "Conservation",
                                image: ConservationImage,
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                link: "/"
                            },
                            {
                                title: "Advocacy",
                                image: AdvocacyImage,
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                link: "/advocacy"
                            },
                            {
                                title: "Sanctuary",
                                image: SanctuaryImage,
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                link: "/sanctuary"
                            },
                            {
                                title: "Education",
                                image: EducationImage,
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                link: "/education"
                            }
                        ].map(({ title, image, description, link }) => (
                            <>
                                <div className="hidden md:block
                                    relative group transition-all duration-500 flex-grow hover:flex-grow-2 basis-0
                                    h-full bg-pewter flex flex-col items-center justify-center gap-2">
                                    <Image
                                        src={image}
                                        alt={title + " image"}
                                        className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center" />
                                    <div className="z-10 h-full relative flex flex-col items-center justify-center gap-2">
                                        <div className="grow basis-0" />
                                        <Link
                                            href={link}
                                            className="relative text-white text-2xl font-bold grow-0 basis-fit w-fit">
                                            {title}
                                            <div className="absolute bottom-0 left-[0px] right-[0px] duration-500
                                                h-0.5 bg-white scale-x-0 group-hover:scale-x-100
                                                transition-transform origin-left" />
                                        </Link>
                                        <div className="flex-grow basis-0 max-w-3/4">
                                            <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity 
                                                duration-200 delay-0 group-hover:delay-300">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="block md:hidden relative w-1/2 aspect-square flex items-center justify-center">
                                    <Image
                                        src={image}
                                        alt={title + " image"}
                                        className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center" />
                                    <Link
                                        href={link}
                                        className="z-10 text-white text-2xl font-bold">
                                        {title}
                                    </Link>
                                </div>
                            </>
                        ))}

                    </div>
                </div>
            </div>

            <div className="relative w-full h-fit py-4 md:py-16 px:8 md:px-24
                flex items-end justify-end md:items-center md:justify-start">
                <div className="z-0 absolute top-0 left-0 w-full h-full">
                    <Image
                        src={OminouseHorses}
                        alt="Ominous Horses"
                        className="w-full h-full object-cover object-center"
                    />
                    <div
                        className="hidden md:block"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to right, #292D35 0%, transparent 50%)',
                            pointerEvents: 'none'
                        }}
                    />
                </div>
                <div className="z-10 flex flex-col items-start justify-center gap-4 mb-4 mt-48 md:my-16">
                    <div className="text-white text-3xl md:text-4xl font-bold border-b border-white py-4 text-left">
                        Why do we need to<br />
                        protect wild horses?
                    </div>
                    <p className="text-white text-sm md:mb-10 max-w-11/12">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <Button color="burnt-orange px-4">READ MORE</Button>
                </div>
            </div>

            <div className="relative w-full h-[400px] bg-red-500 md:h-fit md:py-16 py-4 flex items-end md:items-center justify-end px-4 md:px-24">
                <div className="z-0 absolute top-0 left-0 w-full h-full overflow-hidden">
                    <Image
                        src={SpiritImage}
                        alt="Spirit"
                        className="z-0 absolute top-0 md:top-[-155px] left-0 w-full md:h-auto h-[400px] object-cover object-top" />
                    <div
                        className="hidden md:block"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to left, #292D35 0%, transparent 50%)',
                            pointerEvents: 'none'
                        }}
                    />
                </div>
                <div className="z-10 flex flex-col items-end md:items-start justify-center gap-4 md:my-16">
                    <div className="text-white text-2xl md:text-4xl font-bold md:py-4 text-right">
                        Spirit: <br className="hidden md:block" />
                        Stallion of the <br className="hidden md:block" />
                        Cimarron
                    </div>
                    <Button color="burnt-orange px-4">READ MORE about Spirit</Button>
                </div>
            </div>

        </div>
    )
}

export default HomePage