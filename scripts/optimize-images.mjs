#!/usr/bin/env node

/**
 * One-time script to optimize static images in the repository.
 * Resizes images to max 2400px wide and compresses to quality 80.
 * PNGs are converted to JPEG (unless they have transparency).
 *
 * Usage: node scripts/optimize-images.mjs [--dry-run]
 */

import sharp from "sharp"
import { readdir, stat, mkdir, rename } from "fs/promises"
import { join, extname, basename, dirname } from "path"
import { existsSync } from "fs"

const MAX_WIDTH = 3840
const JPEG_QUALITY = 90
const MIN_SIZE_BYTES = 500 * 1024 // Only optimize files > 500KB
const DRY_RUN = process.argv.includes("--dry-run")
const BACKUP_DIR = join(process.cwd(), ".image-backups")

const DIRS_TO_SCAN = [
    join(process.cwd(), "public/img"),
    join(process.cwd(), "app"),
]

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

const results = {
    processed: 0,
    skipped: 0,
    errors: 0,
    totalSavedBytes: 0,
}

const findImages = async (dir) => {
    const images = []
    let entries
    try {
        entries = await readdir(dir, { withFileTypes: true })
    } catch {
        return images
    }
    for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
            images.push(...(await findImages(fullPath)))
        } else if (entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
            images.push(fullPath)
        }
    }
    return images
}

const optimizeImage = async (filePath) => {
    const fileStats = await stat(filePath)
    if (fileStats.size < MIN_SIZE_BYTES) {
        results.skipped++
        return
    }

    const ext = extname(filePath).toLowerCase()
    const relativePath = filePath.replace(process.cwd() + "/", "")

    try {
        const image = sharp(filePath)
        const metadata = await image.metadata()

        if (!metadata.width || !metadata.height) {
            results.skipped++
            return
        }

        // Skip SVGs that somehow got through
        if (metadata.format === "svg") {
            results.skipped++
            return
        }

        // Check if PNG has alpha channel (transparency)
        const hasAlpha = metadata.hasAlpha && ext === ".png"

        // Determine if we need to resize
        const needsResize = metadata.width > MAX_WIDTH

        // Build the processing pipeline
        let pipeline = sharp(filePath)

        if (needsResize) {
            pipeline = pipeline.resize(MAX_WIDTH, null, {
                withoutEnlargement: true,
                fit: "inside",
            })
        }

        let outputBuffer

        if (ext === ".png") {
            // Keep PNGs as PNGs to avoid breaking imports
            outputBuffer = await pipeline
                .png({ compressionLevel: 9, palette: !hasAlpha })
                .toBuffer()
        } else {
            // JPEG/WebP - compress as JPEG
            outputBuffer = await pipeline
                .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
                .toBuffer()
        }

        const savedBytes = fileStats.size - outputBuffer.length
        const savingsPercent = ((savedBytes / fileStats.size) * 100).toFixed(1)

        // Only save if we actually reduced size meaningfully (> 10%)
        if (savedBytes < fileStats.size * 0.1) {
            console.log(`  SKIP ${relativePath} (only ${savingsPercent}% savings)`)
            results.skipped++
            return
        }

        const originalSize = (fileStats.size / 1024 / 1024).toFixed(1)
        const newSize = (outputBuffer.length / 1024 / 1024).toFixed(1)

        if (DRY_RUN) {
            console.log(`  [DRY] ${relativePath}: ${originalSize}MB -> ${newSize}MB (${savingsPercent}% saved)`)
        } else {
            // Backup original
            const backupPath = join(BACKUP_DIR, relativePath)
            await mkdir(dirname(backupPath), { recursive: true })
            await rename(filePath, backupPath)

            await sharp(outputBuffer).toFile(filePath)
            console.log(`  OK ${relativePath}: ${originalSize}MB -> ${newSize}MB (${savingsPercent}% saved)`)
        }

        results.processed++
        results.totalSavedBytes += savedBytes

    } catch (err) {
        console.error(`  ERR ${relativePath}: ${err.message}`)
        results.errors++
    }
}

const main = async () => {
    console.log(DRY_RUN ? "=== DRY RUN ===" : "=== Optimizing images ===")
    console.log(`Max width: ${MAX_WIDTH}px, JPEG quality: ${JPEG_QUALITY}`)
    console.log(`Min file size: ${MIN_SIZE_BYTES / 1024}KB`)
    console.log("")

    if (!DRY_RUN && !existsSync(BACKUP_DIR)) {
        await mkdir(BACKUP_DIR, { recursive: true })
    }

    for (const dir of DIRS_TO_SCAN) {
        console.log(`Scanning ${dir}...`)
        const images = await findImages(dir)
        console.log(`Found ${images.length} image files`)

        for (const img of images) {
            await optimizeImage(img)
        }
        console.log("")
    }

    const totalSavedMB = (results.totalSavedBytes / 1024 / 1024).toFixed(1)
    console.log("=== Results ===")
    console.log(`Processed: ${results.processed}`)
    console.log(`Skipped: ${results.skipped}`)
    console.log(`Errors: ${results.errors}`)
    console.log(`Total saved: ${totalSavedMB}MB`)

    if (!DRY_RUN) {
        console.log(`\nOriginals backed up to: ${BACKUP_DIR}`)
        console.log("Review the changes, then delete the backup directory when satisfied.")
    }
}

main().catch(console.error)
