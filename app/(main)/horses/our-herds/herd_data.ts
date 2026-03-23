import { StaticImageData } from "next/image"

import AlpineHerdImage from "./imgs/alpine_herd_hero.jpg"
import AlpineHerdMap from "./imgs/alpine-herd-map.png"


type TimelineItemType = {
    date: string
    name: string
    description: string
    image?: StaticImageData
}

type HerdType = {
    name: string
    description: string
    sponsorshipPitch: string
    image?: StaticImageData
    timeline: TimelineItemType[]
}

export const alpineHerd: HerdType = {
    name: "Alpine Herd",
    description: `
        Once roaming freely through the rugged pine forests of Alpine, 
        Arizona, this herd represents one of the most recent and urgent 
        rescues in Return to Freedom's history. In late 2023, following 
        controversial government removals, dozens of Alpine wild 
        horses—many pregnant mares—were shipped to Texas auction yards, 
        facing near-certain sale to kill buyers. Return to Freedom, 
        alongside dedicated partners and advocates, intervened to secure 
        their safety. Today, over 55 Alpine horses, including newborn 
        foals, live peacefully at our California sanctuary—reclaiming 
        the freedom that was nearly lost.
    `,
    sponsorshipPitch: `
        Your sponsorship helps provide daily feed, veterinary care, and 
        open pasture for the Alpine herd,—wild horses rescued from 
        auction and now living safely at our San Luis Obispo 
        sanctuary. By sponsoring the herd, you help ensure they continue 
        to live together on our sanctuary.
        `,
    image: AlpineHerdImage,
    timeline: [
        {
            date: "October 2023",
            name: "A Herd in Peril",
            description: `
                Dozens of Alpine wild horses were captured from the 
                Apache-Sitgreaves National Forest in Arizona under a 
                controversial roundup. These horses had lived freely 
                for generations, forming tight family bands and 
                contributing to the biodiversity of their mountain 
                ecosystem. The roundup, carried out under disputed 
                jurisdiction, drew national outcry.
            `,
            image: AlpineHerdMap,
        },
        {
            date: "November 2023",
            name: "Facing the Kill Pens",
            description: `
                After capture, the horses were sent to a Texas auction 
                where kill buyers were present—placing them at immediate 
                risk of being sold for slaughter. Advocates across the 
                country mobilized to track, document, and intervene.
            `
        },
        {
            date: "December 2023",
            name: "A Race Against Time",
            description: `
                Return to Freedom, working with partner organizations and 
                donors, launched an emergency rescue effort. Within days, 
                RTF secured transport, veterinary care, and quarantine 
                facilities, saving 46 Alpine horses, including pregnant 
                mares and several young foals.
            `
        },
        {
            date: "January-March 2024",
            name: "New Life, New Beginnings",
            description: `
                After transport to California, the rescued Alpines were given 
                time to heal and re-establish their bonds. Several mares gave 
                birth safely at sanctuary, increasing the herd to 55 individuals. 
                Many arrived thin, traumatized, and dehydrated—but quickly 
                began to recover under care.
            `
        }
    ]
}