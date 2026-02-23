"use client"

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import Header from "@/components/public-ui/Header"
import Button from "@/components/public-ui/Button"
import ScrollReveal from "@/components/public-ui/ScrollReveal"
import SocialLinks from "@/components/SocialLinksWidget"
import SubscribePrimary from "@/app/(main)/contact/SubscribePrimary"

import HeroImage from "../donate_hero.jpg"

// Example request from external donation service:
// ?donation-amountblock=1&makerecurringcb=no&donorpaysfeescb=false
// &person-firstname=Leo&person-lastname=Ware&contact-email=leobpware@gmail.com
// &contactoptincb=true&sl_ai=ebe00f64-800d-44f2-9907-1aca4e36e563&sl_at=FUNDRAISE

const ThankYouContent = () => {
    const searchParams = useSearchParams()

    const firstName = searchParams.get("person-firstname")
    const lastName = searchParams.get("person-lastname")
    const amount = searchParams.get("donation-amountblock")
    const isRecurring = searchParams.get("makerecurringcb") === "yes"
    const optedInToContact = searchParams.get("contactoptincb") === "true"

    const displayName = firstName || "Friend"
    const hasFullName = firstName && lastName

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                <Image
                    src={HeroImage}
                    alt="Wild horses at Return to Freedom sanctuary"
                    className="absolute inset-0 w-full h-full object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 text-center">
                    <ScrollReveal variant="fade-up">
                        <div className="text-white font-serif text-[48px] md:text-[72px] leading-tight mb-4">
                            Thank You{firstName ? `, ${displayName}` : ""}!
                        </div>
                    </ScrollReveal>
                    <ScrollReveal variant="fade-up" delay={0.15}>
                        <div className="text-white/90 text-[18px] md:text-[24px] max-w-2xl">
                            Your generosity helps protect America's wild horses and burros
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full bg-milk py-12 md:py-20">
                <div className="w-11/12 md:w-10/12 max-w-4xl mx-auto">
                    <ScrollReveal variant="fade-up">
                        <div className="text-center mb-12">
                            <div className="text-ink text-[18px] md:text-[22px] leading-relaxed">
                                {isRecurring ? (
                                    <>
                                        Your recurring donation{amount ? ` of $${amount}` : ""} will provide ongoing support for the wild horses and burros in our sanctuary. Monthly giving creates a foundation of stability that allows us to plan ahead and expand our conservation efforts.
                                    </>
                                ) : (
                                    <>
                                        Your donation{amount ? ` of $${amount}` : ""} directly supports the wild horses and burros living at our sanctuary—providing feed, veterinary care, and the freedom to roam as nature intended.
                                    </>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Impact Section */}
                    <ScrollReveal variant="fade-up" delay={0.1}>
                        <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm mb-12">
                            <Header level={2} color="sage-green" className="mb-8 no-underline">
                                What Your Gift Makes Possible
                            </Header>
                            <div className="grid md:grid-cols-3 gap-8 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-sage-green/10 flex items-center justify-center">
                                        <span className="text-3xl">🐴</span>
                                    </div>
                                    <div className="text-pewter font-serif text-[20px]">Sanctuary Care</div>
                                    <div className="text-ink text-[14px]">
                                        Feed, shelter, and veterinary care for over 500 wild horses and burros
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-cinnamon/10 flex items-center justify-center">
                                        <span className="text-3xl">⚖️</span>
                                    </div>
                                    <div className="text-pewter font-serif text-[20px]">Advocacy</div>
                                    <div className="text-ink text-[14px]">
                                        Fighting for humane policies and an end to cruel roundups
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-burnt-orange/10 flex items-center justify-center">
                                        <span className="text-3xl">🌿</span>
                                    </div>
                                    <div className="text-pewter font-serif text-[20px]">Conservation</div>
                                    <div className="text-ink text-[14px]">
                                        Science-based solutions to keep wild horses on the range
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Next Steps */}
                    <ScrollReveal variant="fade-up" delay={0.15}>
                        <div className="text-center mb-12">
                            <Header level={2} color="pewter" className="mb-6 no-underline">
                                Stay Connected
                            </Header>
                            <div className="text-ink text-[16px] md:text-[18px] mb-8 max-w-2xl mx-auto">
                                Join our community of wild horse advocates and stay updated on the impact of your support.
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/visit-us">
                                    <Button color="sage-green" size="large" className="text-[16px]">
                                        Visit Our Sanctuary
                                    </Button>
                                </Link>
                                <Link href="/horses/our-horses">
                                    <Button color="pewter" size="large" className="text-[16px]">
                                        Meet Our Horses
                                    </Button>
                                </Link>
                                <Link href="/donate/sponsor-a-horse">
                                    <Button color="cinnamon" size="large" className="text-[16px]">
                                        Sponsor a Horse
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Social Links */}
                    <ScrollReveal variant="fade-up" delay={0.2}>
                        <div className="text-center py-8 border-t border-pewter/20">
                            <div className="text-pewter font-serif text-[20px] mb-4">
                                Follow Our Journey
                            </div>
                            <div className="flex items-center justify-center gap-6 text-pewter">
                                <SocialLinks />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Subscribe Section */}
                    {!optedInToContact && (
                        <ScrollReveal variant="fade-up" delay={0.25}>
                            <div className="text-center pt-8 border-t border-pewter/20">
                                <div className="text-storm font-serif text-[22px] mb-2">
                                    Subscribe for Updates
                                </div>
                                <div className="text-ink text-[14px] mb-4">
                                    Get news about our horses, conservation efforts, and ways to help
                                </div>
                                <div className="max-w-md mx-auto">
                                    <SubscribePrimary />
                                </div>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </div>

            {/* Footer CTA */}
            <ScrollReveal variant="fade-up">
                <div className="w-full bg-sage-green py-12 md:py-16 text-center">
                    <div className="w-11/12 max-w-3xl mx-auto">
                        <div className="text-white font-serif text-[28px] md:text-[36px] mb-4">
                            {hasFullName
                                ? `${firstName}, you're now part of the herd.`
                                : "You're now part of the herd."}
                        </div>
                        <div className="text-white/90 text-[16px] md:text-[18px]">
                            Together, we're ensuring America's wild horses and burros remain free for generations to come.
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}

const ThankYouPage = () => {
    return (
        <Suspense
            fallback={
                <div className="w-full min-h-screen flex items-center justify-center bg-milk">
                    <div className="text-pewter font-serif text-[24px]">Loading...</div>
                </div>
            }
        >
            <ThankYouContent />
        </Suspense>
    )
}

export default ThankYouPage
