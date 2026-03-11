import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import EmailLink from "@/components/public-ui/EmailLink"
import SocialLinks from "@/components/SocialLinksWidget"
import ContactForm from "./ContactForm"

import hero from "./hero.jpg"
import img1 from "./img1.jpg"
import img2 from "./img2.png"
import img3 from "./img3.png"
import LongRightArrow from "@/components/LongRightArrow"
import SalsaDonateFormEmbed from "@/components/SalsaDonateFormEmbed"
import SubscribePrimary from "./SubscribePrimary"

export const metadata = {
    title: "Contact Us - Return to Freedom",
}

const ContactPage = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-16 mb-12 items-center justify-start text-center">
            <Hero title="Contact Us" image={hero} />

            <div className="w-10/12 mx-auto">
                <Header className="mb-8">Stay Connected</Header>
                <div className="w-full flex flex-col md:flex-row justify-between gap-8">
                    <div className="md:w-6/12 text-left">
                        <div className="text-[25px] mb-4 font-serif text-cinnamon">
                            Subscribe to receive updates on our work
                        </div>
                        <SubscribePrimary />
                    </div>
                    <div className="md:w-5/12">
                        <div className="text-left text-[25px] mb-4 font-serif text-cinnamon">
                            Connect with us on Social Media
                        </div>
                        <div className="flex justify-start gap-4 text-sage-green">
                            <SocialLinks />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <Header className="mb-8 px-[8.33%] md:px-0">Contact Us</Header>
                <ContactForm />
            </div>

            <div className="w-full md:max-w-10/12 mx-auto">
            <AlternatingPictureLayout
                items={[
                    {
                        title: (
                            <div className="text-pewter">General Inquiries</div>
                        ),
                        description: (
                            <div>
                                For any general questions about Return to Freedom
                                and our mission, you can email us at{" "}
                                <EmailLink>info@returntofreedom.org</EmailLink>
                            </div>
                        ),
                        image: img1,
                    },
                    {
                        title: <div className="text-pewter">Donor Inquiry</div>,
                        description: (
                            <div>
                                If you're a donor or foundation interested in
                                supporting our Capital Campaign, Planned Giving
                                Program or any of our other initiatives, you can
                                email us at{" "}
                                <EmailLink>
                                    info@returntofreedom.org
                                </EmailLink>
                            </div>
                        ),
                        image: img2,
                    },
                    {
                        title: <div className="text-pewter">Corporate Sponsorship</div>,
                        description: (
                            <div>
                                Interested in a corporate partnership or
                                sponsorship opportunity with Return to Freedom?
                                Reach out at{" "}
                                <EmailLink>
                                    info@returntofreedom.org
                                </EmailLink>
                            </div>
                        ),
                        image: img3,
                    },
                    {
                        title: <div className="text-pewter">Host an Event</div>,
                        description: (
                            <div>
                                Want to host a fundraiser, awareness event or
                                community gathering in support of wild horses?
                                Contact us at{" "}
                                <EmailLink>
                                    info@returntofreedom.org
                                </EmailLink>
                            </div>
                        ),
                        image: img1,
                    },
                    {
                        title: <div className="text-pewter">Media</div>,
                        description: (
                            <div>
                                If you're a news outlet, journalist or
                                storyteller interested in sharing our story, you
                                can email us at{" "}
                                <EmailLink>info@returntofreedom.org</EmailLink>
                            </div>
                        ),
                        image: img2,
                    },
                    {
                        title: <div className="text-pewter">Volunteer</div>,
                        description: (
                            <div>
                                Interested in volunteering at the sanctuary or
                                helping with our programs? We'd love to hear
                                from you at{" "}
                                <EmailLink>
                                    info@returntofreedom.org
                                </EmailLink>
                            </div>
                        ),
                        image: img3,
                    },
                    {
                        title: <div className="text-pewter">Education & Outreach</div>,
                        description: (
                            <div>
                                For school visits, educational programs or
                                speaking engagements about wild horse
                                conservation, reach out at{" "}
                                <EmailLink>
                                    info@returntofreedom.org
                                </EmailLink>
                            </div>
                        ),
                        image: img1,
                    },
                    {
                        title: <div className="text-pewter">Adoptions & Sanctuary</div>,
                        description: (
                            <div>
                                Have questions about our sanctuary horses or
                                interested in our adoption and foster programs?
                                Contact us at{" "}
                                <EmailLink>
                                    info@returntofreedom.org
                                </EmailLink>
                            </div>
                        ),
                        image: img2,
                    },
                ]}
            />
            </div>
        </div>
    )
}

export default ContactPage
