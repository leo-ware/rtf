"use client"

import Link from "next/link"
import Image from "next/image"
import { chunk } from "@/lib/utils"
import AresMares from "@/public/img/ares-mares-cropped.png"
import Button from "@/components/public-ui/Button"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"

const DocumentsWidget = () => {
    const {results: documents, status: documentsStatus} = usePaginatedQuery(
        api.documents.listPublicDocuments,
        {type: undefined},
        {initialNumItems: 500}
    )
    const [activeTab, setActiveTab] = useState<"annual_report" | "financial_documents" | "form_990">("annual_report")

    const documentsWithLinks = (documents || []).map(doc => ({
        ...doc,
        link: `/resources/documents/${doc._id}`
    }))

    const listDocuments = documentsWithLinks
        .filter(d => d.type === activeTab)
        .sort((a, b) => b.year - a.year)
        .map(doc => {
            if (activeTab === "annual_report") {
                return { ...doc, title: `${doc.year} Annual Report` }
            } else {
                return doc
            }
        })

    const sortedAnnualReport = documentsWithLinks
        .filter(d => d.type === "annual_report")
        .sort((a, b) => b.year - a.year)
    const latestAnnualReport = sortedAnnualReport.length > 0 ? sortedAnnualReport[0] : null

    return (
        <>
            <div className="relative w-full h-[325px] md:pl-36 py-8 flex items-center justify-center md:justify-start">
                <Image
                    src={AresMares}
                    alt="Ares Mares"
                    className="z-0 absolute w-full h-full object-cover object-center"
                    fill />
                <div className="z-10 flex flex-col items-start justify-center gap-4">
                    <div className="text-white text-3xl font-bold">
                        Read our latest<br />
                        Annual Report
                    </div>
                    <Link href={latestAnnualReport?.link || "/"}>
                        <Button color="burnt-orange">
                            {latestAnnualReport
                                ? `${latestAnnualReport.year} Annual Report`
                                : "2024 Annual Report"}
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="w-full h-fit bg-pewter py-8 px-8 md:px-1/12 flex flex-col md:flex-row items-start md:items-center justify-center gap-8">
                <div className="flex flex-col items-start justify-start gap-2 md:max-w-[150px]">
                    <div className="text-white text-2xl font-bold">Financials</div>
                    <div className="text-white text-sm">
                        Return to Freedom is a 501(c)3 nonprofit organization. Tax ID: #06-1484961
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-fit flex flex-col items-center justify-center gap-4">
                    <div className="w-full flex stretch gap-4">
                        <div
                            onClick={() => setActiveTab("annual_report")}
                            className="cursor-pointer grow basis-10 md:basis-auto bg-white rounded py-2 md:py-1 px-2 text-pewter text-xs flex items-center justify-center">
                            <div className="hidden md:block">ANNUAL REPORTS</div>
                            <div className="block md:hidden">REPORTS</div>
                        </div>
                        <div
                            onClick={() => setActiveTab("financial_documents")}
                            className="cursor-pointer grow basis-10 md:basis-auto bg-white rounded py-2 md:py-1 px-2 text-pewter text-xs flex items-center justify-center">
                            <div className="hidden md:block">FINANCIAL STATEMENTS</div>
                            <div className="block md:hidden">FINANCIALs</div>
                        </div>
                        <div
                            onClick={() => setActiveTab("form_990")}
                            className="cursor-pointer grow basis-10 md:basis-auto bg-white rounded py-2 md:py-1 px-2 text-pewter text-xs flex items-center justify-center">
                            FORM 990
                        </div>
                    </div>

                    <div className="w-full bg-white rounded p-8 flex flex-col md:flex-row">
                        {chunk(listDocuments, 8).map(rl => (
                            <div className="w-full md:w-1/3 flex flex-col items-start justify-start gap-1">
                                {rl.map(r => (
                                    <Link href={r.link} className="text-pewter text-sm">
                                        {r.title}
                                    </Link>
                                ))}
                            </div>
                        ))}
                        {listDocuments.length === 0 && (
                            <div className="w-full flex items-center justify-center">
                                <div className="text-pewter text-sm">No documents found</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DocumentsWidget