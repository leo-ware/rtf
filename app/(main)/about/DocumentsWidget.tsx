"use client"

import Link from "next/link"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { chunk } from "@/lib/utils"
import AresMares from "@/public/img/ares-mares-cropped.png"
import Button from "@/components/public-ui/Button"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const DocumentsWidget = () => {
    const { results: documents, status: documentsStatus } = usePaginatedQuery(
        api.documents.listPublicDocuments,
        { type: undefined },
        { initialNumItems: 500 }
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
                <ImageWithAuthorCredit
                    src={AresMares}
                    alt="Ares Mares"
                    className="z-0 absolute w-full h-full object-cover object-center"
                    fill
                    wrapperClassName="z-0 absolute top-0 left-0 w-full h-full" />
                <div className="z-10 flex flex-col items-start justify-center gap-4">
                    <div className="text-white text-[36px] md:text-[48px] font-serif leading-tight">
                        Read our latest<br />
                        Annual Report
                    </div>
                    <Link
                        href={latestAnnualReport?.link || "/"}
                        onClick={() => {
                            if (latestAnnualReport) {
                                trackEvent(AnalyticsEvents.DOCUMENT_OPENED, {
                                    name: `${latestAnnualReport.year} Annual Report`,
                                    type: "annual_report",
                                    year: latestAnnualReport.year,
                                })
                            }
                        }}
                    >
                        <Button color="cinnamon">
                            {latestAnnualReport
                                ? `${latestAnnualReport.year} Annual Report`
                                : "2024 Annual Report"}
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="w-full h-fit bg-pewter py-12 md:py-20 px-4 md:px-1/12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">

                <div className="w-full md:w-fit flex flex-col items-center md:items-start justify-start gap-2 text-center md:text-left md:shrink-0">
                    <div className="text-white text-[36px] md:text-[48px] font-serif leading-tight">Financials</div>
                    <div className="text-white text-[16px] md:text-[20px] max-w-[280px] md:max-w-[215px]">
                        Return to Freedom is a 501(c)3 nonprofit organization. Tax ID: #06-1484961
                    </div>
                </div>

                <div className="w-full md:w-[800px] h-fit flex flex-col items-start justify-center gap-3 md:gap-4">
                    <div className="w-full flex gap-2 md:gap-4">
                        {([
                            {
                                title: "ANNUAL REPORTS",
                                id: "annual_report"
                            },
                            {
                                title: "FINANCIAL STATEMENTS",
                                id: "financial_documents"
                            },
                            {
                                title: "FORM 990",
                                id: "form_990"
                            }
                        ] as const).map(item => (
                            <div
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    cursor-pointer grow basis-0 bg-white rounded-xl
                                    py-2 px-2 md:px-3 text-pewter text-[13px] md:text-[16px] text-center
                                    flex items-center justify-center border-3 md:border-4
                                    ${activeTab === item.id
                                        ? "border-cinnamon"
                                        : "border-pewter"
                                    }
                                    `}
                                >
                                {item.title}
                            </div>
                        ))}
                    </div>

                    <div className="w-full bg-white rounded p-4 md:p-8 flex flex-col md:flex-row">
                        {chunk(listDocuments, 8).map(rl => (
                            <div className="w-full md:w-1/3 flex flex-col items-start justify-start gap-1">
                                {rl.map(r => (
                                    <Link
                                        href={r.link}
                                        className="text-pewter text-[17px] md:text-[20px]"
                                        onClick={() => trackEvent(AnalyticsEvents.DOCUMENT_OPENED, {
                                            name: r.title,
                                            type: activeTab,
                                            year: r.year,
                                        })}
                                    >
                                        {r.title}
                                    </Link>
                                ))}
                            </div>
                        ))}
                        {listDocuments.length === 0 && (
                            <div className="w-full flex items-center justify-center">
                                <div className="text-pewter text-[20px]">No documents found</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DocumentsWidget