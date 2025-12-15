import { query } from "./_generated/server"

export const fetchSocialLinks = query({
    handler: async () => {
        return {
            facebook: "https://www.facebook.com/returntofreedom/",
            instagram: "https://www.instagram.com/returntofreedom/",
            youtube: "https://www.youtube.com/@returntofreedomwhc",
            twitter: "https://x.com/ReturnToFreedom",
        }
    }
})
