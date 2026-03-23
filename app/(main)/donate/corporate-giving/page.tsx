import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Matching Gifts & Corporate Giving - Return to Freedom"
}

import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import Header from "@/components/public-ui/Header"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"

import hero from "./hero.jpg"
import img1 from "./img1.png"
import img2 from "./img2.png"
import im3 from "./im3.png"
import img4 from "./img4.png"
import EmailLink from "@/components/public-ui/EmailLink"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import MoreWaysWidget from "../../../../components/donation-widgets/MoreWaysWidget"

const CorporateGivingPage = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-16 mb-12 items-center justify-start text-center">
            <Hero title="Matching Gifts & Corporate Giving" image={hero} />

            <Callout>
                Many companies offer matching gift programs that double—or even triple—your contribution
                to Return to Freedom. Others participate through corporate partnerships, sponsorships, or
                workplace giving campaigns. Together, these collaborations make a tangible difference in
                our ability to rescue, care for, and advocate for wild horses.
            </Callout>

            <div className="w-10/12 mx-auto flex flex-col gap-8">
                <Header color="pewter">Matching Funds</Header>
                <div className="w-full flex gap-12 flex-col lg:flex-row-reverse items-center justify-center">
                    <div className="w-full lg:w-1/2 aspect-[4/3] relative hidden lg:block rounded-sm overflow-hidden">
                        <ImageWithAuthorCredit className="w-full h-full object-cover object-center" fill wrapperClassName="w-full h-full" src={img1} alt="Matching Funds" />
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col gap-4 text-left text-lg">
                        <div>
                            Did you know that many employers offer matching gift programs—doubling or even tripling your donation at no extra cost to you? Most companies match employee donations dollar-for-dollar, often up to $10,000 per year, and some make it easy through payroll deductions or online giving platforms.
                        </div>
                        <div>
                            By participating, every dollar you give can go twice as far—providing hay, care, and protection for wild horses and burros at Return to Freedom’s sanctuaries.
                        </div>
                        <div>
                            Ask your employer if they offer a matching funds program or check your company’s online giving portal to get started.Here is an email template to help you reach out to your employer to participate in our matching funds program.If you have any questions, please contact development@returntofreedom.org
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col gap-16">
                <div className="w-10/12 mx-auto">
                    <Header color="pewter">Corporate Giving</Header>
                    <div className="text-lg mt-8 text-left md:text-center md:w-3/4 mx-auto">
                        We invite brands and corporations who share our commitment to protect the freedom
                        and diversity of the wild ones by sponsoring various aspects of our work.
                        To learn more, please contact <EmailLink>development@returntofreedom.org</EmailLink>
                    </div>
                </div>
                <AlternatingPictureLayout items={[
                    {
                        title: "Customizable Volunteer Days",
                        description: `
                            Help care for the wild horses, burros, other wildlife and our sanctuary site by
                            sponsoring a corporate volunteer day. Your group will have the unique opportunity
                            to see the wild horses and burros, free in a natural environment in a true herd
                            immersion experience with your colleagues! You will be able to engage in discussions
                            with a Return to Freedom educator to explore the challenges these large herd animals
                            face in a changing world. We have the ability to do a range of group sizes and can
                            work with your team to make it special.
                        `,
                        image: img2,
                        buttonLabel: "Inquire",
                        buttonHref: "/contact"
                    },
                    {
                        title: "Event Sponsorship",
                        description: `
                            Show your corporate support and sponsor a Return to Freedom event. RTF hosts events
                            of various sizes both onsite at our sanctuary as well as offsite venues on both the
                            East and West Coasts.
                        `,
                        image: im3,
                        buttonLabel: "Inquire",
                        buttonHref: "/contact"
                    },
                    {
                        title: "Equipment In-Kind Gifts",
                        description: <>
                            Operating three different sanctuary sites and working on the range with the wild ones
                            takes work! We are always in need of new equipment and vehicles to properly care for
                            the horses and the sanctuary grounds. Cameras, computers and innovative software programs
                            also help us keep our information up to date and shareable to our supporters! Please let
                            us know if you would like to help and contact the Development Team to find out our most
                            current needs.
                        </>,
                        image: img4,
                        buttonLabel: "View Wishlist",
                        buttonHref: "/donate/wishlist"
                    },
                    {
                        title: "Retail partner/Product Collaborator",
                        description: `
                            We love collaborating with dynamic brands that align with our mission and values for both
                            retail and RTF promotional items. Say hello!
                        `,
                        image: img4,
                        buttonLabel: "Get in Touch",
                        buttonHref: "/contact"
                    },
                ]} />
            </div>

            <MoreWaysWidget />
        </div>
    )
}

export default CorporateGivingPage