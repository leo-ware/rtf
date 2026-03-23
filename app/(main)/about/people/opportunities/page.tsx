"use client"

import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import Callout from "@/components/public-ui/Callout"
import OpportunitiesHero from "./opportunities-hero.jpg"
import Button from "@/components/public-ui/Button"
import EmailLink from "@/components/public-ui/EmailLink"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { ImSpinner8 } from "react-icons/im"

const OpportunitiesPage = () => {
    const jobListings = useQuery(api.jobListing.listJobListings, { limit: 200, includeExpired: false })

    const formatDateTime = (ms: number) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(ms))
    }

    return (
        <div className="w-full h-fit">
            <Hero title="Opportunities" image={OpportunitiesHero} />

            <div className="w-full h-fit py-16 px-4 flex flex-col items-center justify-center gap-12">
                <Callout className="w-10/12">
                    If you believe in protecting wild horses and burros and preserving the
                    landscapes they depend on, we invite you to explore opportunities to work
                    with Return to Freedom. Our team, volunteers, and partners all play a vital
                    role in advancing humane conservation and advocacy.
                </Callout>

                <Header className="text-cinnamon">
                    Current Openings
                </Header>

                {jobListings === undefined && (
                    <div className="w-full h-fit flex flex-col items-center justify-center gap-6">
                        <div className="text-xl text-ink flex items-center justify-center gap-2">
                            <ImSpinner8 className="w-4 h-4 animate-spin" />
                            Loading job listings...
                        </div>
                    </div>
                )}

                {jobListings !== undefined && jobListings.length === 0 && (
                    <div className="w-full h-fit flex flex-col items-center justify-center gap-6">
                        <div className="text-xl text-ink">
                            No job listings found. Please check back later.
                        </div>
                    </div>
                )}

                {(jobListings || [])
                    .sort((a, b) => a.order - b.order)
                    .map((jobListing) => (
                        <div className="w-10/12 h-fit flex flex-col items-start justify-center gap-6">
                            <div className="text-[28px] font-serif text-pewter">
                                {jobListing.name}
                            </div>
                            <div className="text-[20px] text-ink flex flex-col gap-4">
                                {jobListing.description.split("\n\n").map((p, index) => (
                                    <div key={index}>
                                        {p}
                                    </div>
                                ))}
                                <div className="flex flex-col gap-2">
                                    <div>
                                        Apply before: {formatDateTime(jobListing.applicationDeadline)}
                                    </div>
                                    <div>
                                        Date posted: {formatDateTime(jobListing._creationTime)}
                                    </div>
                                </div>
                            </div>
                            <Link href={jobListing.applicationFormLink} target="_blank">
                                <Button color="cinnamon" className="">
                                    Learn More and Apply
                                </Button>
                            </Link>
                        </div>
                    ))}
            </div>

            <div className="w-full h-fit pb-16 px-4 flex flex-col items-center justify-center gap-12">
                <Header className="text-cinnamon">
                    Volunteer at RTF
                </Header>

                <div className="w-full md:w-10/12 lg:w-8/12 h-fit flex flex-col items-start justify-center gap-6">
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
                            To participate in our next Volunteer day; please contact{" "}
                            <EmailLink>volunteers@returntofreedom.org</EmailLink>.
                            You will receive a short application form so we can learn more about
                            you and then schedule a safety training!
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-10/12 lg:w-8/12 h-fit flex flex-col items-start justify-center gap-6">
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
                            information, email us at{" "}
                            <EmailLink>volunteers@returntofreedom.org</EmailLink>.
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-10/12 lg:w-8/12 h-fit flex flex-col items-start justify-center gap-6">
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