"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import Link from "next/link"

const SocialLinks = () => {
    const socialLinks = useQuery(api.socialLinks.fetchSocialLinks)
    return (
        <>
            {socialLinks?.instagram && (
                <Link href={socialLinks?.instagram}>
                    <FaInstagram size={30} />
                </Link>
            )}
            {socialLinks?.facebook && (
                <Link href={socialLinks?.facebook}>
                <FaFacebook size={30} />
                </Link>
            )}
            {socialLinks?.youtube && (
                <Link href={socialLinks?.youtube}>
                    <FaYoutube size={30} />
                </Link>
            )}
            {socialLinks?.twitter && (
                <Link href={socialLinks?.twitter}>
                    <FaXTwitter size={30} />
                </Link>
            )}
        </>
    )
}

export default SocialLinks