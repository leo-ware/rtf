import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Stella DeMayo Veterinary Fund - Return to Freedom"
}

import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import Image from "next/image"

import Azure from "./azure.jpg"
import Stella from "./stella.png"
import hero from "./hero.jpg"
import Button from "@/components/public-ui/Button"
import MoreWaysWidget from "../../../../components/donation-widgets/MoreWaysWidget"


const VeterinaryFundPage = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-16 mb-12 items-center justify-start text-center">
            <Hero title="Stella DeMayo Veterinary Fund" image={hero} />

            <Callout>
                Many companies offer matching gift programs that double—or even triple—your contribution
                to Return to Freedom. Others participate through corporate partnerships, sponsorships, or
                workplace giving campaigns. Together, these collaborations make a tangible difference in
                our ability to rescue, care for, and advocate for wild horses.
            </Callout>

            <div className="w-10/12 mx-auto flex gap-12 items-center justify-center">
                <div className="w-1/2 aspect-[5/3] relative">
                    <Image src={Stella} alt="Stella" className="w-full h-fullobject-cover object-center" />
                </div>
                <div className="w-1/2 flex flex-col gap-4 text-left text-lg">
                    <div className="text-3xl font-serif text-cinnamon">Stella DeMayo</div>
                    <div className="flex flex-col gap-2">
                        <div>
                            Stella DeMayo, beloved wife of the late Bill DeMayo and mother of Return to Freedom's
                            Founder, Neda DeMayo, passed away on August 17, 2020. Stella was a wonderful nurturer
                            to all, and worked professionally as a registered nurse. She was also an herbalist and
                            interested in holistic work and remedies.
                        </div>
                        <div>
                            Stella was always deeply concerned for the well-being of RTF’s horses and burros, especially
                            when they were injured or sick. She always asked about their health, and was truly
                            interested in their care.
                        </div>
                        <div>
                            In honor of Stella's nurturing nature and support, RTF has established the VETERINARY
                            AND SPECIAL NEEDS FUND.
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-10/12 mx-auto">
                <Header color="pewter">Our Horses In Need</Header>
                <div className="mt-8 w-full flex flex-col gap-4">
                    <div className="bg-seashell w-full pr-8 flex gap-4 items-center justify-between">
                        <div className="w-[300px] aspect-square relative">
                            <Image src={Azure} alt="Azure" className="w-full h-full object-cover object-center" />
                        </div>
                        <div className="font-serif text-pewter text-4xl">
                            Azure
                        </div>
                        <div className="text-xl w-[300px]">
                            Treatment for a broken leg.
                        </div>
                        <div className="font-serif text-2xl">$1500</div>
                        <Button color="cinnamon">Donate</Button>
                    </div>
                </div>
            </div>

            <MoreWaysWidget />
        </div>
    )
}

export default VeterinaryFundPage