import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.convex.cloud",
            },
        ],
    },
    turbopack: {
        root: process.cwd(),
    },
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
        ]
    },
    async redirects() {
        return [
            // Donate path changes
            {
                source: "/donate1",
                destination: "/donate",
                permanent: true,
            },
            {
                source: "/donate1/:path*",
                destination: "/donate/:path*",
                permanent: true,
            },
            // Visit path changes
            {
                source: "/visit",
                destination: "/visit-us",
                permanent: true,
            },
            {
                source: "/visit/:path*",
                destination: "/visit-us/:path*",
                permanent: true,
            },
            // Weddings → Host Your Event
            {
                source: "/visit-us/weddings",
                destination: "/visit-us/host-your-event",
                permanent: true,
            },
            // Learn path changes
            {
                source: "/learn",
                destination: "/resources/learn",
                permanent: true,
            },
            {
                source: "/learn/:path*",
                destination: "/resources/learn/:path*",
                permanent: true,
            },
            // News path changes
            {
                source: "/news",
                destination: "/resources/news",
                permanent: true,
            },
            {
                source: "/news/:path*",
                destination: "/resources/news/:path*",
                permanent: true,
            },
            // Take action path changes
            {
                source: "/take-action",
                destination: "/resources/take-action",
                permanent: true,
            },
            {
                source: "/take-action/:path*",
                destination: "/resources/take-action/:path*",
                permanent: true,
            },
            // About staff/board redirects
            {
                source: "/about/staff",
                destination: "/about/people",
                permanent: true,
            },
            {
                source: "/about/board-of-directors",
                destination: "/about/people",
                permanent: true,
            },
            // Old WordPress sanctuary horse paths
            {
                source: "/what-we-do/sanctuary/our-horses/:slug",
                destination: "/horses/our-horses/:slug",
                permanent: true,
            },
            {
                source: "/what-we-do/sanctuary/our-horses",
                destination: "/horses/our-horses",
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
