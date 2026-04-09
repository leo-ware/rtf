/**
 * Static redirects from old WordPress paths to their new-site equivalents.
 * Used by middleware.ts to issue 308 permanent redirects.
 *
 * Keys are exact pathnames (no trailing slash, no query string).
 * Add entries here as legacy URLs are discovered.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
    "/subscribe": "/contact",
    "/current_actions": "/what-we-do/advocacy#take-action",
    "/take-action": "/what-we-do/advocacy#take-action",

    // Legacy WordPress /donate1/* pages
    "/donate1/hay-bale": "/donate",
    "/donate1/memoriam-gifts": "/donate",
    "/donate1/sponsor-a-horse": "/donate/sponsor-a-horse",
    "/donate1/sponsor-a-burro-2": "/donate/sponsor-a-burro",
    "/donate1/sponsor-a-herd-2": "/donate",
}

/**
 * Prefix redirects: any pathname matching the key OR starting with `key + "/"`
 * is redirected to the value. Use for collapsing whole legacy subtrees onto
 * a single new-site page.
 */
export const LEGACY_PREFIX_REDIRECTS: Record<string, string> = {
    "/learn": "/resources/learn",
    // Catch-all for any /donate1/* path not matched by an exact rule above
    // or by the parameterized horse-sponsor matcher in middleware.ts.
    "/donate1": "/donate",
}

