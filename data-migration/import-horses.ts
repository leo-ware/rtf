/**
 * RTF Sponsor Horse Importer
 *
 * Reads scraped horses from output/horses.json and imports them into Convex.
 * Uploads hero + gallery images to Convex storage and creates animal records.
 *
 * Usage:
 *   yarn import:horses                  # import all
 *   yarn import:horses --limit 1        # just one (testing)
 *   yarn import:horses --limit 5
 *   yarn import:horses --offset 10
 *   yarn import:horses --prod           # target production
 *
 * Resumable: tracks imported slugs in output/horses-import-progress.json.
 */

import * as fs from "fs/promises"
import * as path from "path"
import { ConvexHttpClient } from "convex/browser"
import { anyApi } from "convex/server"

const CONVEX_DEV_URL = "https://careful-panda-154.convex.cloud"
const CONVEX_PROD_URL = "https://descriptive-clam-596.convex.cloud"
const isProd = process.argv.includes("--prod")
const CONVEX_URL = isProd ? CONVEX_PROD_URL : CONVEX_DEV_URL
const OUTPUT_DIR = "./output"
const HORSES_FILE = path.join(OUTPUT_DIR, "horses.json")
const PROGRESS_FILE = path.join(OUTPUT_DIR, "horses-import-progress.json")
const IMAGE_CACHE_FILE = path.join(OUTPUT_DIR, "horses-image-cache.json")

const client = new ConvexHttpClient(CONVEX_URL)
const api = anyApi

type ScrapedHorse = {
    slug: string
    sourceUrl: string
    name: string
    excerpt: string
    bioHtml: string
    heroImageUrl: string | null
    galleryImageUrls: string[]
}

type ImportProgress = {
    importedSlugs: string[]
    failedSlugs: string[]
}

const log = (msg: string) => {
    console.log(`[${new Date().toISOString()}] ${msg}`)
}

const loadProgress = async (): Promise<ImportProgress> => {
    try {
        return JSON.parse(await fs.readFile(PROGRESS_FILE, "utf-8"))
    } catch {
        return { importedSlugs: [], failedSlugs: [] }
    }
}

const saveProgress = async (p: ImportProgress) => {
    await fs.writeFile(PROGRESS_FILE, JSON.stringify(p, null, 2))
}

const loadImageCache = async (): Promise<Record<string, string>> => {
    try {
        return JSON.parse(await fs.readFile(IMAGE_CACHE_FILE, "utf-8"))
    } catch {
        return {}
    }
}

const saveImageCache = async (cache: Record<string, string>) => {
    await fs.writeFile(IMAGE_CACHE_FILE, JSON.stringify(cache, null, 2))
}

const normalizeImageUrl = (url: string): string => {
    try {
        const u = new URL(url)
        const ext = path.extname(u.pathname)
        const base = u.pathname
            .replace(ext, "")
            .replace(/-scaled$/, "")
            .replace(/-e\d+$/, "")
            .replace(/-\d+x\d+$/, "")
        return `${u.origin}${base}${ext}`
    } catch {
        return url
    }
}

const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

let imageCache: Record<string, string> = {}

const downloadImage = async (
    url: string
): Promise<{ blob: Blob; contentType: string; size: number } | null> => {
    try {
        const res = await fetch(url, {
            headers: { "user-agent": "rtf-migration-importer/1.0" },
        })
        if (!res.ok) {
            log(`  image download failed: ${res.status} ${url}`)
            return null
        }
        const contentType = res.headers.get("content-type") || "image/jpeg"
        const blob = await res.blob()
        return { blob, contentType, size: blob.size }
    } catch (err) {
        log(`  image download error: ${err}`)
        return null
    }
}

const uploadImage = async (
    sourceUrl: string,
    altText: string
): Promise<string | null> => {
    try {
        const normalized = normalizeImageUrl(sourceUrl)
        if (imageCache[normalized]) {
            return imageCache[normalized]
        }

        const downloaded = await downloadImage(sourceUrl)
        if (!downloaded) return null

        const uploadUrl = await client.mutation(api.migration.importGetUploadUrl, {})

        const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": downloaded.contentType },
            body: downloaded.blob,
        })
        if (!uploadRes.ok) {
            log(`  upload to convex failed: ${uploadRes.status}`)
            return null
        }
        const { storageId } = (await uploadRes.json()) as { storageId: string }

        const fileName = path.basename(new URL(sourceUrl).pathname)

        const imageId = (await client.mutation(api.migration.importCreateImage, {
            storageId,
            fileName,
            originalName: fileName,
            title: altText || fileName,
            mimeType: downloaded.contentType,
            size: downloaded.size,
            altText: altText || undefined,
        })) as string

        imageCache[normalized] = imageId
        return imageId
    } catch (err) {
        log(`  uploadImage error: ${err}`)
        return null
    }
}

