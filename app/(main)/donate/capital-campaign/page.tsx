import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Capital Campaign - Return to Freedom"
}

import Hero from "@/components/public-ui/Hero"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"

import bg1 from './bg-1.jpg'
import bg2 from './bg-2.jpg'
import bg3 from './bg-3.jpg'
import ccHero from './cc-hero.jpg'
import EmailLink from "@/components/public-ui/EmailLink"

const CapitalCampaignPage = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-16 mb-12 items-center justify-start text-center">

            <Hero title="Capital Campaign" image={ccHero} />
            
            <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-8 text-center">
                <div className="text-4xl font-serif text-cinnamon">
                    Building a Legacy for Wild Horse Conservation
                </div>
                <div className="flex flex-col items-center justify-center gap-6 text-center text-lg">
                    <div>
                        Return to Freedom's journey began in 1998 on 309 acres in California's Jalama Valley,
                        near Lompoc. This founding sanctuary—purchased by the DeMayo family—became home to the
                        American Wild Horse Sanctuary and the heart of RTF's mission: protecting the freedom,
                        diversity, and dignity of America’s wild horses and burros.
                    </div>
                    <div>
                        For more than 25 years, this land has served as a flagship hub for sanctuary care,
                        education, and national advocacy —providing refuge for rescued herds, a model for humane
                        land management, and a gathering place for thousands of visitors and students.
                    </div>
                    <div>
                        Today, we are working to permanently acquire this historic property and ensure that it
                        remains a protected space for generations to come. This is the first step in a three-part
                        campaign to secure RTF's future.
                    </div>
                </div>
            </div>

            <ImageWithAuthorCredit src={bg1} alt="Capital Campaign" className="w-full h-[80vh] object-cover object-center" />

            <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-8 text-center">
                <div className="text-4xl font-serif text-sage-green">
                Secure the Lompoc Ranch ($5.5 Million Target)
                </div>
                <div className="flex flex-col items-center justify-center gap-6 text-center text-lg">
                    <div>
                        We have already raised half of the acquisition cost ($2.75 million) to purchase our 
                        founding sanctuary. This property—home to hundreds of wild horses and burros—is 
                        essential to RTF's operations and public programming. Completing this acquisition will 
                        permanently secure RTF's headquarters and guarantee its long-term stability.
                    </div>
                </div>
            </div>

            <ImageWithAuthorCredit src={bg2} alt="Capital Campaign" className="w-full h-[80vh] object-cover object-center" />

            <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-8 text-center">
                <div className="text-4xl font-serif text-pewter">
                    Establish a $10 Million Endowment
                </div>
                <div className="flex flex-col items-center justify-center gap-6 text-center text-lg">
                    <div>
                        A permanent endowment will ensure the organization's ongoing sustainability—funding 
                        annual operations, regenerative land practices, advocacy, and educational initiatives. 
                        This foundation will provide RTF with the flexibility to respond quickly to rescue 
                        needs and advocacy opportunities.
                    </div>
                </div>
            </div>

            <ImageWithAuthorCredit src={bg3} alt="Capital Campaign" className="w-full h-[80vh] object-cover object-center" />

            <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-8 text-center">
                <div className="text-4xl font-serif text-cinnamon">
                    Acquire Land for Return to Freedom's Wild Horse and Wildlife Conservancy
                </div>
                <div className="flex flex-col items-center justify-center gap-6 text-center text-lg">
                    <div>
                        The next step in RTF’s growth is the acquisition of a larger property—over 6,000 
                        acres—to create the Wild Horse and Wildlife Conservancy, a center for conservation, 
                        education, and holistic land management. This space will serve as a living example 
                        of how wild horses, burros, and other grazing wildlife can restore and balance 
                        ecosystems when managed sustainably. ($15 million target)
                    </div>
                    <div>
                        Together, these three phases represent a $27.75 million investment in Return to Freedom's 
                        future—solidifying our founding sanctuary, enabling long-term sustainability, and ensuring 
                        RTF continues to lead in wild horse conservation and advocacy nationwide.
                    </div>
                </div>
            </div>

            <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-8 text-center">
                <div className="text-4xl font-serif text-sage-green">
                    Get Involved
                </div>
                <div className="flex flex-col items-center justify-center gap-6 text-center text-lg">
                    <div>
                        If you'd like to learn more or support our Capital Campaign, please email us at:
                    </div>
                    <EmailLink>
                        development@returntofreedom.org
                    </EmailLink>
                </div>
            </div>

        </div>
    )
}

export default CapitalCampaignPage