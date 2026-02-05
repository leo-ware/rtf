"use client"

import { useEffect, useState, useRef, RefObject } from "react"
import { Loader2 } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type SalsaDonateFormEmbedProps = {
    donationFormId: Id<"donationForms">
    scrollingContainerRef?: RefObject<HTMLDivElement>
}

const SalsaDonateFormEmbed = ({
    donationFormId,
    scrollingContainerRef,
}: SalsaDonateFormEmbedProps) => {
    const donationForm = useQuery(api.donationForms.getDonationForm, {
        id: donationFormId,
    })
    return (
        donationForm && (
            <SalsaDonateFormEmbedInner
                donationForm={donationForm}
                scrollingContainerRef={scrollingContainerRef}
            />
        )
    )
}

type SalsaDonateFormEmbedInnerProps = {
    donationForm: {
        formId: string
        formTemplateId: string
    }
    scrollingContainerRef?: RefObject<HTMLDivElement>
}

export const SalsaDonateFormEmbedInner = ({
    donationForm,
    scrollingContainerRef,
}: SalsaDonateFormEmbedInnerProps) => {
    const [_iframeHeight, setIframeHeight] = useState(600)
    const [isLoading, setIsLoading] = useState(true)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const iframeHeight = isLoading ? 600 : _iframeHeight

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null
        if (donationForm) {
            timeout = setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    }, [donationForm])

    const iframeContent =
        donationForm &&
        `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
            </style>
        </head>
        <body>
            <div id="${donationForm.formId}"></div>
            <script src="https://default.salsalabs.org/api/widget/template/${donationForm.formTemplateId}/?tId=${donationForm.formId}"></script>
            <script>
                const sendHeight = () => {
                    const height = document.body.scrollHeight;
                    window.parent.postMessage({ type: 'salsa-resize', height }, '*');
                };

                // Send initial height after load
                window.addEventListener('load', () => {
                    // Give Salsa script time to render
                    setTimeout(sendHeight, 100);
                });

                // Watch for dynamic changes
                if (typeof ResizeObserver !== 'undefined') {
                    const observer = new ResizeObserver(sendHeight);
                    observer.observe(document.body);
                } else {
                    // Fallback for older browsers
                    setInterval(sendHeight, 500);
                }
            </script>
        </body>
        </html>
    `

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (
                event.data.type === "salsa-resize" &&
                typeof event.data.height === "number"
            ) {
                if (typeof event.data.height === "number") {
                    setIframeHeight(event.data.height)
                }

                if (!isLoading) {
                    if (iframeRef.current) {
                        if (scrollingContainerRef?.current) {
                            // If a scrolling container ref is provided, scroll within that container
                            const iframeTop = iframeRef.current.offsetTop
                            scrollingContainerRef.current.scrollTo({
                                top: iframeTop,
                                behavior: "smooth",
                            })
                        } else {
                            // Otherwise use default scrollIntoView
                            iframeRef.current.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                        }
                    }
                }
            }
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [scrollingContainerRef])

    return (
        <div className="w-full h-fit relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-sage-green">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
            )}
            {!isLoading && iframeContent && (
                <iframe
                    ref={iframeRef}
                    srcDoc={iframeContent}
                    className="w-full border-0"
                    style={{ height: `${iframeHeight}px` }}
                    title="Sponsor a Horse Donation Form"
                />
            )}
        </div>
    )
}

export default SalsaDonateFormEmbed
