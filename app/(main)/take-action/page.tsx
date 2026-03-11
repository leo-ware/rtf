"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const TakeActionPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.replace("/what-we-do/advocacy#take-action")
    }, [router])

    return null
}

export default TakeActionPage
