import Hero from "@/components/public-ui/Hero"
import Button from "@/components/public-ui/Button"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import EmailLink from "@/components/public-ui/EmailLink"
import SocialLinks from "@/components/SocialLinksWidget"

import hero from "./hero.jpg"
import img1 from "./img1.jpg"
import img2 from "./img2.png"
import img3 from "./img3.png"
import LongRightArrow from "@/components/LongRightArrow"

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
                        <div className="md:w-full h-8 flex border-2 border-sage-green rounded-sm">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="grow h-full py-2 px-4 text-sm" />
                            <button className="basis-16 grow-0 h-full bg-cinnamon text-white flex items-center justify-center">
                                <LongRightArrow />
                            </button>
                        </div>
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

            <div className="w-10/12 mx-auto">
                <Header className="mb-8">Contact Us</Header>
                <div className="w-full flex flex-col md:flex-row justify-between gap-8">
                    <div className="md:w-6/12">
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">First Name*</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="text"
                                        className="w-full h-full py-2 px-4 text-sm" />
                                </div>
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Last Name*</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="text"
                                        className="w-full h-full py-2 px-4 text-sm" />
                                </div>
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Email*</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="email"
                                        className="w-full h-full py-2 px-4 text-sm" />
                                </div>
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Organization (if Relevant)</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="text"
                                        className="w-full h-full py-2 px-4 text-sm" />
                                </div>
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Your Message*</div>
                                <div className="w-full h-32 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="text"
                                        className="w-full h-full py-2 px-4 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative md:w-5/12 text-left flex flex-col gap-2 text-[20px]">
                        <div className="text-[25px] font-serif text-cinnamon mb-4">
                            Inquiry*
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border-1 border-pewter rounded-full h-4 w-4" />
                            <div>Sanctuary & Animal Care</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border-1 border-pewter rounded-full h-4 w-4" />
                            <div>Sanctuary & Animal Care</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border-1 border-pewter rounded-full h-4 w-4" />
                            <div>Sanctuary & Animal Care</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border-1 border-pewter rounded-full h-4 w-4" />
                            <div>Sanctuary & Animal Care</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border-1 border-pewter rounded-full h-4 w-4" />
                            <div>Sanctuary & Animal Care</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border-1 border-pewter rounded-full h-4 w-4" />
                            <div>Sanctuary & Animal Care</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border-1 border-pewter rounded-full h-4 w-4" />
                            <div>Sanctuary & Animal Care</div>
                        </div>

                        <Button color="cinnamon" className="mt-4 md:absolute md:right-10 md:bottom-0">
                            Submit
                        </Button>
                    </div>
                </div>
            </div>

            <AlternatingPictureLayout items={[
                {
                    title: <div className="text-pewter">General Inquiries</div>,
                    description: <div>
                        For any general inquiries, you can email us at
                        <EmailLink>info@returntofreedom.org</EmailLink>
                    </div>,
                    image: img1,
                },
                {
                    title: <div className="text-pewter">Donors</div>,
                    description: <div>
                        If you're a donor/foundation interested in supporting our Capital Campaign, Planned Giving 
                        Program or any of our other areas, you can email us at 
                        <EmailLink>development@returntofreedom.org</EmailLink>
                    </div>,
                    image: img2,
                },
                {
                    title: <div className="text-pewter">Media</div>,
                    description: <div>
                        If you’re a news outlet, journalist, storyteller who is interested in sharing our story, 
                        you can email us at <EmailLink>media@returntofreedom.org</EmailLink>
                    </div>,
                    image: img3,
                },
            ]} />
        </div>
    )
}

export default ContactPage