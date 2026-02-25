"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://us.i.posthog.com",
        capture_pageview: false,
        person_profiles: "always",
        debug: process.env.NODE_ENV === "development",
    })
}

const PostHogPageView = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const posthog = usePostHog()

    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname
            const search = searchParams.toString()
            if (search) {
                url += `?${search}`
            }
            posthog.capture("$pageview", { $current_url: url })
        }
    }, [pathname, searchParams, posthog])

    return null
}

const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <PHProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            {children}
        </PHProvider>
    )
}

export default PostHogProvider
