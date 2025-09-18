import { mutation } from "./_generated/server"
import { v } from "convex/values"

// Seed function to add sample events
export const seedEvents = mutation({
    args: {},
    returns: v.null(),
    handler: async (ctx) => {
        const now = Date.now()
        const oneDay = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        
        const sampleEvents = [
            {
                title: "Wild Horse Photo Safari",
                description: "Join us for an amazing photo safari to capture the beauty of wild horses in their natural habitat. Professional photography tips included.",
                startDate: now + (7 * oneDay), // 7 days from now
                endDate: now + (7 * oneDay) + (4 * 60 * 60 * 1000), // 4 hours later
                location: "Owyhee Desert, Nevada",
                eventType: "photo_safari" as const,
                maxAttendees: 12,
                currentAttendees: 8,
                price: 150,
                isPublic: true,
                requiresRegistration: true,
                contactEmail: "photosafari@rtf.org",
                contactPhone: "(555) 123-4567",
                imageUrl: "/img/photo-safari-sample.jpg",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            },
            {
                title: "Volunteer Cleanup Day",
                description: "Help us maintain the sanctuary grounds and care for our rescued horses. All skill levels welcome!",
                startDate: now + (3 * oneDay), // 3 days from now
                endDate: now + (3 * oneDay) + (6 * 60 * 60 * 1000), // 6 hours later
                location: "RTF Sanctuary",
                eventType: "volunteer" as const,
                maxAttendees: 25,
                currentAttendees: 15,
                price: 0,
                isPublic: true,
                requiresRegistration: true,
                contactEmail: "volunteer@rtf.org",
                contactPhone: "(555) 123-4568",
                imageUrl: "/img/volunteer-sample.jpg",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            },
            {
                title: "Educational Tour: Wild Horse Conservation",
                description: "Learn about wild horse conservation efforts, their natural behavior, and how you can help protect these magnificent animals.",
                startDate: now + (10 * oneDay), // 10 days from now
                endDate: now + (10 * oneDay) + (2 * 60 * 60 * 1000), // 2 hours later
                location: "RTF Education Center",
                eventType: "educational" as const,
                maxAttendees: 30,
                currentAttendees: 22,
                price: 25,
                isPublic: true,
                requiresRegistration: true,
                contactEmail: "education@rtf.org",
                contactPhone: "(555) 123-4569",
                imageUrl: "/img/education-sample.jpg",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            },
            {
                title: "Guided Sanctuary Tour",
                description: "Take a guided tour of our sanctuary and meet our rescued horses. Perfect for families and horse enthusiasts.",
                startDate: now + (5 * oneDay), // 5 days from now
                endDate: now + (5 * oneDay) + (90 * 60 * 1000), // 90 minutes later
                location: "RTF Sanctuary",
                eventType: "tour" as const,
                maxAttendees: 20,
                currentAttendees: 12,
                price: 35,
                isPublic: true,
                requiresRegistration: true,
                contactEmail: "tours@rtf.org",
                contactPhone: "(555) 123-4570",
                imageUrl: "/img/tour-sample.jpg",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            },
            {
                title: "Annual Fundraising Gala",
                description: "Join us for our annual fundraising gala to support wild horse conservation. Dinner, silent auction, and special presentations.",
                startDate: now + (14 * oneDay), // 14 days from now
                endDate: now + (14 * oneDay) + (4 * 60 * 60 * 1000), // 4 hours later
                location: "Grand Ballroom, Las Vegas",
                eventType: "fundraising" as const,
                maxAttendees: 200,
                currentAttendees: 145,
                price: 150,
                isPublic: true,
                requiresRegistration: true,
                contactEmail: "gala@rtf.org",
                contactPhone: "(555) 123-4571",
                imageUrl: "/img/gala-sample.jpg",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            },
            {
                title: "Youth Horse Care Workshop",
                description: "Special workshop for kids ages 8-16 to learn about horse care, grooming, and basic handling techniques.",
                startDate: now + (12 * oneDay), // 12 days from now
                endDate: now + (12 * oneDay) + (3 * 60 * 60 * 1000), // 3 hours later
                location: "RTF Youth Center",
                eventType: "educational" as const,
                maxAttendees: 15,
                currentAttendees: 9,
                price: 45,
                isPublic: true,
                requiresRegistration: true,
                contactEmail: "youth@rtf.org",
                contactPhone: "(555) 123-4572",
                imageUrl: "/img/youth-sample.jpg",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            },
            {
                title: "Private Donor Meeting",
                description: "Private meeting with major donors to discuss upcoming conservation projects and funding needs.",
                startDate: now + (2 * oneDay), // 2 days from now
                endDate: now + (2 * oneDay) + (2 * 60 * 60 * 1000), // 2 hours later
                location: "RTF Conference Room",
                eventType: "other" as const,
                maxAttendees: 8,
                currentAttendees: 6,
                price: 0,
                isPublic: false,
                requiresRegistration: false,
                contactEmail: "development@rtf.org",
                contactPhone: "(555) 123-4573",
                imageUrl: "",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            },
            {
                title: "Sunset Horse Photography Session",
                description: "Capture stunning sunset photos of our horses in the golden hour. Professional photographer will provide guidance.",
                startDate: now + (8 * oneDay), // 8 days from now
                endDate: now + (8 * oneDay) + (2 * 60 * 60 * 1000), // 2 hours later
                location: "RTF Pasture Overlook",
                eventType: "photo_safari" as const,
                maxAttendees: 10,
                currentAttendees: 7,
                price: 85,
                isPublic: true,
                requiresRegistration: true,
                contactEmail: "photography@rtf.org",
                contactPhone: "(555) 123-4574",
                imageUrl: "/img/sunset-photo-sample.jpg",
                createdBy: "user_placeholder" as any,
                createdAt: now,
                updatedAt: now,
            }
        ]

        // Insert all sample events
        for (const event of sampleEvents) {
            await ctx.db.insert("events", event)
        }

        return null
    },
})
