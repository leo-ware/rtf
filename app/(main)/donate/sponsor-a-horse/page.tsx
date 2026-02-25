"use client"

import Hero from "@/components/public-ui/Hero"
import Button from "@/components/public-ui/Button"
import Callout from "@/components/public-ui/Callout"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import HeroImg from "./hero.jpg"
import SponsorAHorseMenu from "@/components/donation-widgets/SponsorAHorseMenu"
import Carousel from "@/components/Carousel"
import SponsorAHorseDialog from "@/components/donation-widgets/SponsorAHorseDialog"
import Link from "next/link"
import ConvexImage from "@/components/images/ConvexImage"
import { dedupArray, horseDetailsString } from "@/lib/utils"


const SponsorAHorsePage = () => {

    const promotedAnimal = useQuery(
        api.animals.getPromotedAnimalForSponsorship,
        { type: "horse" }
    )

    const galleryImages = dedupArray([
            promotedAnimal?.image,
            ...(promotedAnimal?.galleryImages || [])
        ].filter(image => !!image?.url),
        (image) => image!._id
    )

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

            <div className="w-full md:w-10/12 mx-auto h-fit">
                {promotedAnimal && (
                    <div className="w-full h-fit flex flex-col items-center justify-center gap-4">
                        <div className="text-4xl font-serif text-cinnamon px-4">
                            {promotedAnimal.name}
                        </div>
                        <div className="w-full flex md:hidden items-center justify-center gap-4">
                            {promotedAnimal.image?.url && (
                                <div className="relative w-[700px] h-[400px]">
                                    <ConvexImage
                                        src={promotedAnimal.image.url!}
                                        alt={promotedAnimal.image.altText || promotedAnimal.name}
                                        width={promotedAnimal.image.width || 400}
                                        height={promotedAnimal.image.height || 300}
                                        className="w-full h-full object-cover object-center"
                                        authorCredit={promotedAnimal.image.authorCredit}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="w-full hidden md:flex items-center justify-center gap-4 px-4">
                            {galleryImages.length === 1 && (
                                <div className="relative w-[700px] h-[400px]">
                                    <ConvexImage
                                        src={galleryImages[0]!.url!}
                                        alt={galleryImages[0]!.altText || promotedAnimal.name}
                                        width={galleryImages[0]!.width || 400}
                                        height={galleryImages[0]!.height || 300}
                                        className="w-full h-full object-cover object-center"
                                        authorCredit={"authorCredit" in galleryImages[0]! ? galleryImages[0]!.authorCredit : undefined}
                                    />
                                </div>
                            )}

                            {galleryImages.length > 1 && (
                                <div className="w-full max-w-[700px] h-[400px]">
                                    <Carousel
                                        nDisplayItems={1}
                                        autoPlay={false}
                                        transitionDuration={1000}
                                        items={galleryImages.map((image) => ({
                                            id: image!._id,
                                            widget: (
                                                <div className="relative w-[700px] h-[400px]">
                                                    <ConvexImage
                                                        src={image!.url!}
                                                        alt={image!.altText || promotedAnimal.name}
                                                        width={image!.width || 400}
                                                        height={image!.height || 300}
                                                        className="w-full h-full object-cover object-center"
                                                        authorCredit={"authorCredit" in image! ? image!.authorCredit : undefined}
                                                    />
                                                </div>
                                            )
                                        }))}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="text-lg text-left uppercase font-semibold text-gray-500 px-4">
                            {horseDetailsString(promotedAnimal as any)}
                        </div>
                        <div className="text-center text-lg text-gray-500 px-4">
                            {promotedAnimal.description}
                        </div>

                        <div className="w-full flex items-center justify-center gap-4 px-4">
                            <Link href={`/horses/our-horses/${promotedAnimal.slug}`}>
                                <Button color="sage-green" className="py-1 px-4">
                                    Read More
                                </Button>
                            </Link>
                            <SponsorAHorseDialog animalId={promotedAnimal._id}>
                                <Button color="cinnamon" className="py-1 px-4">
                                    Sponsor
                                </Button>
                            </SponsorAHorseDialog>
                        </div>
                    </div>
                )}
            </div>

            <SponsorAHorseMenu title="Explore Other Horses to Sponsor" type="horse" includeInMemoriam />

        </div>
    )
}

export default SponsorAHorsePage;