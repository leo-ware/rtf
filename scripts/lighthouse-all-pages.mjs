#!/usr/bin/env node

/**
 * Run Lighthouse on all public-facing pages and output a summary table.
 * For dynamic routes, we hit one example page each.
 */

import { execSync } from "child_process"
import { writeFileSync } from "fs"

const BASE = "https://rtf.leoware.io"

// Static pages (no dynamic params)
const staticPages = [
    "/",
    "/about",
    "/about/people",
    "/about/people/opportunities",
    "/about/history",
    "/about/our-storytellers",
    "/about/our-storytellers/redford",
    "/contact",
    "/donate",
    "/donate/capital-campaign",
    "/donate/corporate-giving",
    "/donate/other-ways-to-give",
    "/donate/planned-giving",
    "/donate/sponsor-a-horse",
    "/donate/sponsor-a-burro",
    "/donate/veterinary-fund",
    "/donate/wishlist",
    "/donate/thanks",
    "/horses",
    "/horses/spirit",
    "/horses/our-horses",
    "/horses/our-burros",
    "/horses/our-herds",
    "/horses/adopt-a-horse",
    "/resources/news",
    "/resources/learn",
    "/resources/learn/articles",
    "/take-action",
    "/visit-us",
    "/visit-us/events",
    "/visit-us/programs",
    "/visit-us/host-your-event",
    "/what-we-do/sanctuary",
    "/what-we-do/conservation",
    "/what-we-do/education",
    "/what-we-do/advocacy",
    "/what-we-do/advocacy/roundups",
    "/what-we-do/advocacy/population-management",
    "/what-we-do/advocacy/herd-management",
    "/what-we-do/advocacy/horse-slaughter",
]

const results = []

const runLighthouse = (path) => {
    const url = `${BASE}${path}`
    try {
        const output = execSync(
            `npx lighthouse "${url}" --only-categories=performance --output=json --chrome-flags="--headless --no-sandbox" --quiet`,
            { timeout: 90000, maxBuffer: 10 * 1024 * 1024 }
        ).toString()

        const data = JSON.parse(output)
        const score = Math.round(data.categories.performance.score * 100)
        const lcp = data.audits["largest-contentful-paint"]?.numericValue
        const fcp = data.audits["first-contentful-paint"]?.numericValue
        const si = data.audits["speed-index"]?.numericValue
        const tbt = data.audits["total-blocking-time"]?.numericValue
        const cls = data.audits["cumulative-layout-shift"]?.numericValue

        return { path, score, lcp: lcp / 1000, fcp: fcp / 1000, si: si / 1000, tbt, cls }
    } catch (err) {
        return { path, score: "ERR", lcp: "-", fcp: "-", si: "-", tbt: "-", cls: "-" }
    }
}

console.log(`Running Lighthouse on ${staticPages.length} pages...\n`)

for (let i = 0; i < staticPages.length; i++) {
    const path = staticPages[i]
    console.log(`[${i + 1}/${staticPages.length}] ${path}`)
    const result = runLighthouse(path)
    results.push(result)
    if (typeof result.score === "number") {
        console.log(`  Score: ${result.score}  LCP: ${result.lcp.toFixed(1)}s  SI: ${result.si.toFixed(1)}s  TBT: ${result.tbt}ms`)
    } else {
        console.log(`  ERROR`)
    }
}

// Sort by score ascending (worst first)
results.sort((a, b) => {
    if (typeof a.score !== "number") return -1
    if (typeof b.score !== "number") return 1
    return a.score - b.score
})

console.log("\n" + "=".repeat(100))
console.log("RESULTS (sorted by score, worst first)")
console.log("=".repeat(100))
console.log(
    "Page".padEnd(50) +
    "Score".padStart(6) +
    "LCP(s)".padStart(8) +
    "FCP(s)".padStart(8) +
    "SI(s)".padStart(8) +
    "TBT(ms)".padStart(8) +
    "CLS".padStart(8)
)
console.log("-".repeat(100))

for (const r of results) {
    const lcp = typeof r.lcp === "number" ? r.lcp.toFixed(1) : r.lcp
    const fcp = typeof r.fcp === "number" ? r.fcp.toFixed(1) : r.fcp
    const si = typeof r.si === "number" ? r.si.toFixed(1) : r.si
    const tbt = typeof r.tbt === "number" ? Math.round(r.tbt).toString() : r.tbt
    const cls = typeof r.cls === "number" ? r.cls.toFixed(3) : r.cls
    console.log(
        r.path.padEnd(50) +
        String(r.score).padStart(6) +
        lcp.padStart(8) +
        fcp.padStart(8) +
        si.padStart(8) +
        tbt.padStart(8) +
        cls.padStart(8)
    )
}

// Save raw results
writeFileSync("/tmp/lighthouse-all-pages.json", JSON.stringify(results, null, 2))
console.log("\nRaw results saved to /tmp/lighthouse-all-pages.json")
