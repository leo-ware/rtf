import Hero from "@/components/public-ui/Hero"
import Image from "next/image"
import Header from "@/components/public-ui/Header"

import HeroImg from "./adopt-a-horse-hero.jpg"
import Heather from "./heather.png"
import Chloe from "./chloe.png"
import Galaxy from "./galaxy.png"
import Galaxy2 from "./galaxy-2.png"

const AdoptAHorsePage = () => {
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
                        and/or burro(s) are placed in suitable environments.Due to limited resources 
                        and the constant need for displaced wild or special needs horses and burros 
                        to find sanctuary, we may occasionally have horses or burros available for 
                        adoption, specifically those who will benefit from having more attention in 
                        a private home. Over the past 24 years, RTF has successfully collaborated 
                        with individuals, other organizations, state & federal agencies to find homes 
                        for wild horses and burros in need.
                    </p>
                    <p>
                        Please understand that as a horse progresses in their education, their adoption 
                        fee may increase to help recover just some of the organization's resources.
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

            <div className="w-8/12 h-fit flex flex-col gap-4">
                <div className="w-full border-b-1 border-cinnamon You text-left text-cinnamon text-[48px] font-serif">
                    Adoption Spotlight
                </div>
                <div className="w-full px-8 flex justify-between items-start gap-8">
                    <div className="w-1/3 flex flex-col gap-2 py-2">
                        <Image
                            className="h-[250px] w-auto object-cover object-center"
                            src={Heather}
                            alt="Heather" />
                        <Image
                            className="h-[250px] w-auto object-cover object-center"
                            src={Chloe}
                            alt="Chloe" />
                    </div>
                    <div className="w-2/3 flex flex-col gap-2">
                        <div className="text-sage-green text-left text-[48px] font-serif">
                            Heather & Chloe
                        </div>
                        <div className="flex gap-8 items-center uppercase font-semibold text-sm">
                            <div>Date of birth: 2007</div>
                            <div>adoption fee: $2000</div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-4 text-left">
                            <p>
                                These two beautiful mares have been together their entire lives and 
                                need to be adopted together. They have mostly enjoyed the pastured 
                                life with occasional trail riding. Both mares have lots of energy and 
                                do best when they have a routine and ridden at least a few days a 
                                week. Both are fun trail horses, and have wonderful gaits. Heather 
                                is pretty fancy and versatile.
                            </p>
                            <p>
                                Both mares are best suited for intermediate riders with good ground skills. 
                                Both mares have wonderful gaits and have been trained by Hector Uribe.
                                Heather and Chloe also spent a year at The Carolyn Resnick Method Liberty 
                                Academy in Escondito, Calif., where they helped teach liberty work through 
                                The Carolyn Resnick Method. Heather and Chloe have since returned to the 
                                sanctuary and are looking for a forever home to give them lots of attention 
                                and get them back out on the trails!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-8/12 h-fit flex flex-col gap-4">
                <div className="w-full border-b-1 border-pewter You text-left text-pewter text-[48px] font-serif">
                    Other Horses Looking for a Forever Home
                </div>
                <div className="w-full px-8 flex justify-between items-start gap-8">
                    <div className="w-1/3 flex flex-col gap-2 py-2">
                        <Image
                            className="h-[250px] w-auto object-cover object-center"
                            src={Galaxy}
                            alt="Galaxy" />
                        <Image
                            className="h-[250px] w-auto object-cover object-center"
                            src={Galaxy2}
                            alt="Galaxy" />
                    </div>
                    <div className="w-2/3 flex flex-col gap-2">
                        <div className="text-pewter text-left text-[48px] font-serif">
                            Galaxy
                        </div>
                        <div className="flex gap-8 items-center uppercase font-semibold text-sm">
                            <div>Gelding</div>
                            <div>Date of birth: 2007</div>
                            <div>14.2 hh</div>
                            <div>adoption fee: $4500</div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-4 text-left">
                            <p>
                                Stunning, Smart, Friendly, Big floaty mover.This striking youngster 
                                has such a unique and stunning presence about him. His two blue 
                                eyes, strong stature and bold coloring really set him apart. Galaxy 
                                has a very quiet, sensible mind, is super curious and friendly and 
                                wants to please. He has great focus and relaxes into his work nicely. 
                                His uphill build, big stride and floaty movement shows lots of 
                                strength and balance.
                            </p>
                            <p>
                                Galaxy is a gorgeous horse with a friendly, sensible mind. He tries 
                                hard and learns quickly so it’s super fun working with him. He loves 
                                attention, comes willingly to be haltered, leads and stands quietly 
                                for grooming, bathing and hoof care. He is full of personality and 
                                tries his best to please. He is going to make someone a super fun, 
                                willing partner.
                            </p>
                            <p>
                                Galaxy is gentle and kind and has a very sweet personality. He is moving 
                                through his groundwork with ease and will soon be under saddle.
                                Currently in training with Nicolette Birnie at Wild to Willing 
                                Horsemanship, Santa Ynez CA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AdoptAHorsePage