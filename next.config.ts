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
};

export default nextConfig;
