/**
 * WordPress News Article Scraper for RTF Migration
 *
 * Scrapes all news articles from the old WordPress site using the REST API
 * and saves them to JSON files for later import into Convex.
 *
 * Usage: yarn scrape
 */

import * as fs from "fs/promises"
import * as path from "path"

const BASE_URL = "https://returntofreedom.org/wp-json/wp/v2"
const OUTPUT_DIR = "./output"
const DELAY_MS = 200 // Delay between requests to be respectful
const MAX_RETRIES = 3
const PER_PAGE = 100

// Types for WordPress API responses
type WPCategory = {
    id: number
    name: string
    slug: string
    description: string
    count: number
    parent: number
}

type WPUser = {
    id: number
    name: string
    slug: string
    description: string
    avatar_urls: Record<string, string>
}

type WPMedia = {
    id: number
    source_url: string
    alt_text: string
    caption: { rendered: string }
    media_details: {
        width: number
        height: number
        sizes?: Record<string, { source_url: string; width: number; height: number }>
    }
    title: { rendered: string }
}

type WPPost = {
    id: number
    slug: string
    link: string
    title: { rendered: string }
    content: { rendered: string }
    excerpt: { rendered: string }
    date: string
    modified: string
    author: number
    categories: number[]
    tags: number[]
    featured_media: number
    status: string
}

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

type ProgressState = {
    categoriesDone: boolean
    usersDone: boolean
    lastPostPage: number
    totalPostPages: number
    failedMediaIds: number[]
}

// Utility functions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const log = (message: string) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${message}`)
}

const fetchWithRetry = async <T>(url: string, retries = MAX_RETRIES): Promise<{ data: T; headers: Headers }> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            const data = (await response.json()) as T
            return { data, headers: response.headers }
        } catch (error) {
            if (attempt === retries) {
                throw error
            }
            log(`Attempt ${attempt} failed for ${url}, retrying...`)
            await delay(1000 * attempt) // Exponential backoff
        }
    }
    throw new Error("Max retries exceeded")
}

const loadProgress = async (): Promise<ProgressState> => {
    const progressPath = path.join(OUTPUT_DIR, "progress.json")
    try {
        const data = await fs.readFile(progressPath, "utf-8")
        return JSON.parse(data)
    } catch {
        return {
            categoriesDone: false,
            usersDone: false,
            lastPostPage: 0,
            totalPostPages: 0,
            failedMediaIds: [],
        }
    }
}

const saveProgress = async (progress: ProgressState) => {
    const progressPath = path.join(OUTPUT_DIR, "progress.json")
    await fs.writeFile(progressPath, JSON.stringify(progress, null, 2))
}

// Scraping functions
const fetchAllCategories = async (): Promise<Map<number, WPCategory>> => {
    log("Fetching categories...")
    const categories = new Map<number, WPCategory>()
    let page = 1
    let totalPages = 1

    while (page <= totalPages) {
        const url = `${BASE_URL}/categories?per_page=${PER_PAGE}&page=${page}`
        const { data, headers } = await fetchWithRetry<WPCategory[]>(url)

        for (const cat of data) {
            categories.set(cat.id, cat)
        }

        if (page === 1) {
            totalPages = parseInt(headers.get("X-WP-TotalPages") || "1", 10)
            log(`Found ${headers.get("X-WP-Total")} categories across ${totalPages} pages`)
        }

        page++
        await delay(DELAY_MS)
    }

    return categories
}

const fetchAllUsers = async (): Promise<Map<number, WPUser>> => {
    log("Fetching users/authors...")
    const users = new Map<number, WPUser>()
    let page = 1
    let totalPages = 1

    while (page <= totalPages) {
        const url = `${BASE_URL}/users?per_page=${PER_PAGE}&page=${page}`
        const { data, headers } = await fetchWithRetry<WPUser[]>(url)

        for (const user of data) {
            users.set(user.id, user)
        }

        if (page === 1) {
            totalPages = parseInt(headers.get("X-WP-TotalPages") || "1", 10)
            log(`Found ${headers.get("X-WP-Total")} users across ${totalPages} pages`)
        }

        page++
        await delay(DELAY_MS)
    }

    return users
}

const fetchMedia = async (mediaId: number): Promise<WPMedia | null> => {
    if (!mediaId) return null

    try {
        const url = `${BASE_URL}/media/${mediaId}`
        const { data } = await fetchWithRetry<WPMedia>(url)
        return data
    } catch (error) {
        log(`Failed to fetch media ${mediaId}: ${error}`)
        return null
    }
}

