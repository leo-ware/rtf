import Image from "next/image"
import Link from "next/link"
import Button from "@/components/public-ui/Button"

import NewsCarousel from "../../../components/NewsCarousel"
import DocumentsWidget from "./DocumentsWidget"
import AboutHeroImg from "@/public/img/about_hero.jpg"
import NedaAndSpirit from "@/public/img/neda-and-spirit.jpg"

const AboutPage = () => {
    return (
        <div className="w-full h-fit">
            <div className="w-full h-[400px] relative flex items-center justify-center bg-sage-green">
                <Image
                    src={AboutHeroImg}
                    alt="About Hero"
                    className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
                    fill
                />
                <div className="z-10 p-4 border-b border-white text-white text-4xl font-bold">
                    About Us
                </div>
            </div>

            <div className="w-full h-fit py-12 px-4 flex flex-col items-center justify-center gap-4">
                <div className="max-w-11/12 md:max-w-1/2 text-center">
                    Return to Freedom is a 501(c)(3) nonprofit wild horse sanctuary founded in the
                    late 1990s by equine enthusiast Neda DeMayo. What began as a childhood dream
                    blossomed into a thriving sanctuary dedicated to preserving the freedom, diversity,
                    and natural habitats of America's wild horses and burros.
                </div>
                <Link href="/about/history" className="w-fit">
                    <Button color="pewter">OUR HISTORY</Button>
                </Link>
            </div>

            <div className="w-full h-fit py-4 px-4 flex flex-col items-center justify-center gap-12">
                <div className="bg-seashell max-w-11/12 md:max-w-7/12 px-8 md:px-16 py-8 rounded-md flex flex-col items-center justify-center gap-4">
                    <div className="text-3xl font-bold text-burnt-orange">Mission</div>
                    <div>
                        Return to Freedom is dedicated to preserving the freedom, diversity, and habitat
                        of America's wild horses and burros through sanctuary, education, advocacy, and
                        conservation, while enriching the human spirit through direct experience with
                        the natural world.
                    </div>
                </div>

                <div className="bg-seashell max-w-11/12 md:max-w-7/12 px-8 md:px-16 py-8 rounded-md flex flex-col items-center justify-center gap-4">
                    <div className="text-3xl font-bold text-burnt-orange">Vision</div>
                    <div>
                        Return to Freedom is poised to take our management model to the next level by creating
                        a first-of-its-kind Wild Horse and Burro Conservancy and Wilderness Preserve. This historical
                        Land Trust will ensure the conservation of disappearing pure in strain Spanish
                        mustangs, expand our management model as it can be applied on wild horse ranges, and be home
                        to natural family bands captured from federal lands.
                    </div>
                </div>
            </div>

            <div className="w-full h-fit py-12 flex flex-col items-center justify-center gap-4">
                <div className="max-w-11/12 md:max-w-1/2 md:h-[300px] h-fit bg-sage-green flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/2">
                        <Image src={NedaAndSpirit} alt="Neda and Spirit" className="w-full aspect-square md:h-full object-cover" />
                    </div>
                    <div className="md:w-1/2 p-6 flex flex-col items-start justify-center gap-2">
                        <div className="text-xl font-bold text-white">Our People</div>
                        <div className="text-white text-sm">
                            The RTF team is dedicated to preserving the freedom, diversity,
                            and habitat of America's wild horses and burros through sanctuary, education, advocacy,
                            and conservation, while enriching the human spirit through direct experience with the
                            natural world.
                        </div>
                        <Link href="/about/people">
                            <Button color="burnt-orange" className="py-1">MEET THE TEAM</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <NewsCarousel />

            <DocumentsWidget />

        </div>
    )
}

export default AboutPage