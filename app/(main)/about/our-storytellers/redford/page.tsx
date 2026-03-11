"use client"

import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import Callout from "@/components/public-ui/Callout"
import ScrollReveal from "@/components/public-ui/ScrollReveal"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import DonationCallout from "@/components/DonationCallout"

// Placeholder images — replace with actual Redford/RTF images
import HeroImg from "@/public/img/about_hero.jpg"
import NedaImg from "@/public/img/neda-and-spirit.jpg"
import MustangsPosterImg from "@/public/img/the-mustangs-poster-e1632512502880.jpg"
import HorsesImg from "@/public/img/ares-mares.jpg"
import OwyheeImg from "@/public/img/Owyhee-9925-scaled.jpg"
import BgBlurred from "@/public/img/footer-bg-blurred.png"
import GrazingImg from "@/public/img/grazing-brown-horses-e1721864397332.png"

const RedfordPage = () => {
    return (
        <div className="w-full h-fit">
            {/* 1. Hero */}
            <Hero title="Robert Redford" image={HeroImg} />

            {/* 2. Memorial heading + intro */}
            <div className="w-full h-fit py-16 px-4 flex flex-col items-center justify-center gap-12">
                <ScrollReveal variant="fade-up" className="w-10/12 mx-auto">
                    <Header level={1} color="pewter">
                        Remembering Robert Redford: An Irreplaceable Friend, RTF
                        Board Member
                    </Header>
                </ScrollReveal>

                <ScrollReveal variant="fade-up">
                    <Callout className="text-ink">
                        It was with great sadness that Return to Freedom learned
                        of the death of our friend and board member Robert
                        Redford on Sept. 19 in Sundance, Utah, at age 89.
                    </Callout>
                </ScrollReveal>
            </div>

            {/* 3. Neda DeMayo quote block */}
            <div className="w-full py-12 px-4 flex flex-col items-center">
                <ScrollReveal variant="fade-up" className="w-10/12 md:w-8/12">
                    <blockquote className="border-l-4 border-sage-green pl-6 py-4 font-serif text-[20px] md:text-[24px] text-ink italic leading-relaxed">
                        &ldquo; We are heartbroken. We have all lost an
                        irreplaceable artist, activist and environmentalist.
                        Robert Redford was an iconic and inspiring human being
                        forever interwoven with the beauty and majesty of the
                        West. I feel very grateful to have known him and to have
                        had his support. &rdquo;
                    </blockquote>
                    <p className="mt-4 text-[18px] text-pewter font-serif text-right">
                        — Neda DeMayo, RTF Founder &amp; President
                    </p>
                </ScrollReveal>

                <ScrollReveal
                    variant="fade-up"
                    className="w-10/12 md:w-8/12 mt-10"
                >
                    <div className="flex flex-col gap-6 text-[20px] text-ink">
                        <p>
                            Redford joined RTF&apos;s board of directors in
                            2014. Prior to that Redford had signed onto RTF
                            advocacy letters to Congress, allowing RTF to
                            leverage his name to help gain lawmakers&apos;
                            attention.
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* 4. Podcast / personal story section */}
            <div className="w-full py-12 px-4 flex flex-col items-center bg-seashell">
                <ScrollReveal variant="fade-up" className="w-10/12 md:w-8/12">
                    <div className="flex flex-col gap-6 text-[20px] text-ink">
                        <blockquote className="border-l-4 border-cinnamon pl-6 py-4 font-serif text-[20px] md:text-[24px] italic leading-relaxed">
                            &ldquo;He called me and just completely shocked me
                            It was just such an uplifting experience to actually
                            come into his orbit and really be welcomed and him
                            saying, &apos;Look, I want to help, I want to help
                            more.&apos;&rdquo;
                        </blockquote>
                        <p className="text-[16px] text-pewter font-serif italic text-right -mt-2">
                            — Neda DeMayo, on a podcast hosted by journalist and
                            animal activist Jill Rappaport
                        </p>
                        <p>
                            Early that year, he took part in a fundraiser for
                            RTF in Montecito, Calif., at which he passionately
                            described wild horses as a symbol of American
                            freedom and about fighting the horse slaughter
                            industry.
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* 5. Key contributions — AlternatingPictureLayout */}
            <div className="w-10/12 mx-auto py-16 flex flex-col items-center gap-16">
                <ScrollReveal variant="fade-up" className="w-10/12 mx-auto">
                    <Header level={2} color="sage-green">
                        Key Contributions to Wild Horse Advocacy
                    </Header>
                </ScrollReveal>

                <AlternatingPictureLayout
                    alternateTitleColors
                    imageMode="standardized"
                    items={[
                        {
                            title: "Foundation to Protect New Mexico Wildlife & Navajo Nation",
                            description: (
                                <div className="flex flex-col gap-4">
                                    <p>
                                        In May of 2014, an organization Redford
                                        co-founded with New Mexico Gov. Bill
                                        Richardson, the Foundation to Protect
                                        New Mexico Wildlife, reached an
                                        agreement with the Navajo Nation to
                                        develop a management program to humanely
                                        manage wild horses on the reservation as
                                        part of an effort to combat the opening
                                        of a proposed slaughterhouse in Roswell,
                                        N.M.
                                    </p>
                                    <p>
                                        RTF joined other regional and national
                                        animal-protection groups in crafting and
                                        building support for the management
                                        plan.
                                    </p>
                                </div>
                            ),
                            image: OwyheeImg,
                            imageAlt: "Wild horses on open range",
                        },
                        {
                            title: "Speaking Out Against Euthanasia (2016–2017)",
                            description: (
                                <div className="flex flex-col gap-4">
                                    <p>
                                        In 2016 and 2017, Redford spoke out as
                                        part of a successful effort by RTF and
                                        others to stop a push by special
                                        interests and lawmakers to euthanize
                                        tens of thousands of healthy wild horses
                                        and burros captured in government
                                        roundups.
                                    </p>
                                    <p className="italic font-serif">
                                        &ldquo;Americans have an unwavering bond
                                        with the descendants of the horses and
                                        burros that have helped build our
                                        country and shape our culture — a bond
                                        enshrined in The Wild Free Roaming
                                        Horses and Burros Act&hellip; After
                                        decades of investing millions of tax
                                        dollars for the protection of wild
                                        horses after their capture and removal
                                        from the range, destroying them would be
                                        the ultimate betrayal, especially when
                                        humane alternatives have long been
                                        available.&rdquo;
                                    </p>
                                </div>
                            ),
                            image: HorsesImg,
                            imageAlt: "Wild mustangs grazing",
                        },
                        {
                            title: '"The Mustang" Film (2019)',
                            description: (
                                <div className="flex flex-col gap-4">
                                    <p>
                                        Redford later executive produced{" "}
                                        <em>The Mustang</em>, a critically
                                        acclaimed 2019 film that told the story
                                        of a convict taking part in a wild horse
                                        training program. The promotional push
                                        for the film helped RTF tell the story
                                        of America&apos;s wild horses, and
                                        Redford appeared in a public service
                                        announcement about the plight of wild
                                        horses and about RTF&apos;s work.
                                    </p>
                                </div>
                            ),
                            image: NedaImg,
                            imageAlt: "Wild horse advocacy",
                        },
                        {
                            title: '"The Mustangs: America\'s Wild Horses" Documentary (2020)',
                            description: (
                                <div className="flex flex-col gap-4">
                                    <p>
                                        Redford also co-executive produced{" "}
                                        <em>
                                            The Mustangs: America&apos;s Wild
                                            Horses
                                        </em>
                                        . The 2020 documentary features the
                                        efforts of different groups to help wild
                                        horses in their own ways, including
                                        RTF&apos;s sanctuary.
                                    </p>
                                </div>
                            ),
                            image: MustangsPosterImg,
                            imageAlt: "The Mustangs documentary poster",
                        },
                        {
                            title: "SAFE Act Advocacy",
                            description: (
                                <div className="flex flex-col gap-4">
                                    <p>
                                        Redford strongly supported RTF&apos;s
                                        ongoing work to pass a law ending the
                                        slaughter of thousands of American
                                        horses, domestic and wild, each year.
                                        The bipartisan Save America&apos;s
                                        Forgotten Equines Act would both ban the
                                        export of American horses for slaughter
                                        and place a lasting ban on domestic
                                        horse slaughter.
                                    </p>
                                </div>
                            ),
                            image: GrazingImg,
                            imageAlt: "Horses grazing peacefully",
                        },
                    ]}
                />
            </div>

            {/* 6. Iconic Redford quote */}
            <div className="w-full py-20 px-4 bg-sage-green flex items-center justify-center">
                <ScrollReveal variant="fade-up" className="w-10/12 md:w-8/12">
                    <blockquote className="font-serif text-[24px] md:text-[36px] text-white text-center leading-snug">
                        &ldquo;America is the home of the horse. People come to
                        America to find freedom, and the horse helped us build
                        this free nation. We are not a horse-eating culture. To
                        kill the horse is simply un-American.
                    </blockquote>
                    <blockquote className="font-serif text-[20px] md:text-[28px] text-white/90 text-center leading-snug mt-6">
                        We as a horse nation are able to implement solutions for
                        the challenges facing our iconic wild mustangs, and
                        provide education and sanctuaries which can support
                        respect and a good life for all of America&apos;s
                        horses.&rdquo;
                    </blockquote>
                    <p className="mt-6 text-[18px] text-white/80 font-serif text-center">
                        — Robert Redford
                    </p>
                </ScrollReveal>
            </div>

            {/* 7. USA Today Op-Ed section */}
            <div className="w-full py-16 px-4 flex flex-col items-center gap-10">
                <ScrollReveal variant="fade-up" className="w-10/12 mx-auto">
                    <Header level={1} color="cinnamon">
                        We can protect our environment and give wild horses the
                        freedom they deserve
                    </Header>
                </ScrollReveal>

                <ScrollReveal variant="fade-up" className="w-10/12 md:w-8/12">
                    <p className="text-[16px] md:text-[18px] text-pewter font-serif text-center italic mb-8">
                        By Robert Redford — USA Today, Nov. 3, 2014
                    </p>

                    <div className="flex flex-col gap-6 text-[18px] md:text-[20px] text-ink leading-relaxed">
                        <p>
                            Horses and I have had a shared existence, personal
                            and professional, for as long as I can remember. And
                            while I carry a strong passion for all horses, my
                            tenacious support for the preservation of habitat
                            for wildlife and the American mustangs derives from
                            their symbolic representation of our national
                            heritage and freedom.
                        </p>
                        <p>
                            Any infringement on their legally protected right to
                            live freely is an assault on America&apos;s
                            principles. The varied and subjective interpretation
                            of laws intended to protect these animals on our
                            public lands, continues to leave wild horses under
                            attack.
                        </p>
                        <p>
                            Recent &ldquo;stand-offs&rdquo; between ranchers and
                            the federal government are reminiscent of old
                            westerns. But this American tragedy does not have a
                            hero riding in to save the day, and wild horses have
                            become the victim in the controversies over our
                            public land resources.
                        </p>
                        <p>
                            In 1971, as a result of concern for America&apos;s
                            dwindling wild horse populations, the US Congress
                            passed the Wild Free Roaming Horse and Burro Act.
                            The Act mandated that the Bureau of Land Management
                            (BLM), protect free roaming wild horses and burros,
                            under a multiple use management policy, on
                            designated areas of our public lands.
                        </p>
                        <p>
                            The BLM manages 245 million acres of our public
                            lands, with livestock grazing permits on 155 million
                            acres. Wild horses are designated to share a mere
                            26.9 million acres. That means only 17% of
                            BLM-managed public land are made available to wild
                            horses. Wild horse populations vary between 32,000
                            and 50,000 while livestock grazing allocations
                            accommodate numbers in the millions. Yes, in the
                            millions.
                        </p>
                        <p>
                            Advocates are only asking that the horses be treated
                            fairly. Wild horses are consistently targeted as the
                            primary cause of negative impact to grazing lands
                            resulting from decades of propaganda that ignores
                            math, science and solutions that can be implemented
                            today.
                        </p>
                        <p>
                            Ranchers hold nearly 18,000 grazing lease permits on
                            BLM land alone. Grazing costs on BLM land goes for
                            $1.35 per cow and calf pair, well below the market
                            rate of $16. This price disparity derived from
                            BLM&apos;s current permit policy establishes an
                            uneven playing field on grazing economies.
                            Understandably ranchers have a vested interest in
                            maintaining the status quo.
                        </p>
                        <p>
                            Although less than 3% of America&apos;s beef is
                            produced on federal land, this subsidized grazing
                            program costs the taxpayer more than $123 million
                            dollars a year, and more than $500 million when
                            indirect costs are accounted for.
                        </p>
                        <p>
                            The long-term economic success of public lands lies
                            in maintaining a bio diverse ecosystem within its
                            boundaries. However, understanding the need for a
                            preservation balance in thriving agricultural
                            communities often becomes sidelined.
                        </p>
                        <p>
                            The BLM needs to comply with its original
                            &ldquo;multiple use&rdquo; principle in managing
                            wild horses and burros. In light of the inequitable
                            share of livestock on BLM land, the on going
                            persecution of wild horses and those that value them
                            is unacceptable and threatens the very spirit of the
                            American West. I urge Congress to stand up for much
                            needed reform of the BLM&apos;s wild horse and burro
                            program and livestock grazing on federal lands.
                        </p>
                        <p>
                            Now is not the time to repudiate environmental
                            balance, but rather it is the time for all of us to
                            work together — politician, advocate, rancher,
                            scientist, and citizen. Only by doing this will the
                            United States move forward and be a leader in
                            environmental issues and ensure sustainability to
                            our delicate ecosystem.
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* 8. Donation CTA */}
            <div className="w-10/12 mx-auto py-8">
                <DonationCallout
                    image={BgBlurred}
                    heading="Continue Robert Redford's Legacy"
                    description="Support Return to Freedom's mission to preserve the freedom, diversity, and habitat of America's wild horses and burros."
                    donatePathway="general"
                    buttonText="Donate Now"
                    analyticsName="redford_memorial"
                />
            </div>
        </div>
    )
}

export default RedfordPage