const fetchAllPosts = async (
    categories: Map<number, WPCategory>,
    users: Map<number, WPUser>,
    progress: ProgressState
): Promise<ScrapedArticle[]> => {
    log("Fetching posts...")
    const articles: ScrapedArticle[] = []

    // Load existing articles if resuming
    const articlesPath = path.join(OUTPUT_DIR, "articles.json")
    if (progress.lastPostPage > 0) {
        try {
            const existing = await fs.readFile(articlesPath, "utf-8")
            articles.push(...JSON.parse(existing))
            log(`Resuming from page ${progress.lastPostPage + 1}, ${articles.length} articles already scraped`)
        } catch {
            log("Could not load existing articles, starting fresh")
            progress.lastPostPage = 0
        }
    }

    let page = progress.lastPostPage + 1
    let totalPages = progress.totalPostPages || 1

    while (page <= totalPages) {
        const url = `${BASE_URL}/posts?per_page=${PER_PAGE}&page=${page}&_embed`
        log(`Fetching posts page ${page}/${totalPages}...`)

        try {
            const { data: posts, headers } = await fetchWithRetry<WPPost[]>(url)

            if (page === 1 || totalPages === 1) {
                totalPages = parseInt(headers.get("X-WP-TotalPages") || "1", 10)
                progress.totalPostPages = totalPages
                log(`Found ${headers.get("X-WP-Total")} posts across ${totalPages} pages`)
            }

            for (const post of posts) {
                // Fetch featured image if present
                let featuredImage: ScrapedArticle["featuredImage"] = null
                if (post.featured_media) {
                    const media = await fetchMedia(post.featured_media)
                    if (media) {
                        featuredImage = {
                            url: media.source_url,
                            altText: media.alt_text || "",
                            caption: media.caption?.rendered || "",
                            width: media.media_details?.width || 0,
                            height: media.media_details?.height || 0,
                            title: media.title?.rendered || "",
                        }
                    } else {
                        progress.failedMediaIds.push(post.featured_media)
                    }
                    await delay(DELAY_MS)
                }

                const article: ScrapedArticle = {
                    wpId: post.id,
                    slug: post.slug,
                    link: post.link,
                    title: post.title.rendered,
                    content: post.content.rendered,
                    excerpt: post.excerpt.rendered,
                    date: post.date,
                    modified: post.modified,
                    authorId: post.author,
                    authorName: users.get(post.author)?.name || "Unknown",
                    categoryIds: post.categories,
                    categoryNames: post.categories.map((id) => categories.get(id)?.name || "Unknown"),
                    tagIds: post.tags,
                    featuredMediaId: post.featured_media,
                    featuredImage,
                }

                articles.push(article)
            }

            // Save progress after each page
            progress.lastPostPage = page
            await saveProgress(progress)
            await fs.writeFile(articlesPath, JSON.stringify(articles, null, 2))
            log(`Saved ${articles.length} articles so far`)
        } catch (error) {
            log(`Error on page ${page}: ${error}`)
            log("Progress saved, you can resume by running the script again")
            throw error
        }

        page++
        await delay(DELAY_MS)
    }

    return articles
}

const main = async () => {
    log("Starting RTF WordPress scraper...")

    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true })

    // Load progress for resumable scraping
    const progress = await loadProgress()

    // Fetch categories
    let categories: Map<number, WPCategory>
    const categoriesPath = path.join(OUTPUT_DIR, "categories.json")

    if (progress.categoriesDone) {
        log("Loading cached categories...")
        const data = await fs.readFile(categoriesPath, "utf-8")
        const arr = JSON.parse(data) as WPCategory[]
        categories = new Map(arr.map((c) => [c.id, c]))
    } else {
        categories = await fetchAllCategories()
        await fs.writeFile(categoriesPath, JSON.stringify(Array.from(categories.values()), null, 2))
        progress.categoriesDone = true
        await saveProgress(progress)
        log(`Saved ${categories.size} categories`)
    }

    // Fetch users/authors
    let users: Map<number, WPUser>
    const usersPath = path.join(OUTPUT_DIR, "authors.json")

    if (progress.usersDone) {
        log("Loading cached authors...")
        const data = await fs.readFile(usersPath, "utf-8")
        const arr = JSON.parse(data) as WPUser[]
        users = new Map(arr.map((u) => [u.id, u]))
    } else {
        users = await fetchAllUsers()
        await fs.writeFile(usersPath, JSON.stringify(Array.from(users.values()), null, 2))
        progress.usersDone = true
        await saveProgress(progress)
        log(`Saved ${users.size} authors`)
    }

    // Fetch all posts
    const articles = await fetchAllPosts(categories, users, progress)

    // Final summary
    log("=".repeat(50))
    log("Scraping complete!")
    log(`Total articles: ${articles.length}`)
    log(`Total categories: ${categories.size}`)
    log(`Total authors: ${users.size}`)
    log(`Articles with featured images: ${articles.filter((a) => a.featuredImage).length}`)
    if (progress.failedMediaIds.length > 0) {
        log(`Failed media fetches: ${progress.failedMediaIds.length}`)
        await fs.writeFile(
            path.join(OUTPUT_DIR, "failed-media.json"),
            JSON.stringify(progress.failedMediaIds, null, 2)
        )
    }
    log("=".repeat(50))
    log("Output files:")
    log(`  - ${OUTPUT_DIR}/articles.json`)
    log(`  - ${OUTPUT_DIR}/categories.json`)
    log(`  - ${OUTPUT_DIR}/authors.json`)
    if (progress.failedMediaIds.length > 0) {
        log(`  - ${OUTPUT_DIR}/failed-media.json`)
    }
}

main().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
})
