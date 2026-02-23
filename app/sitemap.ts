import type { MetadataRoute } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

const BASE_URL = "https://returntofreedom.org"

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        // Main pages
        { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
        { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/about/people`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/about/history`, changeFrequency: "yearly", priority: 0.6 },
        { url: `${BASE_URL}/about/financials`, changeFrequency: "yearly", priority: 0.5 },
        { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },

        // Donate pages
        { url: `${BASE_URL}/donate`, changeFrequency: "monthly", priority: 0.9 },
        { url: `${BASE_URL}/donate/sponsor-a-horse`, changeFrequency: "monthly", priority: 0.8 },

        // Horses pages
        { url: `${BASE_URL}/horses`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/horses/our-horses`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/horses/herds`, changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/horses/in-memoriam`, changeFrequency: "monthly", priority: 0.6 },

        // Resources pages
        { url: `${BASE_URL}/resources`, changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/resources/news`, changeFrequency: "daily", priority: 0.8 },
        { url: `${BASE_URL}/resources/learn`, changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/resources/take-action`, changeFrequency: "weekly", priority: 0.7 },

        // Visit Us pages
        { url: `${BASE_URL}/visit-us`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/visit-us/events`, changeFrequency: "daily", priority: 0.8 },
        { url: `${BASE_URL}/visit-us/programs`, changeFrequency: "weekly", priority: 0.7 },

        // What We Do pages
        { url: `${BASE_URL}/what-we-do`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/what-we-do/sanctuary`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/what-we-do/advocacy`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/what-we-do/education`, changeFrequency: "monthly", priority: 0.7 },
    ]

    // Fetch dynamic data from Convex
    const [
        articleSlugs,
        animalSlugs,
        herdSlugs,
        educationArticleSlugs,
        programGroups,
        events,
    ] = await Promise.all([
        fetchQuery(api.articles.listPublicSlugs, {}).catch(() => []),
        fetchQuery(api.animals.listPublicSlugs, {}).catch(() => []),
        fetchQuery(api.herds.listPublicSlugs, {}).catch(() => []),
        fetchQuery(api.educationArticles.listPublicSlugs, {}).catch(() => []),
        fetchQuery(api.programs.getPublicProgramGroups, {}).catch(() => []),
        fetchQuery(api.events.getPublicEvents, {}).catch(() => []),
    ])

    // Dynamic article routes
    const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug: string) => ({
        url: `${BASE_URL}/resources/news/article/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }))

    // Dynamic animal (horse) routes
    const animalRoutes: MetadataRoute.Sitemap = animalSlugs.map((slug: string) => ({
        url: `${BASE_URL}/horses/our-horses/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }))

    // Dynamic herd routes
    const herdRoutes: MetadataRoute.Sitemap = herdSlugs.map((slug: string) => ({
        url: `${BASE_URL}/horses/herds/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }))

    // Dynamic education article routes
    const educationRoutes: MetadataRoute.Sitemap = educationArticleSlugs.map((slug: string) => ({
        url: `${BASE_URL}/resources/learn/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }))

    // Dynamic program group routes
    const programRoutes: MetadataRoute.Sitemap = programGroups.map((group: { _id: string }) => ({
        url: `${BASE_URL}/visit-us/programs/${group._id}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }))

    // Dynamic event routes
    const eventRoutes: MetadataRoute.Sitemap = events.map((event: { _id: string }) => ({
        url: `${BASE_URL}/visit-us/events/${event._id}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }))

    return [
        ...staticRoutes,
        ...articleRoutes,
        ...animalRoutes,
        ...herdRoutes,
        ...educationRoutes,
        ...programRoutes,
        ...eventRoutes,
    ]
}

export default sitemap
