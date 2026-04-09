/**
 * RTF Sponsor Horse Scraper
 *
 * Scrapes horse data from the old WordPress site sponsor pages
 * (e.g. https://returntofreedom.org/donate1/sponsor/blaine/) and saves
 * them to JSON for later import into Convex.
 *
 * Usage: yarn scrape:horses
 */

import * as fs from "fs/promises"
import * as path from "path"
import * as cheerio from "cheerio"

const BASE = "https://returntofreedom.org"
const INDEX_URL = `${BASE}/donate1/sponsor/`
const SITEMAP_URL = `${BASE}/page-sitemap.xml`
const OUTPUT_DIR = "./output"
const OUTPUT_FILE = path.join(OUTPUT_DIR, "horses.json")
const HERDS_FILE = path.join(OUTPUT_DIR, "herds-to-handle.json")
const PROGRESS_FILE = path.join(OUTPUT_DIR, "horses-scrape-progress.json")
const DELAY_MS = 250
const MAX_RETRIES = 3

// Slugs that should be routed to the herds table, not animals — handle manually.
const KNOWN_HERD_SLUGS = new Set(["thegilaherd", "thesilverkingherd"])

type ScrapedHorse = {
    slug: string
    sourceUrl: string
    name: string
    excerpt: string
    bioHtml: string
    heroImageUrl: string | null
    galleryImageUrls: string[]
}

type ScrapeProgress = {
    discoveredSlugs: string[]
    completedSlugs: string[]
    failedSlugs: string[]
}

const log = (msg: string) => {
    console.log(`[${new Date().toISOString()}] ${msg}`)
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const fetchText = async (url: string, retries = MAX_RETRIES): Promise<string> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, {
                headers: { "user-agent": "rtf-migration-scraper/1.0" },
            })
            if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
            return await res.text()
        } catch (err) {
            if (attempt === retries) throw err
            log(`  retry ${attempt}/${retries}: ${url} (${err})`)
            await delay(1000 * attempt)
        }
    }
    throw new Error("unreachable")
}

const loadProgress = async (): Promise<ScrapeProgress> => {
    try {
        return JSON.parse(await fs.readFile(PROGRESS_FILE, "utf-8"))
    } catch {
        return { discoveredSlugs: [], completedSlugs: [], failedSlugs: [] }
    }
}

const saveProgress = async (p: ScrapeProgress) => {
    await fs.writeFile(PROGRESS_FILE, JSON.stringify(p, null, 2))
}

const loadHorses = async (): Promise<ScrapedHorse[]> => {
    try {
        return JSON.parse(await fs.readFile(OUTPUT_FILE, "utf-8"))
    } catch {
        return []
    }
}

const saveHorses = async (horses: ScrapedHorse[]) => {
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(horses, null, 2))
}

const extractSlugFromUrl = (url: string): string | null => {
    const m = url.match(/\/donate1\/sponsor\/([^/]+)\/?$/)
    return m ? m[1] : null
}

const discoverSlugs = async (): Promise<string[]> => {
    const found = new Set<string>()

    // 1. Index page
    log("Discovering slugs from index page...")
    try {
        const html = await fetchText(INDEX_URL)
        const $ = cheerio.load(html)
        $(`a[href*="/donate1/sponsor/"]`).each((_, el) => {
            const href = $(el).attr("href") || ""
            const slug = extractSlugFromUrl(href)
            if (slug && slug !== "") found.add(slug)
        })
        log(`  found ${found.size} slugs from index`)
    } catch (err) {
        log(`  index discovery failed: ${err}`)
    }

    // 2. Page sitemap (catches legacy/unlisted pages)
    log("Discovering slugs from page-sitemap.xml...")
    try {
        const xml = await fetchText(SITEMAP_URL)
        const matches = xml.matchAll(/<loc>([^<]*\/donate1\/sponsor\/[^<]+)<\/loc>/g)
        let added = 0
        for (const m of matches) {
            const slug = extractSlugFromUrl(m[1])
            if (slug && !found.has(slug)) {
                found.add(slug)
                added++
            }
        }
        log(`  added ${added} additional slugs from sitemap`)
    } catch (err) {
        log(`  sitemap discovery failed: ${err}`)
    }

    return Array.from(found).sort()
}

