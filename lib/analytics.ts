import posthog from "posthog-js"

export const AnalyticsEvents = {
    // Donations
    DONATE_DIALOG_OPENED: "donate_dialog_opened",
    DONATE_PATHWAY_SELECTED: "donate_pathway_selected",
    DONATE_PATHWAY_CARD_CLICKED: "donate_pathway_card_clicked",
    DONATION_COMPLETED: "donation_completed",
    SPONSOR_HORSE_CLICKED: "sponsor_horse_clicked",
    SPONSOR_HERD_DIALOG_OPENED: "sponsor_herd_dialog_opened",
    DONATION_CALLOUT_CLICKED: "donation_callout_clicked",

    // Events
    EVENT_REGISTER_CLICKED: "event_register_clicked",
    EVENT_VIEWED: "event_viewed",

    // Contact
    CONTACT_FORM_SUBMITTED: "contact_form_submitted",

    // Content views
    HORSE_PROFILE_VIEWED: "horse_profile_viewed",
    HERD_PROFILE_VIEWED: "herd_profile_viewed",
    ARTICLE_VIEWED: "article_viewed",
    DOCUMENT_OPENED: "document_opened",

    // Engagement
    EXTERNAL_LINK_CLICKED: "external_link_clicked",
    SHOP_LINK_CLICKED: "shop_link_clicked",
} as const

export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents]

export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, unknown>) => {
    posthog.capture(event, properties)
}
