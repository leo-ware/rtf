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

            <div className="w-full h-fit py-16 flex items-center justify-center gap-8">
                <div className="max-w-[230px] flex flex-col items-end justify-center gap-2">
                    <div className="text-right text-burnt-orange text-3xl font-bold">
                        About Return <br /> to Freedom
                    </div>

                    <p className="text-ink text-sm text-right">
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

                <div className="h-auto w-5/12">
                    <Vimeo videoId="160682894" />
                </div>
            </div>

            <div className="w-full h-fit py-16 flex flex-col items-center justify-center gap-8">
                <div className="w-full flex flex-col items-center justify-center gap-2">
                    <div className="text-pewter text-3xl font-bold">What We Do</div>
                    <div className="max-w-1/2 text-center text-ink text-sm">
                        Return to Freedom is dedicated to preserving the freedom, diversity, and
                        habitat of America’s wild horses and burros through sanctuary, education,
                        advocacy, and conservation, while enriching the human spirit through direct
                        experience with the natural world.
                    </div>
                </div>

                <div className="w-full flex items-center justify-center">
                    <div className="w-11/12 h-[500px] flex stretch">
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
                            <div className="relative group transition-all duration-500 flex-grow hover:flex-grow-2 basis-0
                            h-full bg-pewter flex flex-col items-center justify-center gap-2">
                                <Image src={image} alt={title + " image"} className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center" />
                                <div className="z-10 relative flex flex-col items-center justify-center gap-2">
                                    <div className="grow basis-0" />
                                    <Link href={link} className="relative text-white text-2xl font-bold grow-0 basis-fit w-fit">
                                        {title}
                                        <div className="absolute bottom-0 left-[0px] right-[0px] duration-500
                                        h-0.5 bg-white scale-x-0 group-hover:scale-x-100
                                        transition-transform origin-left" />
                                    </Link>
                                    <div className="flex-grow basis-0 max-w-3/4">
                                        <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-0 group-hover:delay-300">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>

            <div className="relative w-full h-fit py-16 flex items-center justify-start px-24">
                <div className="z-0 absolute top-0 left-0 w-full h-full">
                    <Image
                        src={OminouseHorses}
                        alt="Ominous Horses"
                        className="w-full h-full object-cover object-center"
                    />
                    <div
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
                <div className="z-10 flex flex-col items-start justify-center gap-4 my-16">
                    <div className="text-white text-4xl font-bold border-b border-white py-4 text-left">
                        Why do we need to<br />
                        protect wild horses?
                    </div>
                    <p className="text-white text-sm mb-10">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <Button color="burnt-orange px-4">READ MORE</Button>
                </div>
            </div>

            <div className="relative w-full h-fit py-16 flex items-center justify-end px-24">
                <div className="z-0 absolute top-0 left-0 w-full h-full overflow-hidden">
                    <Image
                        src={SpiritImage}
                        alt="Spirit"
                        className="z-0 absolute top-[-155px] left-0 w-full h-auto object-cover object-top" />
                    <div
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
                <div className="z-10 flex flex-col items-start justify-center gap-4 my-16">
                    <div className="text-white text-4xl font-bold py-4 text-left text-right">
                        Spirit:<br />
                        Stallion of the<br />
                        Cimarron
                    </div>
                    <Button color="burnt-orange px-4">READ MORE about Spirit</Button>
                </div>
            </div>

            <div className="w-full h-[400px]" />

        </div>
    )
}

export default HomePage