const scrapeHorse = async (slug: string): Promise<ScrapedHorse | null> => {
    const url = `${BASE}/donate1/sponsor/${slug}/`
    const html = await fetchText(url)
    const $ = cheerio.load(html)

    // Name: prefer h3#custom-title-h3-2, fall back to <title>
    let name = $("h3#custom-title-h3-2").first().text().trim()
    if (name) {
        name = name.replace(/^Meet\s+/i, "").trim()
    }
    if (!name) {
        const title = $("title").first().text().trim()
        name = title.replace(/\s*-\s*Return to Freedom\s*$/i, "").trim()
    }
    if (!name) {
        log(`  ${slug}: no name found`)
        return null
    }

    // Excerpt: Yoast og:description
    const excerpt = ($(`meta[property="og:description"]`).attr("content") || "").trim()

    // Bio: first #the-content .auto-format
    const bioContainer = $("#the-content .auto-format").first().clone()
    // Strip nested image wraps so the hero image isn't duplicated in content
    bioContainer.find(".ui--image-wrap").remove()
    bioContainer.find(".ui--gallery").remove()
    const bioHtml = bioContainer.html()?.trim() || ""

    // Hero image: prefer the linked full-size, else the img src
    let heroImageUrl: string | null = null
    const heroAnchor = $("#the-content .ui--image-wrap a[href]").first()
    if (heroAnchor.length) {
        heroImageUrl = heroAnchor.attr("href") || null
    }
    if (!heroImageUrl) {
        heroImageUrl = $("#the-content .ui--image-wrap img.ui--image").first().attr("src") || null
    }

    // Gallery: full-size hrefs from prettyPhoto links
    const galleryImageUrls: string[] = []
    $(`.ui--gallery .ui--gallery-item a[data-rel^="prettyPhoto"]`).each((_, el) => {
        const href = $(el).attr("href")
        if (href && href !== heroImageUrl && !galleryImageUrls.includes(href)) {
            galleryImageUrls.push(href)
        }
    })

    return {
        slug,
        sourceUrl: url,
        name,
        excerpt,
        bioHtml,
        heroImageUrl,
        galleryImageUrls,
    }
}

const main = async () => {
    log("=".repeat(60))
    log("RTF Sponsor Horse Scraper")
    log("=".repeat(60))

    await fs.mkdir(OUTPUT_DIR, { recursive: true })

    const progress = await loadProgress()
    const horses = await loadHorses()
    const horsesBySlug = new Map(horses.map((h) => [h.slug, h]))

    // Discover slugs (always re-discover; cheap and idempotent)
    let slugs = await discoverSlugs()
    progress.discoveredSlugs = slugs
    log(`Total discovered slugs: ${slugs.length}`)

    // Separate herds for manual review
    const herdSlugs = slugs.filter((s) => KNOWN_HERD_SLUGS.has(s))
    if (herdSlugs.length > 0) {
        await fs.writeFile(HERDS_FILE, JSON.stringify(herdSlugs, null, 2))
        log(`Wrote ${herdSlugs.length} herd slugs to ${HERDS_FILE} for manual review`)
    }
    slugs = slugs.filter((s) => !KNOWN_HERD_SLUGS.has(s))

    const completed = new Set(progress.completedSlugs)
    const todo = slugs.filter((s) => !completed.has(s))
    log(`To scrape: ${todo.length} (already done: ${completed.size})`)

    let success = 0
    let failed = 0
    for (let i = 0; i < todo.length; i++) {
        const slug = todo[i]
        log(`[${i + 1}/${todo.length}] ${slug}`)
        try {
            const horse = await scrapeHorse(slug)
            if (!horse) {
                failed++
                progress.failedSlugs.push(slug)
                continue
            }
            horsesBySlug.set(slug, horse)
            progress.completedSlugs.push(slug)
            success++
            log(`  ${horse.name} — bio:${horse.bioHtml.length}b, gallery:${horse.galleryImageUrls.length}`)
        } catch (err) {
            failed++
            progress.failedSlugs.push(slug)
            log(`  ERROR: ${err}`)
        }

        // Save progress every 5 horses
        if ((i + 1) % 5 === 0 || i === todo.length - 1) {
            await saveHorses(Array.from(horsesBySlug.values()))
            await saveProgress(progress)
        }
        await delay(DELAY_MS)
    }

    log("=".repeat(60))
    log(`Done. Success: ${success}, Failed: ${failed}, Total: ${horsesBySlug.size}`)
    log(`Output: ${OUTPUT_FILE}`)
    log("=".repeat(60))
}

main().catch((err) => {
    console.error("Fatal:", err)
    process.exit(1)
})
