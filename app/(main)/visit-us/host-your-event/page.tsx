import Hero from "@/components/public-ui/Hero"
import Callout from "@/components/public-ui/Callout"
import WideImage from "@/components/public-ui/WideImage"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import EventGallery from "@/components/EventGallery"
import ScrollReveal from "@/components/public-ui/ScrollReveal"
import Button from "@/components/public-ui/Button"
import Link from "next/link"

import HeroImg from "@/public/img/wedding_gallery_1.jpg"
import WideImg from "@/public/img/wedding_gallery_2.jpg"
import WeddingsImg from "@/public/img/wedding_gallery_3.jpg"
import FundraisersImg from "@/public/img/wedding_gallery_5.jpg"
import RetreatsImg from "@/public/img/wedding_gallery_6.jpg"

import galleryImg1 from "@/public/img/wedding_gallery_1.jpg"
import galleryImg2 from "@/public/img/wedding_gallery_2.jpg"
import galleryImg3 from "@/public/img/wedding_gallery_3.jpg"
import galleryImg4 from "@/public/img/wedding_gallery_4.jpg"
import galleryImg5 from "@/public/img/wedding_gallery_5.jpg"
import galleryImg6 from "@/public/img/wedding_gallery_6.jpg"
import galleryImg7 from "@/public/img/wedding_gallery_7.jpg"

export const metadata = {
    title: "Host Your Event - Return to Freedom",
    description: "Host your wedding, fundraiser, retreat, or special gathering at Return to Freedom's sanctuary on California's Central Coast.",
}

const galleryImages = [
    { src: galleryImg1, alt: "Sanctuary venue with mountain backdrop" },
    { src: galleryImg4, alt: "Outdoor event setup at the sanctuary", rowSpan: "row-span-2" },
    { src: galleryImg6, alt: "Guests enjoying an event among the horses" },
    { src: galleryImg2, alt: "Scenic pastures at golden hour" },
    { src: galleryImg7, alt: "Celebration under the oak trees", rowSpan: "row-span-2" },
    { src: galleryImg3, alt: "Table settings with rolling hills in the background" },
    { src: galleryImg5, alt: "Wild horses grazing near the event grounds" },
]

const eventTypes = [
    {
        title: "Weddings",
        description: (
            <div>
                <p className="my-2">
                    Exchange vows surrounded by rolling hills, ancient oaks, and the gentle presence
                    of wild horses. Our sanctuary offers a one-of-a-kind setting for intimate ceremonies
                    and receptions on California&apos;s Central Coast. Every celebration here directly
                    supports the care of over 460 rescued wild horses and burros.
                </p>
                <Link href="/contact">
                    <Button color="cinnamon" className="py-1 px-2">Inquire About Weddings</Button>
                </Link>
            </div>
        ),
        image: WeddingsImg,
        imageAlt: "Wedding ceremony at the sanctuary",
    },
    {
        title: "Fundraisers & Galas",
        description: (
            <div>
                <p className="my-2">
                    Host a fundraiser or gala that your guests will never forget. Whether it&apos;s a
                    seated dinner under the stars or a sunset cocktail reception with wild horses
                    in the background, our venue brings purpose and beauty together. Proceeds from
                    venue rentals help sustain our rescue and sanctuary operations.
                </p>
                <Link href="/contact">
                    <Button color="cinnamon" className="py-1 px-2">Plan Your Fundraiser</Button>
                </Link>
            </div>
        ),
        image: FundraisersImg,
        imageAlt: "Gala event at the sanctuary",
    },
    {
        title: "Retreats & Gatherings",
        description: (
            <div>
                <p className="my-2">
                    From corporate retreats and wellness workshops to family reunions and private
                    gatherings, our sanctuary provides a peaceful, inspiring backdrop unlike any other.
                    Surrounded by open pastures and free-roaming herds, your group can reconnect with
                    nature and each other in a truly meaningful setting.
                </p>
                <Link href="/contact">
                    <Button color="cinnamon" className="py-1 px-2">Book a Retreat</Button>
                </Link>
            </div>
        ),
        image: RetreatsImg,
        imageAlt: "Retreat gathering at the sanctuary",
    },
]

const HostYourEventPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <Hero title="Host Your Event" image={HeroImg} />

            <ScrollReveal variant="fade-up">
                <Callout>
                    Celebrate life&apos;s milestones in a setting like no other. Return to Freedom&apos;s
                    sanctuary on California&apos;s Central Coast offers 300 acres of rolling hills, ancient
                    oaks, and free-roaming wild horses as the backdrop for your wedding, fundraiser,
                    retreat, or private gathering. Every event hosted here helps sustain our mission to
                    protect America&apos;s wild horses and burros.
                </Callout>
            </ScrollReveal>

            <ScrollReveal variant="fade-in" className="w-full">
                <WideImage image={WideImg} alt="Panoramic view of the sanctuary grounds" />
            </ScrollReveal>

            <div className="w-full py-8">
                <ScrollReveal variant="fade-up">
                    <Header color="pewter" className="mb-12">Event Types</Header>
                </ScrollReveal>
                <AlternatingPictureLayout
                    alternateTitleColors
                    items={eventTypes}
                />
            </div>

            <ScrollReveal variant="fade-up" className="w-full">
                <Header color="sage-green" className="mb-4">Our Venue</Header>
            </ScrollReveal>
            <EventGallery images={galleryImages} />

            <ScrollReveal variant="fade-up">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16">
                    <Header color="pewter" className="mb-6">Ready to Plan Your Event?</Header>
                    <p className="text-lg leading-8 text-gray-600 mb-8">
                        We&apos;d love to help you create an unforgettable experience at the sanctuary.
                        Reach out to our team to discuss availability, pricing, and how we can tailor
                        the space to your vision.
                    </p>
                    <div className="w-fit mx-auto">
                        <Link href="/contact">
                            <Button color="cinnamon" size="large">Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default HostYourEventPage
