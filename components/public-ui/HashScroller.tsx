"use client"

import { useEffect } from "react"

const HashScroller = () => {
    useEffect(() => {
        if (!window.location.hash) return

        const id = window.location.hash.slice(1)

        const scrollToTarget = () => {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: "auto", block: "start" })
        }

        // Re-scroll after layout shifts from late-loading images.
        scrollToTarget()
        const timeouts = [100, 300, 600, 1000, 1500, 2500].map((ms) =>
            window.setTimeout(scrollToTarget, ms),
        )

        const onLoad = () => scrollToTarget()
        window.addEventListener("load", onLoad)

        return () => {
            timeouts.forEach((t) => window.clearTimeout(t))
            window.removeEventListener("load", onLoad)
        }
    }, [])

    return null
}

export default HashScroller
