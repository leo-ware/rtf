import DynamicPage from "../../../../components/DynamicPage"
import { use } from "react"

export default function LearnPage({ params }: {
    params: Promise<{ slug: string }>
  }) {
  const resolvedParams = use(params)
  return <DynamicPage slug={resolvedParams.slug} category="learn" />
}
