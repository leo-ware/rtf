"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import ConvexImage from "@/components/images/ConvexImage"
import { ArticleRenderer } from "@/components/ArticleRenderer"
import Link from "next/link"

import HeroImg from "./adopt-a-horse-hero.jpg"

const AdoptableAnimalCard = ({ animal }: { animal: any }) => {
    const galleryItemsRaw = useQuery(api.animals.getAnimalGalleryItems, {
        ids: [animal._id] as Id<"animals">[],
    })
    const galleryItems = galleryItemsRaw?.[0]?.items || []
    const firstGalleryImage = galleryItems.find(
        (item: any) => item?.type === "image" && item?.image?.url
    )

    return (
        <div className="w-full px-8 flex justify-between items-start gap-8">
            <div className="w-1/3 flex flex-col gap-2 py-2">
                {animal.image?.url && (
                    <ConvexImage
                        src={animal.image.url}
                        alt={animal.name}
                        width={animal.image.width || 400}
                        height={animal.image.height || 400}
                        className="w-full h-[300px] object-cover object-center rounded-xl overflow-hidden"
                    />
                )}
                {firstGalleryImage?.image?.url && (
                    <ConvexImage
                        src={firstGalleryImage.image.url}
                        alt={firstGalleryImage.image.altText ?? animal.name}
                        width={firstGalleryImage.image.width || 400}
                        height={firstGalleryImage.image.height || 400}
                        className="w-full h-[300px] object-cover object-center rounded-xl overflow-hidden"
                    />
                )}
            </div>
            <div className="w-2/3 flex flex-col gap-2">
                <Link href={`/horses/our-horses/${animal.slug}`}>
                    <div className="text-sage-green text-left text-[48px] font-serif hover:underline">
                        {animal.name}
                    </div>
                </Link>
                <div className="flex gap-8 items-center uppercase font-semibold text-sm">
                    {animal.gender && <div>{animal.gender}</div>}
                    {animal.dob && (
                        <div>Born: {new Date(animal.dob).getFullYear()}</div>
                    )}
                    {animal.adoptionFee && (
                        <div>Adoption fee: {animal.adoptionFee}</div>
                    )}
                </div>
                <div className="flex flex-col items-start justify-start gap-4 text-left">
                    {animal.content ? (
                        <ArticleRenderer
                            content={animal.content}
                            className="prose prose-stone max-w-none"
                        />
                    ) : (
                        <p>{animal.description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const AdoptAHorsePage = () => {
    const adoptableAnimals = useQuery(api.animals.getAdoptableAnimals)

    return (
        <div className="w-full h-fit mb-12 flex flex-col items-center justify-start gap-16 text-center">
            <Hero title="Adopt a Horse" image={HeroImg} />

            <div className="w-full h-fit flex flex-col items-center justify-center gap-8">
                <Header className="w-6/12 text-pewter">
                    Give a Rescued Wild Horse or a Wild Burro a Forever Home.
                </Header>

                <div className="w-8/12 flex flex-col items-start justify-start gap-4 text-left">
                    <p>
                        Return to Freedom has specific adoption criteria to ensure that the horse(s)
                        and/or burro(s) are placed in suitable environments. Due to limited resources
                        and the constant need for displaced wild or special needs horses and burros
                        to find sanctuary, we may occasionally have horses or burros available for
                        adoption, specifically those who will benefit from having more attention in
                        a private home. Over the past 24 years, RTF has successfully collaborated
                        with individuals, other organizations, state & federal agencies to find homes
                        for wild horses and burros in need.
                    </p>
                    <p>
                        Please understand that as a horse progresses in their education, their adoption
                        fee may increase to help recover just some of the organization&apos;s resources.
                    </p>
                    <p>
                        We have a diverse group of mustangs available for the right forever home. The
                        BLM horses will be larger boned and somewhat taller while the Spanish mustang
                        strains will be smaller. There are quite a few Brislawn Spanish mustangs that
                        were taken in by RTF when the Cayuse Ranch in Oshoto, WY closed its doors and
                        sold the ranch. The Brislawn family started the Spanish Mustang Registry and
                        raised these historic horses, who descended from horses brought from Spain
                        during the early conquest of the Americas, for many years. Considered some of
                        the finest horses in the known world at the time of the conquest, these horses
                        became prized by indigenous people for their beauty and toughness.
                    </p>
                    <p>
                        Please review our Terms and Conditions. If they are acceptable to you, fill out
                        an Application and send it to us, along with the signed Terms and Conditions.
                        Email applications to adopt@returntofreedom.org or mail to Return to Freedom,
                        P.O. Box 926, Lompoc, CA 93438.
                    </p>
                </div>
            </div>

            {adoptableAnimals === undefined && (
                <div className="w-8/12 flex justify-center py-12">
                    <div className="animate-pulse text-gray-400">Loading available animals...</div>
                </div>
            )}

            {adoptableAnimals && adoptableAnimals.length === 0 && (
                <div className="w-8/12 h-fit flex flex-col gap-4 py-8">
                    <div className="text-pewter text-[28px] font-serif">
                        No animals are currently available for adoption.
                    </div>
                    <p className="text-gray-600">
                        Please check back soon, or contact us at adopt@returntofreedom.org
                        to learn about upcoming adoption opportunities.
                    </p>
                </div>
            )}

            {adoptableAnimals && adoptableAnimals.length > 0 && (
                <div className="w-8/12 h-fit flex flex-col gap-12">
                    <div className="w-full border-b-1 border-cinnamon text-left text-cinnamon text-[48px] font-serif">
                        Horses & Burros Available for Adoption
                    </div>

                    {adoptableAnimals.map((animal) => (
                        <AdoptableAnimalCard key={animal._id} animal={animal} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdoptAHorsePage
