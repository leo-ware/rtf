import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import OpportunitiesHero from "./opportunities-hero.png"
import Button from "@/components/public-ui/Button"
import EmailLink from "@/components/public-ui/EmailLink"

const OpportunitiesPage = () => {
    return (
        <div className="w-full h-fit">
            <Hero title="Opportunities" image={OpportunitiesHero} />

            <div className="w-full h-fit py-16 px-4 flex flex-col items-center justify-center gap-12">
                <Header className="text-cinnamon">
                    Current Openings
                </Header>

                <div className="w-10/12 h-fit flex flex-col items-start justify-center gap-6">
                    <div className="text-[28px] font-serif text-pewter">
                        Account Executive (Temporary)
                    </div>

                    <div className="text-[20px] text-ink flex flex-col gap-4">
                        <div>
                            Lorem ipsum dolor sit amet consectetur. Aliquam felis etiam eu pulvinar sit. Lectus morbi mus sit scelerisque purus id suspendisse. Arcu est quam sagittis eleifend dictum etiam tellus varius. Velit eu mi vel velit. Mattis sed magna velit accumsan vel sem vulputate nunc nunc. Tristique nulla aenean suspendisse in ac. Consequat mauris augue quam tortor non. Lobortis lobortis quam sit nec quam donec risus. Varius viverra enim consectetur fringilla neque sed orci.
                        </div>
                        <div>
                            Quisque bibendum porta dignissim vivamus vivamus pharetra. Neque varius nisi sit hendrerit fringilla aliquet risus. Id eu id cursus nec fermentum pellentesque est est arcu. Commodo elit laoreet lorem odio lacus mi. Consectetur enim mi accumsan risus turpis viverra. Tempus aliquet sed integer sed mus felis elit eu ipsum. Purus pulvinar tristique nec non sed sapien nec libero morbi. Ac massa eu mauris eu luctus quisque facilisis quam. At viverra felis in quam quis velit. Posuere malesuada consectetur imperdiet leo sit rhoncus arcu nulla.
                        </div>
                        <div>
                            Apply before: 11/01/2025, 11:59 PT
                        </div>
                        <div>
                            Date posted: 10/25/2025
                        </div>
                    </div>

                    <Button color="cinnamon" className="">
                        Learn More and Apply
                    </Button>
                </div>
            </div>

            <div className="w-full h-fit pb-16 px-4 flex flex-col items-center justify-center gap-12">
                <Header className="text-cinnamon">
                    Volunteer at RTF
                </Header>

                <div className="w-10/12 h-fit flex flex-col items-start justify-center gap-6">
                    <div className="text-[28px] font-serif text-pewter">
                        Public Volunteer Days
                    </div>

                    <div className="text-[20px] text-ink flex flex-col gap-4">
                        <div>
                            Return to Freedom hosts weekly volunteer days at our LOMPOC sanctuary 
                            location! Please bring your own lunch. Recommended minimum age is eight 
                            years. Light refreshments are provided. Wear closed toed shoes, hat, 
                            sunblock and bring your water bottle!
                        </div>
                        <div>
                            For local and regional residents who want to volunteer on a regular basis, 
                            we will schedule a general safety training!
                            To participate in our next Volunteer day; please contact 
                            <EmailLink className="pl-1">volunteers@returntofreedom.org</EmailLink>.
                            You will receive a short application form so we can learn more about 
                            you and then schedule a safety training!
                        </div>
                    </div>
                </div>

                <div className="w-10/12 h-fit flex flex-col items-start justify-center gap-6">
                    <div className="text-[28px] font-serif text-pewter">
                        Volunteer at our San Luis Obispo Location
                    </div>

                    <div className="text-[20px] text-ink flex flex-col gap-4">
                        <div>
                            After volunteering in Lompoc and completing a safety orientation, you 
                            may want to join us to volunteer at our satellite sanctuary in San Luis 
                            Obispo. Projects there include; water trough cleaning, star thistle 
                            eradication, fence maintenance projects, clearing old barb wire, wood 
                            and other debris!
                        </div>
                        <div>
                            Join our volunteer email list to receive volunteer updates. Let us know 
                            if you would like to volunteer for fundraisers or tabling events! For more 
                            information, email us at
                            <EmailLink className="pl-1">volunteers@returntofreedom.org</EmailLink>.
                        </div>
                    </div>
                </div>

                <div className="w-10/12 h-fit flex flex-col items-start justify-center gap-6">
                    <div className="text-[28px] font-serif text-pewter">
                        In Residence / Long-Term Volunteer Form
                    </div>

                    <div className="text-[20px] text-ink flex flex-col gap-4">
                        <div>
                            Participate in the everyday activities of running a wild horse sanctuary: feeding, 
                            cleaning, checking fence-lines, observing herds, equine recordkeeping, pasture 
                            maintenance and management, nutrition, foal watch, night checks, and assisting our 
                            staff veterinarian. Conduct daily herd observation. Depending on your skillset you 
                            may also work with our advocacy team, social media, events, development and 
                            administrative support!
                        </div>
                        <div>
                            In-Residence Applications are accepted throughout the year on a rolling basis, 
                            but limited space is available in the program. After you complete the entire 
                            application process, you may be invites to schedule a Skype interview. If you 
                            are accepted into the program, you will be eligible to stay onsite at the 
                            sanctuary. Accommodation is rustic. In-residence volunteers are required to 
                            stay a minimum of one month to three months. On a limited basis, there is also 
                            the possibility to extend your program for a longer term.
                        </div>
                        <div>
                            Return to Freedom Wild Horse Sanctuary partners with Experience International, 
                            a nonprofit whose mission “promotes leadership development and technical and 
                            cultural exchange in fields related to agriculture, forrestry, fisheries, and 
                            natural resource management and conservation.” International applicants are 
                            encouraged to contact Experience International to learn more about long-term work 
                            exchange VISAs when they apply for this program.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpportunitiesPage