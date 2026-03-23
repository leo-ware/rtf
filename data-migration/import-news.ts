/**
 * WordPress News Article Importer
 *
 * Reads scraped articles from output/articles.json and imports them into Convex.
 * Maps WordPress categories to Convex category enum and tags.
 *
 * Usage:
 *   yarn import                  # import all articles
 *   yarn import --limit 1        # import just 1 article (for testing)
 *   yarn import --limit 10       # import first 10
 *   yarn import --offset 100     # skip first 100
 *
 * Resumable: tracks imported slugs in output/import-progress.json.
 * On restart, already-imported articles are skipped automatically.
 */

import * as fs from "fs/promises"
import * as path from "path"
import { ConvexHttpClient } from "convex/browser"
import { anyApi } from "convex/server"

const CONVEX_URL = "https://careful-panda-154.convex.cloud"
const OUTPUT_DIR = "./output"
const PROGRESS_FILE = path.join(OUTPUT_DIR, "import-progress.json")
const TAG_MAP_FILE = path.join(OUTPUT_DIR, "tag-map.json")

const client = new ConvexHttpClient(CONVEX_URL)
const api = anyApi

// --- Types ---

type ScrapedArticle = {
    wpId: number
    slug: string
    link: string
    title: string
    content: string
    excerpt: string
    date: string
    modified: string
    authorId: number
    authorName: string
    categoryIds: number[]
    categoryNames: string[]
    tagIds: number[]
    featuredMediaId: number
    featuredImage: {
        url: string
        altText: string
        caption: string
        width: number
        height: number
        title: string
    } | null
}

type WPCategory = {
    id: number
    name: string
    slug: string
    count: number
}

type CategoryEnum = "featured_news" | "rtf_e_news" | "field_notes" | "press_release"

type ImportProgress = {
    importedSlugs: string[]
    failedSlugs: string[]
}

// --- Category Mapping ---

// WP category IDs → Convex category enum
const CATEGORY_MAP: Record<number, CategoryEnum> = {
    1: "featured_news",      // Featured
    49: "rtf_e_news",        // eNews
    133: "field_notes",      // Staff Blog
    28: "field_notes",       // Neda's Blog
    32: "field_notes",       // Our Blog
    27: "press_release",     // Press Releases
}

// Priority: most specific wins
const CATEGORY_PRIORITY: CategoryEnum[] = [
    "press_release",
    "rtf_e_news",
    "field_notes",
    "featured_news",
]

// WP category IDs to skip (structural, not meaningful as tags)
const SKIP_TAG_IDS = new Set([
    40,  // News (1488 articles — nearly all)
    24,  // In The News (1586)
    1,   // Featured (maps to category instead)
    42,  // Home Feature
    26,  // Ticker
    61,  // Headlines
    9,   // Uncategorized
    60,  // Calendar
    95,  // Store
    71,  // WHN Wild Horses
    152, // AIP
    68,  // Population
])

// WP categories that map to the category enum — don't also create as tags
const CATEGORY_ENUM_IDS = new Set(Object.keys(CATEGORY_MAP).map(Number))

// --- Utilities ---

const log = (msg: string) => {
    console.log(`[${new Date().toISOString()}] ${msg}`)
}

const loadProgress = async (): Promise<ImportProgress> => {
    try {
        const data = await fs.readFile(PROGRESS_FILE, "utf-8")
        return JSON.parse(data)
    } catch {
        return { importedSlugs: [], failedSlugs: [] }
    }
}

const saveProgress = async (progress: ImportProgress) => {
    await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2))
}

const loadTagMap = async (): Promise<Record<string, string>> => {
    try {
        const data = await fs.readFile(TAG_MAP_FILE, "utf-8")
        return JSON.parse(data)
    } catch {
        return {}
    }
}

const saveTagMap = async (tagMap: Record<string, string>) => {
    await fs.writeFile(TAG_MAP_FILE, JSON.stringify(tagMap, null, 2))
}

const slugify = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/&amp;/g, "and")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim()
}

const determineCategory = (categoryIds: number[]): CategoryEnum | undefined => {
    for (const priority of CATEGORY_PRIORITY) {
        for (const catId of categoryIds) {
            if (CATEGORY_MAP[catId] === priority) {
                return priority
            }
        }
    }
    return undefined
}

const getTagCategoryIds = (categoryIds: number[]): number[] => {
    return categoryIds.filter(id => !SKIP_TAG_IDS.has(id) && !CATEGORY_ENUM_IDS.has(id))
}

// --- Image Upload ---

const downloadImage = async (url: string): Promise<{ blob: Blob, contentType: string, size: number } | null> => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            log(`  Image download failed: ${response.status} ${url}`)
            return null
        }
        const contentType = response.headers.get("content-type") || "image/jpeg"
        const blob = await response.blob()
        return { blob, contentType, size: blob.size }
    } catch (error) {
        log(`  Image download error: ${error}`)
        return null
    }
}

const uploadImage = async (
    imageData: { url: string, altText: string, width: number, height: number, title: string }
): Promise<string | null> => {
    try {
        // Download
        const downloaded = await downloadImage(imageData.url)
        if (!downloaded) return null

        // Get upload URL from Convex
        const uploadUrl = await client.mutation(api.migration.importGetUploadUrl, {})

        // Upload to Convex storage
        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": downloaded.contentType },
            body: downloaded.blob,
        })
        if (!uploadResponse.ok) {
            log(`  Upload to Convex failed: ${uploadResponse.status}`)
            return null
        }
        const { storageId } = await uploadResponse.json() as { storageId: string }

        // Extract filename from URL
        const urlPath = new URL(imageData.url).pathname
        const fileName = path.basename(urlPath)

        // Create image record
        const imageId = await client.mutation(api.migration.importCreateImage, {
            storageId,
            fileName,
            originalName: fileName,
            title: imageData.title || fileName,
            mimeType: downloaded.contentType,
            size: downloaded.size,
            altText: imageData.altText || undefined,
            width: imageData.width || undefined,
            height: imageData.height || undefined,
        })

        return imageId
    } catch (error) {
        log(`  Image upload error: ${error}`)
        return null
    }
}

// --- Main Import ---

const createTags = async (categories: WPCategory[]): Promise<Record<string, string>> => {
    // Load existing tag map
    const tagMap = await loadTagMap()

    // Filter to categories that should become tags
    const tagCategories = categories.filter(c =>
        !SKIP_TAG_IDS.has(c.id) && !CATEGORY_ENUM_IDS.has(c.id)
    )

    log(`Creating ${tagCategories.length} tags from WP categories...`)

    for (const cat of tagCategories) {
        const key = String(cat.id)
        if (tagMap[key]) {
            continue // Already created
        }

        const slug = slugify(cat.name)
        try {
            const tagId = await client.mutation(api.migration.importCreateTag, {
                name: cat.name,
                slug,
            })
            tagMap[key] = tagId
            log(`  Created tag: ${cat.name} → ${tagId}`)
        } catch (error) {
            log(`  Failed to create tag "${cat.name}": ${error}`)
        }
    }

    await saveTagMap(tagMap)
    log(`Tag map has ${Object.keys(tagMap).length} entries`)
    return tagMap
}

const importArticle = async (
    article: ScrapedArticle,
    tagMap: Record<string, string>,
    index: number,
    total: number,
): Promise<boolean> => {
    log(`[${index + 1}/${total}] Importing: ${article.title.substring(0, 60)}...`)

    try {
        // Check if slug already exists in Convex
        const exists = await client.mutation(api.migration.importCheckSlugExists, {
            slug: article.slug,
        })
        if (exists) {
            log(`  Slug "${article.slug}" already exists, appending wpId`)
            article.slug = `${article.slug}-${article.wpId}`
        }

        // Upload featured image
        let imageId: string | null = null
        if (article.featuredImage) {
            imageId = await uploadImage(article.featuredImage)
            if (imageId) {
                log(`  Image uploaded: ${imageId}`)
            } else {
                log(`  Image upload failed, skipping article (image required)`)
                return false
            }
        } else {
            log(`  No featured image, skipping article (image required)`)
            return false
        }

        // Determine category
        const category = determineCategory(article.categoryIds)

        // Collect tag IDs
        const tagCatIds = getTagCategoryIds(article.categoryIds)
        const convexTagIds = tagCatIds
            .map(id => tagMap[String(id)])
            .filter((id): id is string => !!id)

        // Clean excerpt (strip HTML tags)
        const excerpt = stripHtml(article.excerpt) || article.title

        // Create article
        const articleId = await client.mutation(api.migration.importArticle, {
            title: article.title,
            slug: article.slug,
            excerpt,
            content: article.content,
            date: new Date(article.date).getTime(),
            imageId,
            authorCredit: article.authorName !== "Unknown" ? article.authorName : undefined,
            tags: convexTagIds.length > 0 ? convexTagIds : undefined,
            category,
        })

        log(`  Created article: ${articleId} (category: ${category || "none"}, tags: ${convexTagIds.length})`)
        return true
    } catch (error) {
        log(`  ERROR: ${error}`)
        return false
    }
}

const main = async () => {
    // Parse CLI args
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
    log("WordPress → Convex Article Importer")
    log(`Limit: ${limit === Infinity ? "all" : limit}, Offset: ${offset}`)
    log("=".repeat(60))

    // Load data
    const articles: ScrapedArticle[] = JSON.parse(
        await fs.readFile(path.join(OUTPUT_DIR, "articles.json"), "utf-8")
    )
    const categories: WPCategory[] = JSON.parse(
        await fs.readFile(path.join(OUTPUT_DIR, "categories.json"), "utf-8")
    )

    log(`Loaded ${articles.length} articles, ${categories.length} categories`)

    // Load progress
    const progress = await loadProgress()
    const importedSet = new Set(progress.importedSlugs)
    log(`Already imported: ${importedSet.size} articles`)

    // Phase 1: Create tags
    const tagMap = await createTags(categories)

    // Phase 2: Import articles
    const toImport = articles
        .slice(offset)
        .filter(a => !importedSet.has(a.slug))
        .slice(0, limit)

    log(`\nImporting ${toImport.length} articles...`)

    let success = 0
    let failed = 0

    for (let i = 0; i < toImport.length; i++) {
        const article = toImport[i]
        const ok = await importArticle(article, tagMap, i, toImport.length)

        if (ok) {
            success++
            progress.importedSlugs.push(article.slug)
        } else {
            failed++
            progress.failedSlugs.push(article.slug)
        }

        // Save progress every 10 articles
        if ((i + 1) % 10 === 0 || i === toImport.length - 1) {
            await saveProgress(progress)
        }
    }

    // Final summary
    log("\n" + "=".repeat(60))
    log("Import complete!")
    log(`  Success: ${success}`)
    log(`  Failed: ${failed}`)
    log(`  Total imported so far: ${progress.importedSlugs.length}`)
    log("=".repeat(60))
}

main().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
})
