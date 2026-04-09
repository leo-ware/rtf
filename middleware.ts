import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { LEGACY_PREFIX_REDIRECTS, LEGACY_REDIRECTS } from '@/lib/legacyRedirects';

// Matches legacy WordPress date-based blog URLs of the exact shape
// /YYYY/MM/DD/<slug>(/), e.g. /2017/01/06/judges-corral-arguments...
// Used to permanently redirect to /resources/news/article/<slug>.
const LEGACY_DATED_BLOG_PATH = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/;

// Matches legacy WordPress per-horse sponsorship URLs of the shape
// /donate1/sponsor/<horse-slug>(/), e.g. /donate1/sponsor/angel
// Used to permanently redirect to /horses/our-horses/<horse-slug>.
const LEGACY_HORSE_SPONSOR_PATH = /^\/donate1\/sponsor\/([^/]+)\/?$/;

export default clerkMiddleware(async (auth, req) => {
    const pathname = req.nextUrl.pathname;
    const normalized = pathname.length > 1 && pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname;

    // 1. Exact static redirects (see lib/legacyRedirects.ts).
    const staticTarget = LEGACY_REDIRECTS[normalized];
    if (staticTarget) {
        // Resolve target against the current origin so hashes/queries are preserved.
        const url = new URL(staticTarget, req.nextUrl.origin);
        return NextResponse.redirect(url, 308);
    }

    // 2. Parameterized regex matchers, most specific first.
    const datedBlogMatch = pathname.match(LEGACY_DATED_BLOG_PATH);
    if (datedBlogMatch) {
        const slug = datedBlogMatch[4];
        const url = req.nextUrl.clone();
        url.pathname = `/resources/news/article/${slug}`;
        return NextResponse.redirect(url, 308);
    }

    const horseSponsorMatch = pathname.match(LEGACY_HORSE_SPONSOR_PATH);
    if (horseSponsorMatch) {
        const horseSlug = horseSponsorMatch[1];
        const url = req.nextUrl.clone();
        url.pathname = `/horses/our-horses/${horseSlug}`;
        return NextResponse.redirect(url, 308);
    }

    // 3. Prefix catch-alls: collapse whole legacy subtrees onto a single page.
    for (const [prefix, target] of Object.entries(LEGACY_PREFIX_REDIRECTS)) {
        if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
            const url = new URL(target, req.nextUrl.origin);
            return NextResponse.redirect(url, 308);
        }
    }
}, {
    authorizedParties: [
        'https://returntofreedom.org',
        'https://rtf.leoware.io',
    ],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!ingest|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};