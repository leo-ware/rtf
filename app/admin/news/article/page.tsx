"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default () => {
  const router = useRouter()

  useEffect(() => {
    document.title = "News Articles - RTF Admin"
    router.replace("/admin/news")
  }, [router])

  return null
}
