import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import Image from "next/image"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"

import SpiritHero from "./spirit-hero.png"
import SpiritAnimated from "./spirit-animated.png"
import Img1 from "./img1.png"
import Img2 from "./img2.png"
import Img3 from "./img3.png"
import Img4 from "./img4.png"
import SpiritRunning from "./spirit-running.png"
import SpiritHeadshot from "./spirit-headshot.png"
import Button from "@/components/public-ui/Button"
import NewsCarousel from "@/components/NewsCarousel"

const SpiritPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <Hero title="Spirit" image={SpiritHero} />
            <Header className="w-10/12 md:w-8/12 lg:w-6/12 mx-auto">
                Meet Spirit, Muse and Model
                for 'Spirit: Stallion of the Cimarron'
            </Header>
            <div className="relative w-full h-[60vh]">
                <Image
                    src={SpiritAnimated}
                    alt="Spirit"
                    className="w-full h-[60vh] object-cover object-center"
                    fill
                />
            </div>
            <AlternatingPictureLayout
                items={[
                    {
                        description: `
                            Between a story on the page about a wild horse that would not be broken and the appearance 
                            onscreen of a galloping, animated hero who inspires dreams of freedom came a very real horse: 
                            Spirit, a Kiger mustang stallion that turns 30 years old this year. Spirit served as the 
                            artists' muse and model for DreamWorks Animation's Oscar-nominated 2002 film, “Spirit: 
                            Stallion of The Cimarron” a tale of adventure and friendship penned by screenwriter John 
                            Fusco and directed by Kelly Asbury and Lorna Cook.
                        `,
                        image: Img1,
                    },
                    {
                        description: `
                            To create their movie, the filmmakers needed to find a horse that embodied the 
                            characteristics of the iconic wild mustang. Spirit, then called Donner, was selected as 
                            a young colt born to a stallion and mare that had been captured by the Bureau of Land 
                            Management on the Kiger Herd Management Area in Oregon.
                            The filmmakers chose Spirit because of his beautiful conformation, wide-set eyes, and 
                            his thick, wavy and multi-colored mane and tail — a perfect example of genetically and 
                            historically rare 15th-century Spanish Barb horses. Animators observed him closely to 
                            create a horse character with accurate, realistic movements that could communicate 
                            without speaking.
                        `,
                        image: Img2,
                    },
                    {
                        description: `
                            Following the movie's completion, DreamWorks selected Return to Freedom's American Wild 
                            Horse Sanctuary as the perfect home for Spirit.
                            Since his arrival at RTF's Lompoc, Calif., headquarters in April 2003, he has drawn fans 
                            of the movie from all over the world, as well as a new generation of children who love 
                            the computer-animated spin-off series, "Spirit: Riding Free," which ran for eight seasons 
                            on Netflix, and the 2021 movie "Spirit: Untamed."
                        `,
                        image: Img3,
                    },
                    {
                        description: `
                            Spirit soaks up the attention he receives from visitors of all ages, whether during 
                            one-on-one interactions with children through the Make-A-Wish Foundation or showing off 
                            for larger tour groups.
                        `,
                        image: Img4,
                    },

                ]} />

            <div className="relative w-full h-[80vh]">
                <Image
                    src={SpiritRunning}
                    alt="Spirit Running"
                    className="w-full h-full object-cover object-center"
                    fill
                />
            </div>

            <div className="w-8/12 mx-auto text-center text-xl flex flex-col items-center justify-center gap-4">
                <div>
                    Like the animated film, Spirit the stallion continues to inspire many to learn about — and
                    advocate for — the thousands of nameless wild horses and burros whose survival on our public
                    lands remains in jeopardy.
                </div>
                <div>
                    For his role as an ambassador for mustangs, the EQUUS Foundation and the United States
                    Equestrian Federation inducted Spirit into the Horse Stars Hall of Fame in 2018.
                </div>
            </div>

            <div className="w-full h-[500px] flex bg-black">
                <div className="relative w-1/2 h-full">
                    <Image
                        src={SpiritHeadshot}
                        alt="Spirit Headshot"
                        className="w-full h-full object-cover object-center"
                        fill
                    />
                </div>

                <div className="w-1/2 h-full text-white text-left p-16 flex flex-col items-start justify-center gap-4">
                    <div className="text-4xl font-serif">
                        Donate to Spirit’s Legacy Fund
                    </div>
                    <div className="text-xl">
                        Lorem ipsum dolor sit amet consectetur. A euismod ipsum nec porttitor mi non et bibendum.
                        Sapien eleifend sed et consectetur neque duis mus consectetur. Et in ac cras pellentesque
                        viverra. A diam donec mi lacus aliquet. Lorem tortor nisl pulvinar etiam convallis libero
                        metus. Id vel urna gravida vel. Elit purus congue sollicitudin auctor volutpat iaculis
                        pellentesque ipsum posuere.
                    </div>
                    <Button color="cinnamon" className="mt-8">
                        Donate
                    </Button>
                </div>
            </div>

            <NewsCarousel
                title="Spirit News"
                bgColor="transparent"
            />

            <div className="w-full h-fit flex">
                <div className="w-1/2 aspect-[16/9]">
                    <iframe
                        className="w-full aspect-[16/9]"
                        src="https://www.youtube.com/embed/Oo9EbArcQ1c?si=6r6KR7I0x0F0PVGy"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen />
                </div>
                <div className="w-1/2 aspect-[16/9]">
                    <iframe
                        className="w-full aspect-[16/9]"
                        src="https://www.youtube.com/embed/Oo9EbArcQ1c?si=6r6KR7I0x0F0PVGy"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen />
                </div>
            </div>
        </div>
    )
}

export default SpiritPage