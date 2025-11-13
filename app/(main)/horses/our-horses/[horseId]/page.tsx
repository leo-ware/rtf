import Image from "next/image"
import NewsCarousel from "@/components/NewsCarousel"
import Header from "@/components/public-ui/Header"
import Carousel from "@/components/Carousel"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import CardLayout from "@/components/public-ui/CardLayout"
import Button from "@/components/public-ui/Button"

import ExampleHorse from "./example-horse-image.png"
import Gallery1 from "./gallery-1.png"
import Gallery2 from "./gallery-2.png"
import MingoImage from "./mingo.png"
import Ruby from "./ruby.png"
import LittleMan from "./little-man.png"


const IndividualHorsePage = () => {
    return (
        <div className="w-full h-fit my-16 flex flex-col items-center justify-start gap-16">
            <div className="w-10/12 flex flex-col items-center justify-center gap-8">
                <div className="w-full h-fit flex gap-8 items-center justify-center">
                    <div className="relative w-1/2 h-[300px]">
                        <Image
                            src={ExampleHorse}
                            alt="Example Horse"
                            className="w-full h-full object-cover object-center"
                            fill
                        />
                    </div>
                    <div className="w-1/2">
                        <div className="text-3xl font-serif text-pewter">
                            Windrider's Runner
                        </div>
                        <div className="text-lg text-left text-gray-500 uppercase font-semibold">
                            male | 27 years old | CHOCTAW | lompoc sanctuary
                        </div>
                        <div className="text-lg text-left">
                            Windrider's Runner, known as simply Runner at the sanctuary, is a
                            gorgeous black and white pinto stallion from our Choctaw herd. He
                            got his name because, well, he's a runner! Runner loves galloping
                            throughout the tall grass of our Lompoc, Calif. sanctuary. He's a
                            natural leader among his herd. Tall and confident, Runner has a very
                            commanding personality.
                        </div>
                    </div>
                </div>

                <div>
                    The Choctaw horses are Spanish horses that remain from the early colonial efforts of the Spaniards in North America. These horses arrived with Hernando DeSoto in the 1500’s and by the 1800’s they had been completely integrated into some of the tribal cultures in the Southeast. In the 1830s, these small horses carried the old and infirmed on the tragic “Trails of Tears”, beginning with the Choctaws forced march from Mississippi to Oklahoma.
                </div>
                <div>
                    The horses continued to face persecution after arriving in Oklahoma as a result of a “tick eradication program” conducted by the U.S. Government. The horses who survived were those who escaped into the wooded mountains of Oklahoma.
                    These horses are important as a genetic resource because they have become rare, containing unique color genetics and are one of the oldest strains of horses in North America today. These horses have been pivotal in the conservation of Colonial Spanish horses in North America.
                </div>
                <div>
                    In 2005, RTF collaborated with screenwriter John Fusco to launch the Choctaw Horse Conservation Program. Dr. Phillip Sponenberg of the Virginia-Maryland College of Veterinary Medicine, who considers this a genetic rescue effort, chose a band of seven mares from Blackjack Mountain to join a varnished grey roan tobiano stallion, Chief Iktinike, to form a foundation group to send to Fusco’s Red Road Farm in Vermont.
                </div>
                <div>
                    The horses, with their more recent roots in Blackjack Mountain, Oklahoma, went to live at Red Road Farm in Vermont and, in 2008, Chief Iktinike and seven mares arrived at Return to Freedom in Central California.
                </div>
            </div>

            <NewsCarousel
                title="Latest News"
                bgColor="seashell"
            />

            <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-4">
                <Header color="sage-green" className="text-4xl">
                    Gallery
                </Header>
                <Carousel
                    nDisplayItems={1}
                    autoPlay={"right"}
                    transitionDuration={1500}
                    autoPlayInterval={6000}
                    leftButton={<FaCaretLeft size={30} className="text-pewter" />}
                    rightButton={<FaCaretRight size={30} className="text-pewter" />}
                    items={[Gallery1, Gallery2].map((image, index) => ({
                        id: `gallery-item-${index}`,
                        widget: (
                            <div key={index} className="relative w-full aspect-[16/9]">
                                <Image
                                    src={image}
                                    alt="Gallery"
                                    className="w-full h-full object-cover object-center"
                                    fill />
                            </div>
                        )
                    }))}
                />
            </div>

            <div className="w-10/12 mx-auto h-fit flex flex-col items-center justify-center gap-8">
                <Header color="cinnamon" className="text-4xl text-center">
                    Explore Other Horses to Sponsor
                </Header>
                <CardLayout className="gap-6">
                    {[
                        {
                            name: "Mingo",
                            image: MingoImage,
                            subtitle: "Female | 27 years old | Sulphur springs",
                            description: `
                                A sorrel mare with a white star and strip unique tuft on his forehead. A 
                                sorrel mare with a white star and strip unique tuft on his forehead. A 
                                sorrel mare with a white star and strip unique tuft on his forehead
                            `
                        },
                        {
                            name: "Ruby",
                            image: Ruby,
                            subtitle: "Female | 27 years old | Sulphur springs",
                            description: `
                                A sorrel mare with a white star and strip unique tuft on his forehead. 
                                A sorrel mare with a white star and strip unique tuft on his forehead. 
                                A sorrel mare with a white star and strip unique tuft on his forehead
                            `
                        },
                        {
                            name: "Little Man",
                            image: LittleMan,
                            subtitle: "Female | 27 years old | Sulphur springs",
                            description: `
                                A sorrel mare with a white star and strip unique tuft on his forehead. A 
                                sorrel mare with a white star and strip unique tuft on his forehead. A 
                                sorrel mare with a white star and strip unique tuft on his forehead
                            `
                        },
                    ].map((horse) => (
                        <div className="bg-seashell">
                            <div className="relative w-full aspect-[4/3]">
                                <Image
                                    src={horse.image}
                                    alt={horse.name}
                                    className="w-full h-full object-cover object-center"
                                    fill
                                />
                            </div>
                            <div className="w-full h-fit p-6 text-center flex flex-col items-center justify-center gap-2">
                                <div className="text-2xl font-serif text-pewter">{horse.name}</div>
                                <div className="text-lg">{horse.description}</div>
                                <div className="text-sm text-left uppercase font-semibold text-gray-500">
                                    {horse.subtitle}
                                </div>
                                <div className="mt-2 w-full flex items-center justify-center gap-4">
                                    <Button color="sage-green" className="py-1 px-4">
                                        Read More
                                    </Button>
                                    <Button color="cinnamon" className="py-1 px-4">
                                        Sponsor
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardLayout>
                <div className="w-full flex items-center justify-center">
                    <Button color="cinnamon" className="py-1 px-4">
                        Sponsor a Horse
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default IndividualHorsePage