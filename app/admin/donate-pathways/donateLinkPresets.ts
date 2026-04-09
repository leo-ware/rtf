export type DonateLinkPreset = {
    label: string
    path: string
}

export const DONATE_LINK_PRESETS: DonateLinkPreset[] = [
    { label: "Donate (main)", path: "/donate" },
    { label: "Capital Campaign", path: "/donate/capital-campaign" },
    { label: "Corporate Giving", path: "/donate/corporate-giving" },
    { label: "Other Ways to Give", path: "/donate/other-ways-to-give" },
    { label: "Planned Giving", path: "/donate/planned-giving" },
    { label: "Sponsor a Burro", path: "/donate/sponsor-a-burro" },
    { label: "Sponsor a Horse", path: "/donate/sponsor-a-horse" },
    { label: "Veterinary Fund", path: "/donate/veterinary-fund" },
    { label: "Wishlist", path: "/donate/wishlist" },
]
