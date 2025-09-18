import DynamicPage from "../../../../components/DynamicPage"
import { use } from "react"

export default function WhatWeDoPage({ params }: {
    params: Promise<{ slug: string }>
  }) {
  const resolvedParams = use(params)
  return <DynamicPage slug={resolvedParams.slug} category="what-we-do" />
}