const buildDescription = (horse: ScrapedHorse): string => {
    if (horse.excerpt && horse.excerpt.length > 0) return horse.excerpt
    const stripped = stripHtml(horse.bioHtml)
    if (stripped.length <= 250) return stripped
    return stripped.slice(0, 247).trimEnd() + "..."
}

const importHorse = async (
    horse: ScrapedHorse,
    index: number,
    total: number
): Promise<boolean> => {
    log(`[${index + 1}/${total}] ${horse.name} (${horse.slug})`)

    if (!horse.heroImageUrl) {
        log(`  no hero image, skipping`)
        return false
    }

    try {
        // Resolve final slug (append suffix if collision)
        let slug = horse.slug
        const exists = (await client.mutation(api.migration.importCheckAnimalSlugExists, {
            slug,
        })) as boolean
        if (exists) {
            slug = `${slug}-import`
            log(`  slug collision, using "${slug}"`)
        }

        // Hero image
        const heroImageId = await uploadImage(horse.heroImageUrl, horse.name)
        if (!heroImageId) {
            log(`  hero image upload failed, skipping`)
            return false
        }

        // Gallery images → upload + wrap in galleryItems
        const galleryItemIds: string[] = []
        for (const url of horse.galleryImageUrls) {
            const imgId = await uploadImage(url, horse.name)
            if (!imgId) {
                log(`  gallery image upload failed (continuing): ${url}`)
                continue
            }
            const itemId = (await client.mutation(api.migration.importCreateGalleryItem, {
                imageId: imgId,
            })) as string
            galleryItemIds.push(itemId)
        }

        const description = buildDescription(horse)

        const animalId = (await client.mutation(api.migration.importCreateAnimal, {
            name: horse.name,
            slug,
            type: "horse",
            description,
            content: horse.bioHtml || undefined,
            imageId: heroImageId,
            gallery: galleryItemIds.length > 0 ? galleryItemIds : undefined,
        })) as string

        log(`  created animal ${animalId} (gallery: ${galleryItemIds.length})`)
        return true
    } catch (err) {
        log(`  ERROR: ${err}`)
        return false
    }
}

const main = async () => {
    const args = process.argv.slice(2)
    let limit = Infinity
    let offset = 0
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--limit" && args[i + 1]) {
            limit = parseInt(args[i + 1], 10)
            i++
        }
        if (args[i] === "--offset" && args[i + 1]) {
            offset = parseInt(args[i + 1], 10)
            i++
        }
    }

    log("=".repeat(60))
    log(`RTF Horse Importer (${isProd ? "PRODUCTION" : "dev"})`)
    log(`Target: ${CONVEX_URL}`)
    log(`Limit: ${limit === Infinity ? "all" : limit}, Offset: ${offset}`)
    log("=".repeat(60))

    const horses: ScrapedHorse[] = JSON.parse(await fs.readFile(HORSES_FILE, "utf-8"))
    log(`Loaded ${horses.length} scraped horses`)

    imageCache = await loadImageCache()
    log(`Image cache: ${Object.keys(imageCache).length} entries`)

    const progress = await loadProgress()
    const importedSet = new Set(progress.importedSlugs)
    log(`Already imported: ${importedSet.size}`)

    const toImport = horses
        .slice(offset)
        .filter((h) => !importedSet.has(h.slug))
        .slice(0, limit)
    log(`To import: ${toImport.length}\n`)

    let success = 0
    let failed = 0
    for (let i = 0; i < toImport.length; i++) {
        const horse = toImport[i]
        const ok = await importHorse(horse, i, toImport.length)
        if (ok) {
            success++
            progress.importedSlugs.push(horse.slug)
        } else {
            failed++
            progress.failedSlugs.push(horse.slug)
        }
        if ((i + 1) % 5 === 0 || i === toImport.length - 1) {
            await saveProgress(progress)
            await saveImageCache(imageCache)
        }
    }

    log("\n" + "=".repeat(60))
    log(`Done. Success: ${success}, Failed: ${failed}`)
    log(`Total imported so far: ${progress.importedSlugs.length}`)
    log("=".repeat(60))
}

main().catch((err) => {
    console.error("Fatal:", err)
    process.exit(1)
})
