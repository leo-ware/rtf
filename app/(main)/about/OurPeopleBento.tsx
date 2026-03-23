"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import Link from "next/link"
import Button from "@/components/public-ui/Button"
import ScrollReveal from "@/components/public-ui/ScrollReveal"

const ROLE_PRIORITY = ["isDirector", "isStaff", "isEquine", "isStoryTeller", "isAmbassador"] as const

const OurPeopleBento = () => {
    const people = useQuery(api.people.listPeople, {})

    if (!people) return null

    const withImages = people
        .filter(p => p.image?.imageUrl && !p.inMemoriam)
        .sort((a, b) => {
            const aIdx = ROLE_PRIORITY.findIndex(role => a[role])
            const bIdx = ROLE_PRIORITY.findIndex(role => b[role])
            return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx)
        })
        .slice(0, 8)

    const imageCell = (person: typeof withImages[number], idx: number, className: string) => (
        <ScrollReveal key={person._id} variant="scale" delay={idx * 0.08} className={className}>
            <div className="relative w-full h-full overflow-hidden rounded-sm group">
                <Image
                    src={person.image!.imageUrl!}
                    alt={person.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white text-sm font-medium">{person.name}</span>
                    {person.title && (
                        <span className="block text-white/80 text-xs">{person.title}</span>
                    )}
                </div>
            </div>
        </ScrollReveal>
    )

    const textBlock = (
        <div className="flex flex-col items-start justify-center gap-3 px-6 py-4">
            <div className="text-[36px] font-serif text-sage-green">
                Our Team
            </div>
            <div className="text-[16px] text-ink leading-relaxed">
                The people behind Return to Freedom bring together decades of experience
                in animal care, conservation, education, and advocacy. From daily sanctuary
                operations to national policy work, our team is united by a commitment to
                protecting wild horses and burros and the landscapes they depend on.
            </div>
            <Link href="/about/people">
                <Button color="cinnamon" className="py-1">
                    MEET THE TEAM
                </Button>
            </Link>
        </div>
    )

    // No images — just show text block
    if (withImages.length === 0) {
        return (
            <section className="w-full py-12 px-4">
                <div className="max-w-2xl mx-auto bg-seashell rounded-sm p-4">
                    <ScrollReveal variant="fade-in">
                        {textBlock}
                    </ScrollReveal>
                </div>
            </section>
        )
    }

    // Few images (1-3): simple row with text
    if (withImages.length < 4) {
        return (
            <section className="w-full py-12 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2 bg-seashell rounded-sm flex items-center">
                        <ScrollReveal variant="fade-in">
                            {textBlock}
                        </ScrollReveal>
                    </div>
                    <div className={`md:w-1/2 grid ${withImages.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1.5`}>
                        {withImages.map((person, i) =>
                            imageCell(person, i, "aspect-square")
                        )}
                    </div>
                </div>
            </section>
        )
    }

    // 4+ images: images on left, text on right
    const desktopImgs = withImages.slice(0, 6)
    const rowSpanClass = desktopImgs.length >= 5 ? "row-span-3" : "row-span-2"

    return (
        <section className="w-full py-12 px-4">
            {/* Mobile: text above + 2-col image grid */}
            <div className="md:hidden max-w-xl mx-auto flex flex-col gap-4">
                <ScrollReveal variant="fade-in">
                    {textBlock}
                </ScrollReveal>
                <div className="grid grid-cols-2 gap-1.5">
                    {desktopImgs.map((person, i) =>
                        imageCell(person, i, "aspect-square")
                    )}
                </div>
            </div>

            {/* Desktop: images left (cols 1-2), text right (col 3, row-spanning) */}
            <div className="hidden md:grid max-w-5xl mx-auto grid-cols-3 auto-rows-[200px] gap-2">
                {imageCell(desktopImgs[0], 0, "")}
                {imageCell(desktopImgs[1], 1, "")}
                <ScrollReveal variant="fade-in" delay={0.15} className={`${rowSpanClass} bg-seashell rounded-sm flex items-center`}>
                    {textBlock}
                </ScrollReveal>
                {desktopImgs.slice(2).map((person, i) =>
                    imageCell(person, i + 2, "")
                )}
            </div>
        </section>
    )
}

export default OurPeopleBento
