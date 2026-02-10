import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Planned Giving - Return to Freedom"
}

import Hero from "@/components/public-ui/Hero"
import Image from "next/image"
import Callout from "@/components/public-ui/Callout"

import pgHero from "./pg-hero.jpg"
import pg1 from "./img1.png"
import EmailLink from "@/components/public-ui/EmailLink"
import Header from "@/components/public-ui/Header"
import MoreWaysWidget from "../../../../components/donation-widgets/MoreWaysWidget"

const PlannedGivingPage = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-16 mb-12 items-center justify-start text-center">

            <Hero title="Planned Giving" image={pgHero} />

            <div className="w-full flex flex-col gap-12">
                <Callout>
                    Our Planned Giving Programs help to provide a stable future for Return to Freedom (RTF),
                    the animals at our Sanctuary, and hope for a secure future for wild horses on the range.
                    Our supporters are investing not only in RTF, but in the wild horses now running and yet
                    to be born.
                </Callout>

                <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-4 text-center text-lg">
                    <div>
                        There is more than one way to help Return to Freedom help horses besides a donation —
                        or in addition to a donation.
                        Our Planned Giving Programs provide a simple platform for your philanthropic needs.
                        We seek to optimize the benefits to you and your family. This page may help you choose
                        a giving program that maximizes your tax deduction benefits while ensuring a secure
                        future for our work.
                    </div>
                    <div>
                        We recommend that you discuss your plans with your attorney and financial advisors. Our
                        Development Director is here to help you customize your gift in a way that will benefit
                        you most, and help Return to Freedom at the same time.
                        On behalf of all the animals at Return to Freedom's American Wild Horse Sanctuary, we
                        thank you.
                    </div>
                    <div>
                        To learn more or to make a donation, please email:{" "}
                        <EmailLink>info@returntofreedom.org</EmailLink>
                        or call us at
                        (805) 737-9246.You may also send mail to: Return to Freedom, P.O. Box 926, Lompoc, CA 93438.
                        Return to Freedom is a non-profit 501(c)3 organization.Your donation is tax deductible to the
                        fullest extent of the law.Tax ID number 06-1484961.
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col gap-8">
                <Header color="pewter" className="underline">
                    Financial Contributions
                </Header>
                <div className="w-full flex flex-col gap-12">
                    {([
                        {
                            title: "Gifts of Cash",
                            description: `
                                Gifts of Cash are the easiest way to obtain a charitable deduction by helping 
                                Return to Freedom. A majority of the gifts made to RTF are in the form of cash 
                                through a check written by the donor. If you itemize, your outright gifts of 
                                cash are fully deductible for Federal Income Tax purposes up to 50% of your 
                                adjusted gross income. If your total gifts exceed this limitation, the excess 
                                may be carried forward for tax purposes for up to five years.
                            `
                        },
                        {
                            title: "Gifts of Stock",
                            description: `
                                Gifts of Stock give you a two-fold tax-saving. First, you avoid paying any 
                                capital gains tax on the increase in value of the stock. Second, you receive 
                                a tax deduction for the full market value of the stock on the date of the 
                                gift. For income tax purposes, the value of such gifts may be deducted up 
                                to 30% of adjusted gross income with an additional five-year carry forward. 
                                If the stock has depreciated in value, ask your tax advisor if you should 
                                sell it in order to report the deductible loss, and donate the proceeds 
                                instead, in order to preserve the maximum tax deductions.
                            `
                        },
                        {
                            title: "Bequest",
                            description: `
                                The Bequest is a donation made through a will, and is one of the most common 
                                planned gifts to RTF. You can designate a certain percentage or a fixed 
                                amount of cash from your estate to be given to Return to Freedom. Additionally, 
                                you can leave stock portfolios or personal property as part of a bequest. We 
                                can be named as a beneficiary in a will in any one of a number of simple ways. 
                                In many cases you can easily add us to your will through a simple amendment 
                                called a codicil, so that your entire will does not have to be redrafted. 

                                The Federal Estate Tax has not been determined at the time of this publication, 
                                but it has historically been at a much higher rate than the income tax. It 
                                definitely pays to do some advance planning with your attorney and financial 
                                advisors. Please consider Return to Freedom in your estate planning.

                                The following text is a suggestion for how you can give horses a “Gift of Freedom” 
                                in your will. “I give and bequeath to Return to Freedom, American Wild Horse 
                                Sanctuary, federal tax number 06-1484961, located at PO Box 926, Lompoc, CA 93438, 
                                the gift of ———” (insert cash amount or describe real or personal property in the blank).
                            `
                        }
                    ] as const).map(({ title, description }) => (
                        <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center">
                            <div className="
                                font-serif text-cinnamon text-[30px] text-right
                                flex items-center justify-center
                                md:justify-start md:w-[220px] md:h-full
                            ">
                                {title}
                            </div>
                            <div className="md:w-1/2 text-lg text-left flex flex-col gap-4">
                                {description.split("\n\n").filter(x => !!x).map(s => (
                                    <div>{s}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-8/12 mx-auto h-fit flex flex-col items-center justify-center gap-6 text-center">
                <div className="text-4xl font-serif text-sage-green">
                    Get Involved
                </div>
                <div className="flex flex-col items-center justify-center gap-4 text-center text-lg">
                    <div>
                        If you'd like to learn more or support our Capital Campaign, please email us at:
                    </div>
                    <EmailLink>
                        development@returntofreedom.org
                    </EmailLink>
                </div>
            </div>

            <Image src={pg1} alt="Planned Giving" className="w-[60vw] aspect-[5/3] object-cover object-center" />

            <MoreWaysWidget />
        </div>
    )
}

export default PlannedGivingPage