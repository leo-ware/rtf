import Header from "@/components/public-ui/Header"
import Hero from "@/components/public-ui/Hero"
import CardLayout from "@/components/public-ui/CardLayout"
import Button from "@/components/public-ui/Button"
import Image from "next/image"
import Callout from "@/components/public-ui/Callout"

import HeroImg from "./hero.jpg"
import MingoImage from "./mingo.png"
import Ruby from "./ruby.png"
import LittleMan from "./little-man.png"
import Azure from "./azure.jpg"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"

const SponsorAHorsePage = () => {
    return (
        <div className="w-full h-fit mb-16 flex flex-col items-center justify-start gap-16">
            <Hero title="Sponsor a Horse" image={HeroImg} />
            <Callout>
                The majority of the horses who range free at the Return to Freedom Wild Horse Sanctuary are
                part of a herd or bachelor band. Some herds arrived together. Others formed after they arrived.
                Still others found new family members among horses already residing at the Sanctuary. But no
                matter how they formed, each herd is a closely-knit family or social group, with each member
                assuming specific duties and responsibilities, and all share a very deep bond.
            </Callout>

            <div className="w-10/12 mx-auto h-fit flex flex-col items-center justify-center gap-8">
                <div className="text-4xl font-serif text-cinnamon">
                    Azure
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                    <FaCaretLeft size={30} className="text-pewter" />
                    <div className="relative w-[700px] h-[400px]">
                        <Image
                            src={Azure}
                            alt="Azure"
                            className="w-full h-full object-cover object-center" />
                    </div>
                    <FaCaretRight size={30} className="text-pewter" />
                </div>
                <div className="text-lg text-left uppercase font-semibold text-gray-500">
                    Female | 27 years old | Sulphur springs
                </div>
                <div className="text-center text-lg text-gray-500">
                    These two beautiful mares have been together their entire lives and need to be 
                    adopted together. They have mostly enjoyed the pastured life with occasional 
                    trail riding. Both mares have lots of energy and do best when they have a routine 
                    and ridden at least a few days a week. Both are fun trail horses, and have 
                    wonderful gaits. Heather is pretty fancy and versatile. A sorrel mare with a white 
                    star and strip unique tuft on his forehead. A sorrel mare with a white star and 
                    strip unique tuft on his forehead. A sorrel mare with a white star and strip unique 
                    tuft on his forehead
                </div>

                <div className="w-full flex items-center justify-center gap-4">
                    <Button color="sage-green" className="py-1 px-4">Read More</Button>
                    <Button color="cinnamon" className="py-1 px-4">Sponsor</Button>
                </div>

            </div>

            <div className="w-10/12 mx-auto h-fit flex flex-col items-center justify-center gap-8">
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
            </div>
        </div>
    )
}

export default SponsorAHorsePage;