import Link from "next/link"
import { FileText, ExternalLink } from "lucide-react"

export const metadata = {
    title: "Help & Guides - RTF Admin"
}

type HelpArticle = {
    title: string
    description: string
    href: string
}

const helpArticles: HelpArticle[] = [
    {
        title: "Salsa Labs Donation Forms",
        description: "How to create and configure donation forms using Salsa Labs integration",
        href: "/admin/help/salsa-donate-forms"
    },
]

const Help = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 w-full mx-auto lg:w-2/3 py-12 px-8">
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-2">Help & Guides</h1>
                <p className="text-gray-600">
                    Step-by-step guides for common admin tasks.
                </p>
            </div>

            <div className="w-full grid gap-4">
                {helpArticles.map((article) => (
                    <Link
                        key={article.href}
                        href={article.href}
                        className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                        <FileText className="h-6 w-6 text-gray-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">{article.title}</h2>
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{article.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Help
