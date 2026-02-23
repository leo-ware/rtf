import type { MetadataRoute } from "next"

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/api/"],
        },
        sitemap: "https://returntofreedom.org/sitemap.xml",
    }
}

export default robots
