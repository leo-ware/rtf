"use client"

import Hero from "@/components/public-ui/Hero"
import Button from "@/components/public-ui/Button"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import EmailLink from "@/components/public-ui/EmailLink"
import SocialLinks from "@/components/SocialLinksWidget"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"

import hero from "./hero.jpg"
import img1 from "./img1.jpg"
import img2 from "./img2.png"
import img3 from "./img3.png"
import LongRightArrow from "@/components/LongRightArrow"
import { Loader2 } from "lucide-react"

const ContactPage = () => {

    const submitContactMessage = useMutation(api.contactMessages.submitContactMessage)
    const [formData, setFormData] = useState({
        name: null as string | null,
        email: null as string | null,
        phone: null as string | null,
        topic: null as string | null,
        subject: null as string | null,
        message: null as string | null,
        organization: null as string | null,
    })
    const [error, setError] = useState<Partial<typeof formData>>({})
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const checkSubmit = () => {
        const errAcc = {} as any
        (["name", "email", "topic", "subject", "message"] as const).forEach((key) => {
            if (!formData[key as keyof typeof formData]) {
                errAcc[key as keyof typeof errAcc] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
            }
        })
        setError(errAcc)
        return !Object.values(errAcc).some((value) => !!value)
    }
    const canSubmit = ["name", "email", "topic", "subject", "message"].every((key) => formData[key as keyof typeof formData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage(null)
        if (checkSubmit()) {
            setIsLoading(true)
            try {
                await submitContactMessage({
                    name: formData.name!,
                    email: formData.email!,
                    topic: formData.topic!,
                    subject: formData.subject!,
                    message: formData.message!,
                })
            } catch (error) {
                console.error("Error submitting contact message:", error)
                setErrorMessage("Failed to submit message")
            } finally {
                setIsLoading(false)
            }
        }
    }

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
                                className="grow h-full py-2 px-4 text-sm"
                            />
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

            <form onSubmit={handleSubmit} className="w-10/12 mx-auto">
                <Header className="mb-8">Contact Us</Header>
                <div className="w-full flex flex-col md:flex-row justify-between gap-8">
                    <div className="md:w-6/12">
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Name*</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="text"
                                        className="w-full h-full py-2 px-4 text-sm"
                                        value={formData.name ?? ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                {error.name && <div className="text-red-500 text-sm">{error.name}</div>}
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Email*</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="email"
                                        className="w-full h-full py-2 px-4 text-sm"
                                        value={formData.email ?? ""}
                                        disabled={isLoading}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                {error.email && <div className="text-red-500 text-sm">{error.email}</div>}
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Organization (if Relevant)</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="text"
                                        className="w-full h-full py-2 px-4 text-sm"
                                        value={formData.organization ?? ""}
                                        disabled={isLoading}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Subject*</div>
                                <div className="w-full h-8 flex border-2 border-sage-green rounded-sm">
                                    <input
                                        type="text"
                                        className="w-full h-full py-2 px-4 text-sm"
                                        value={formData.subject ?? ""}
                                        disabled={isLoading}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                {error.subject && <div className="text-red-500 text-sm">{error.subject}</div>}
                            </div>

                            <div className="w-full text-left">
                                <div className="text-[25px] font-serif text-cinnamon">Your Message*</div>
                                <div className="w-full h-fit flex border-2 border-sage-green rounded-sm">
                                    <textarea
                                        rows={6}
                                        className="w-full py-2 px-4 text-sm resize-none"
                                        disabled={isLoading}
                                        value={formData.message ?? ""}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                {error.message && <div className="text-red-500 text-sm">{error.message}</div>}
                            </div>
                        </div>

                    </div>

                    <div className="md:w-5/12 text-left flex flex-col justify-between text-[20px]">
                        <div className="h-full w-full flex flex-col gap-2 items-start justify-start">
                            <div className="text-[25px] font-serif text-cinnamon mb-4">
                                Inquiry*
                            </div>
                            <div className="h-fit flex flex-col gap-2 items-start justify-start">
                                {([
                                    { id: "general_inquiry", label: "General Inquiry" }
                                ] as const).map(({ id, label }) => (
                                    <div
                                        key={id}
                                        className="flex items-center gap-4"
                                        onClick={() => setFormData({ ...formData, topic: id })}
                                    >
                                        <div className={`
                                    rounded-full h-4 w-4
                                    border-1 border-pewter
                                    ${formData.topic === id ? "bg-pewter" : "bg-transparent"}
                                `} />
                                        <div>{label}</div>
                                    </div>
                                ))}
                                {error.topic && <div className="text-red-500 text-sm">{error.topic}</div>}
                            </div>
                        </div>

                        <div className="w-full h-fit flex flex-col gap-2 items-end justify-end">
                            <button type="submit" disabled={!canSubmit || isLoading}>
                                <Button
                                    color="cinnamon"
                                    size="large"
                                    className={`
                                    mt-4
                                    ${(!canSubmit || isLoading) ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}
                                `}>
                                    {isLoading
                                        ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Submitting...
                                            </div>
                                        )
                                        : "Submit"}
                                </Button>
                            </button>
                            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
                        </div>
                    </div>
                </div>
            </form>

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
                        If you're a news outlet, journalist, storyteller who is interested in sharing our story,
                        you can email us at <EmailLink>media@returntofreedom.org</EmailLink>
                    </div>,
                    image: img3,
                },
            ]} />
        </div>
    )
}

export default ContactPage