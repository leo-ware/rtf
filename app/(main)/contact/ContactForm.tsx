"use client"

import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect, useRef } from "react"
import Button from "@/components/public-ui/Button"
import { Loader2 } from "lucide-react"

const initialFormData = {
    name: null as string | null,
    email: null as string | null,
    phone: null as string | null,
    topic: null as string | null,
    subject: null as string | null,
    message: null as string | null,
    organization: null as string | null,
}

const ContactForm = () => {
    const submitContactMessage = useMutation(
        api.contactMessages.submitContactMessage,
    )
    const [formData, setFormData] = useState(initialFormData)
    const [error, setError] = useState<Partial<typeof formData>>({})
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const formRef = useRef<HTMLFormElement>(null)

    // Auto-dismiss success message after 4 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 4000)
            return () => clearTimeout(timer)
        }
    }, [success])

    // Auto-dismiss error message after 5 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage])

    const checkSubmit = () => {
        const errAcc = {} as any
        const requiredFields = ["name", "email", "topic", "subject", "message"] as const
        requiredFields.forEach((key) => {
            if (!formData[key as keyof typeof formData]) {
                errAcc[key as keyof typeof errAcc] =
                    `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
            }
        })
        setError(errAcc)

        // Scroll to first error field
        if (Object.keys(errAcc).length > 0) {
            const firstErrorField = requiredFields.find((key) => errAcc[key])
            if (firstErrorField && formRef.current) {
                const fieldElement = formRef.current.querySelector(`[data-field="${firstErrorField}"]`)
                fieldElement?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        }

        return !Object.values(errAcc).some((value) => !!value)
    }

    const canSubmit = ["name", "email", "topic", "subject", "message"].every(
        (key) => formData[key as keyof typeof formData],
    )

    // Update form field and clear its error
    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (error[field]) {
            setError((prev) => ({ ...prev, [field]: null }))
        }
        // Clear error message on any interaction
        if (errorMessage) {
            setErrorMessage(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage(null)
        setSuccess(false)
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
                setSuccess(true)
                // Reset form after successful submission
                setFormData(initialFormData)
            } catch (error) {
                console.error("Error submitting contact message:", error)
                setErrorMessage("Failed to submit message. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="w-10/12 mx-auto">
            <fieldset disabled={isLoading} className="w-full flex flex-col md:flex-row justify-between gap-8">
                <div className="md:w-6/12">
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full text-left" data-field="name">
                            <div className="text-[25px] font-serif text-cinnamon">
                                Name*
                            </div>
                            <div className={`w-full h-8 flex border-2 rounded-sm transition-colors duration-200 ${error.name ? "border-red-400" : "border-sage-green"}`}>
                                <input
                                    type="text"
                                    className="w-full h-full py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-sage-green/50 transition-shadow duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    value={formData.name ?? ""}
                                    onChange={(e) => updateField("name", e.target.value)}
                                />
                            </div>
                            <div className={`text-red-500 text-sm transition-all duration-200 overflow-hidden ${error.name ? "max-h-8 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                {error.name}
                            </div>
                        </div>

                        <div className="w-full text-left" data-field="email">
                            <div className="text-[25px] font-serif text-cinnamon">
                                Email*
                            </div>
                            <div className={`w-full h-8 flex border-2 rounded-sm transition-colors duration-200 ${error.email ? "border-red-400" : "border-sage-green"}`}>
                                <input
                                    type="email"
                                    className="w-full h-full py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-sage-green/50 transition-shadow duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    value={formData.email ?? ""}
                                    onChange={(e) => updateField("email", e.target.value)}
                                />
                            </div>
                            <div className={`text-red-500 text-sm transition-all duration-200 overflow-hidden ${error.email ? "max-h-8 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                {error.email}
                            </div>
                        </div>

                        <div className="w-full text-left" data-field="subject">
                            <div className="text-[25px] font-serif text-cinnamon">
                                Subject*
                            </div>
                            <div className={`w-full h-8 flex border-2 rounded-sm transition-colors duration-200 ${error.subject ? "border-red-400" : "border-sage-green"}`}>
                                <input
                                    type="text"
                                    className="w-full h-full py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-sage-green/50 transition-shadow duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    value={formData.subject ?? ""}
                                    onChange={(e) => updateField("subject", e.target.value)}
                                />
                            </div>
                            <div className={`text-red-500 text-sm transition-all duration-200 overflow-hidden ${error.subject ? "max-h-8 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                {error.subject}
                            </div>
                        </div>

                        <div className="w-full text-left" data-field="message">
                            <div className="text-[25px] font-serif text-cinnamon">
                                Your Message*
                            </div>
                            <div className={`w-full h-fit flex border-2 rounded-sm transition-colors duration-200 ${error.message ? "border-red-400" : "border-sage-green"}`}>
                                <textarea
                                    rows={6}
                                    className="w-full py-2 px-4 text-sm resize-none outline-none focus:ring-2 focus:ring-sage-green/50 transition-shadow duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    value={formData.message ?? ""}
                                    onChange={(e) => updateField("message", e.target.value)}
                                />
                            </div>
                            <div className={`text-red-500 text-sm transition-all duration-200 overflow-hidden ${error.message ? "max-h-8 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                {error.message}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-5/12 text-left flex flex-col justify-between text-[20px]">
                    <div className="h-full w-full flex flex-col gap-2 items-start justify-start" data-field="topic">
                        <div className="text-[25px] font-serif text-cinnamon mb-4">
                            Inquiry*
                        </div>
                        <div className="h-fit flex flex-col gap-2 items-start justify-start">
                            {(
                                [
                                    {
                                        id: "general_inquiry",
                                        label: "General Inquiry",
                                    },
                                ] as const
                            ).map(({ id, label }) => (
                                <div
                                    key={id}
                                    className="flex items-center gap-4 cursor-pointer select-none"
                                    onClick={() => {
                                        updateField("topic", id)
                                    }}
                                >
                                    <div
                                        className={`
                                            rounded-full h-4 w-4
                                            border-1 border-pewter
                                            transition-colors duration-200
                                            ${formData.topic === id ? "bg-pewter" : "bg-transparent"}
                                        `}
                                    />
                                    <div>{label}</div>
                                </div>
                            ))}
                            <div className={`text-red-500 text-sm transition-all duration-200 overflow-hidden ${error.topic ? "max-h-8 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                {error.topic}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-fit flex flex-col gap-2 items-end justify-end">
                        <div
                            className={`text-red-500 text-sm transition-all duration-300 overflow-hidden ${errorMessage ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            {errorMessage}
                        </div>
                        <div
                            className={`text-green-600 text-sm font-medium transition-all duration-300 overflow-hidden ${success ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            Message sent successfully!
                        </div>
                        <button
                            type="submit"
                            disabled={!canSubmit || isLoading}
                            className="group"
                        >
                            <Button
                                color="cinnamon"
                                size="large"
                                className={`
                                    mt-4
                                    transition-all duration-200
                                    ${!canSubmit || isLoading
                                        ? "opacity-60 cursor-not-allowed"
                                        : "cursor-pointer hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </div>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    )
}

export default ContactForm
