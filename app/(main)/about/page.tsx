import Image from "next/image"
import Link from "next/link"
import Button from "@/components/Button"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { chunk } from "@/lib/utils"

import AboutHeroImg from "@/public/img/about_hero.jpg"
import NedaAndSpirit from "@/public/img/neda-and-spirit.jpg"
import BrosChilling from "@/public/img/bros-chilling.png"
import AresMares from "@/public/img/ares-mares-cropped.png"

import GSLogo from "@/public/img/sponsor-image-giant-steps.png"
import HPLogo from "@/public/img/sponsor-image-horse-play.png"
import MCLogo from "@/public/img/sponsor-image-montecito.png"
import PRLogo from "@/public/img/sponsor-image-puremedy.png"
import SBLogo from "@/public/img/sponsor-image-santa-barbara-foundation.png"

const logos = [GSLogo, HPLogo, MCLogo, PRLogo, SBLogo]

export default function AboutPage() {
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
                <div className="md:max-w-1/2 text-center">
                    Return to Freedom is a 501(c)(3) nonprofit wild horse sanctuary founded in the
                    late 1990s by equine enthusiast Neda DeMayo. What began as a childhood dream
                    blossomed into a thriving sanctuary dedicated to preserving the freedom, diversity,
                    and natural habitats of America’s wild horses and burros.
                </div>
                <Link href="/about/our-history" className="w-fit">
                    <Button color="pewter">OUR HISTORY</Button>
                </Link>
            </div>

            <div className="w-full h-fit py-4 px-4 flex flex-col items-center justify-center gap-12">
                <div className="bg-seashell max-w-7/12 px-16 py-8 rounded-md flex flex-col items-center justify-center gap-4">
                    <div className="text-3xl font-bold text-burnt-orange">Mission</div>
                    <div>
                        Return to Freedom is dedicated to preserving the freedom, diversity, and habitat
                        of America’s wild horses and burros through sanctuary, education, advocacy, and
                        conservation, while enriching the human spirit through direct experience with
                        the natural world.
                    </div>
                </div>

                <div className="bg-seashell max-w-7/12 px-16 py-8 rounded-md flex flex-col items-center justify-center gap-4">
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
                <div className="max-w-1/2 h-[300px] bg-sage-green flex">
                    <div className="w-1/2">
                        <Image src={NedaAndSpirit} alt="Neda and Spirit" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-1/2 p-6 flex flex-col items-start justify-center gap-2">
                        <div className="text-xl font-bold text-white">Our People</div>
                        <div className="text-white text-sm">
                            The RTF team is dedicated to preserving the freedom, diversity,
                            and habitat of America’s wild horses and burros through sanctuary, education, advocacy,
                            and conservation, while enriching the human spirit through direct experience with the
                            natural world.
                        </div>
                        <Link href="/">
                            <Button color="burnt-orange" className="py-1">MEET THE TEAM</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full h-fit py-8 bg-seashell flex flex-col items-center justify-center gap-4">
                <div className="text-3xl font-bold text-pewter">RTF in the News</div>
                <div className="w-full flex items-center justify-center gap-4">
                    <div>
                        <FaCaretLeft size={30} className="text-pewter" />
                    </div>
                    <div className="w-3/4 h-[200px] flex">
                        <div className="w-1/2 h-full overflow-hidden">
                            <Image src={BrosChilling} alt="Image for news article" className="w
                            -full h-full object-cover" />
                        </div>
                        <div className="w-1/2 h-full bg-white flex flex-col items-center justify-center">
                            <div className="w-3/4 h-fit border-l-4 border-burnt-orange pl-4 py-2 gap-2">
                                <div className="text-[12px] text-ink uppercase font-bold">
                                    Bloodhorse Daily
                                </div>
                                <div className="text-lg font-bold text-pewter">
                                    Mustang Movie a Fine Fit With SAFE ACT Campaign
                                </div>
                                <div className="text-sm">
                                    September 20, 2025
                                </div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <FaCaretRight size={30} className="text-pewter" />
                    </div>
                </div>
            </div>

            <div className="relative w-full h-[325px] pl-36 py-8 flex items-center">
                <Image
                    src={AresMares}
                    alt="Ares Mares"
                    className="z-0 absolute w-full h-full object-cover object-center"
                    fill />
                <div className="z-10 flex flex-col items-start justify-center gap-4">
                    <div className="text-white text-3xl font-bold">
                        Read our latest<br />
                        Annual Report
                    </div>
                    <Button color="burnt-orange">2024 Annual Report</Button>
                </div>
            </div>

            <div className="w-full h-fit bg-pewter py-8 flex items-center justify-center gap-8">
                <div>
                    <div className="text-white text-2xl font-bold">Financials</div>
                    <div className="text-white text-sm max-w-[150px]">
                        Return to Freedom is a 501(c)3 nonprofit organization. Tax ID: #06-1484961
                    </div>
                </div>

                <div className="w-1/2 h-fit flex flex-col items-center justify-center gap-4">
                    <div className="w-full flex stretch gap-4">
                        <div className="flex-grow bg-white rounded py-1 text-center text-pewter text-xs">FORM 990</div>
                        <div className="flex-grow bg-white rounded py-1 text-center text-pewter text-xs">FINANCIAL STATEMENTS</div>
                        <div className="flex-grow bg-white rounded py-1 text-center text-pewter text-xs">ANNUAL REPORTS</div>
                    </div>

                    <div className="w-full bg-white rounded p-8 flex">
                        {chunk([...Array(10)].map((_, index) => 2023 - index), 8).map(rl => (
                            <div className="w-1/4 flex flex-col items-start justify-start gap-1">
                                {rl.map(r => (
                                    <Link href="/" className="text-pewter text-sm">
                                        {r} Annual Report
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full h-fit py-8">
                <div className="w-full flex flex-col items-center justify-center gap-1">
                    <div className="text-burnt-orange text-3xl font-bold text-center">
                        Corporate Sponsors
                    </div>
                    <div className="w-1/2 text-ink text-sm text-center">
                        A very special thank you goes out to our generous sponsors — corporations 
                        that make it possible to do more of the costly work required of a national 
                        advocacy organization like Return to Freedom.
                        <br/>
                        If you or your company wishes to sponsor our work, please email us.
                    </div>
                </div>

                <div className="w-full flex items-center justify-center gap-4">
                    {logos.map(logo => (
                        <Image src={logo} alt="Sponsor Logo" width={200} height={200} />
                    ))}
                </div>

            </div>

        </div>
    )
}
